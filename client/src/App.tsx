import { Route, Switch } from "wouter";
import { useState, createContext, useContext, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home";
import Retreats from "./pages/retreats";
import Categories from "./pages/categories";
import CategoryDetail from "./pages/category-detail";
import AddRetreat from "./pages/add-retreat";
import MyTrips from "./pages/my-trips";
import Support from "./pages/support";
import RetreatCategories from "./pages/retreat-categories";
import Profile from "./pages/profile";
import MyBookings from "./pages/my-bookings";
import InquiriesPage from "./pages/inquiries";

// Auth Context
const AuthContext = createContext<{
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (userData: any) => void;
}>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () => {},
  login: () => {}
});

// Export useAuth for Header component
export const useAuth = () => useContext(AuthContext);

export const resetAuthCache = () => {
  // This will be handled by the context
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем состояние аутентификации при загрузке
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Пользователь не аутентифицирован");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

function Router() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fff6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20B2AA] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff6f0] flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/retreats" component={Retreats} />
          <Route path="/my-trips" component={MyTrips} />
          <Route path="/support" component={Support} />
          <Route path="/categories" component={Categories} />
          <Route path="/category/:categoryId" component={CategoryDetail} />
          <Route path="/profile" component={Profile} />
          <Route path="/inquiries" component={InquiriesPage} />
          <Route path="/my-bookings" component={MyBookings} />
          <Route path="/organizer/add-retreat" component={AddRetreat} />
          <Route component={() => <div className="p-8"><h1 className="text-2xl font-bold">404 - Страница не найдена</h1></div>} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
