import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
  password_hash: string;
}

const inMemoryUsers = new Map<string, StoredUser>();
const storage = {
  async getUser(id: string): Promise<StoredUser | null> {
    return inMemoryUsers.get(id) || null;
  },
  async upsertUser(user: StoredUser): Promise<StoredUser> {
    inMemoryUsers.set(user.id, user);
    return user;
  },
};

passport.serializeUser((user: any, done) => {
  // Логируем user для отладки
  console.log('serializeUser user:', user);
  // Явно используем profile.id, если user.id отсутствует
  const id = user.id || user.profile?.id || user._id || user.sub;
  if (!id) {
    console.error('serializeUser: no id found in user!', user);
  }
  done(null, id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    console.log('deserializeUser id:', id);
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export function setupGoogleAuth(app: Express) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth не инициализирован: отсутствуют GOOGLE_CLIENT_ID или GOOGLE_CLIENT_SECRET в .env");
    return;
  }

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google profile:', JSON.stringify(profile, null, 2));
      let user = await storage.getUser(profile.id);
      if (!user) {
        console.log('User not found, creating...');
        user = await storage.upsertUser({
          id: profile.id,
          email: String(profile.emails?.[0]?.value || ''),
          name: String(profile.displayName || [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(' ') || 'Google User'),
          role: 'user',
          password_hash: '',
        });
        console.log('User created:', user);
      } else {
        console.log('User found:', user);
      }
      return done(null, user);
    } catch (err) {
      console.error('GoogleStrategy error:', err);
      return done(err);
    }
  }));
    
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get("/api/auth/google/callback", passport.authenticate("google", {
    successRedirect: "/?authSuccess=1",
    failureRedirect: "/"
  }));
}