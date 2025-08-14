import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic auth for tunnel access when env vars are set
if (process.env.TUNNEL_PASSWORD) {
  const expectedUser = process.env.TUNNEL_USER || "user";
  const expectedPass = process.env.TUNNEL_PASSWORD;
  log(`Tunnel basic auth enabled for user '${expectedUser}'`, "express");
  app.use((req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.toString().startsWith("Basic ")) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Secure Tunnel"');
      return res.status(401).send("Authentication required");
    }
    const base64Credentials = authHeader.toString().slice("Basic ".length).trim();
    let decoded = "";
    try {
      decoded = Buffer.from(base64Credentials, "base64").toString("utf8");
    } catch {
      res.setHeader("WWW-Authenticate", 'Basic realm="Secure Tunnel"');
      return res.status(401).send("Invalid authorization header");
    }
    const separatorIndex = decoded.indexOf(":");
    const username = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : decoded;
    const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : "";
    if (username === expectedUser && password === expectedPass) {
      return next();
    }
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Tunnel"');
    return res.status(401).send("Invalid credentials");
  });
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
