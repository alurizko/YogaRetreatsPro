import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clover, Menu, User, Settings, LogOut, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <>
      <header className="bg-[#fff6f0] shadow-sm sticky top-0 z-50">
        <div className="flex h-16 items-center">
          {/* 1. Логотип слева с отступом */}
          <div className="flex-1 flex justify-start pl-[40px]">
            <Link href="/">
              <div className="flex items-center text-2xl font-bold text-forest-green cursor-pointer">
                <Clover className="mr-2" />
                YogaRetreat
              </div>
            </Link>
          </div>
          {/* 2. 'Ретриты' */}
          <div className="flex-1 flex justify-center">
              <Link href="/retreats">
              <a className="text-soft-gray hover:text-forest-green transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green"
                style={{display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000}}>
                Ретриты
              </a>
              </Link>
          </div>
          {/* 3. 'Найти ретрит' */}
          <div className="flex-1 flex justify-center">
            <Link href="/retreats">
              <a className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green"
                style={{display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000}}>
                Найти ретрит
              </a>
                </Link>
          </div>
          {/* 4. 'Войти' */}
          <div className="flex-1 flex justify-center relative">
            {/* Dropdown */}
            <div className="relative group">
              <button
                className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green px-4 py-2 rounded focus:outline-none"
                onClick={() => setDropdownOpen((v) => !v)}
                tabIndex={0}
              >
                Войти
              </button>
              {dropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 min-w-[140px] bg-white border rounded shadow-lg z-50">
                  <button
                    className="block w-full px-4 py-2 hover:bg-warm-orange/20 transition text-center"
                    onClick={() => {
                      setDropdownOpen(false);
                      setRegisterModalOpen(true);
                    }}
                  >
                    Регистрация
                  </button>
                  <button
                    className="block w-full px-4 py-2 hover:bg-warm-orange/20 transition text-center"
                    onClick={() => {
                      setDropdownOpen(false);
                      setLoginModalOpen(true);
                    }}
                  >
                    Войти
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* 5. 'Стать организатором' справа с отступом */}
          <div className="flex-1 flex justify-end pr-[40px]">
            <Link href="/api/login">
              <a className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green"
                style={{display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000}}>
                Стать организатором
              </a>
            </Link>
          </div>
        </div>
      </header>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="space-y-2">
                <Link href="/retreats">
                  <a className="block py-2 text-soft-gray hover:text-forest-green transition-colors">
                    Ретриты
                  </a>
                </Link>
                {isAuthenticated && user?.role === 'organizer' && (
                  <Link href="/organizer/dashboard">
                    <a className="block py-2 text-soft-gray hover:text-forest-green transition-colors">
                      Организаторам
                    </a>
                  </Link>
                )}
                {!isAuthenticated && (
                  <Button 
                    variant="ghost"
                    className="text-soft-gray hover:text-forest-green w-full justify-start p-2"
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Стать организатором
                  </Button>
                )}
              </nav>
            </div>
          )}

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setRegisterModalOpen(false)}>✕</button>
            <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setRegisterError("");
              setRegisterLoading(true);
              const form = e.target as HTMLFormElement;
              const email = (form[0] as HTMLInputElement).value;
              const password = (form[1] as HTMLInputElement).value;
              try {
                const res = await fetch("/api/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Ошибка регистрации");
                localStorage.setItem("token", data.token);
                setRegisterModalOpen(false);
                setLocation("/participant-dashboard");
              } catch (err: any) {
                setRegisterError(err.message || "Ошибка регистрации");
              } finally {
                setRegisterLoading(false);
              }
            }}>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-4 py-2"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  className="w-full border rounded px-4 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {registerError && <div className="text-red-500 text-center text-sm">{registerError}</div>}
              <button
                type="submit"
                className="w-full bg-warm-orange text-black font-semibold py-2 rounded hover:bg-warm-orange/90 disabled:opacity-60"
                disabled={registerLoading}
              >
                {registerLoading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>
            <div className="my-4 text-center text-gray-400">или</div>
            <button
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100"
              onClick={() => window.location.href = '/api/auth/google'}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Зарегистрироваться через Google
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setLoginModalOpen(false)}>✕</button>
            <h2 className="text-2xl font-bold text-center mb-6">Вход</h2>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setLoginError("");
              setLoginLoading(true);
              const form = e.target as HTMLFormElement;
              const email = (form[0] as HTMLInputElement).value;
              const password = (form[1] as HTMLInputElement).value;
              try {
                const res = await fetch("/api/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Ошибка входа");
                localStorage.setItem("token", data.token);
                setLoginModalOpen(false);
                setLocation("/participant-dashboard");
              } catch (err: any) {
                setLoginError(err.message || "Ошибка входа");
              } finally {
                setLoginLoading(false);
              }
            }}>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-4 py-2"
                required
              />
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Пароль"
                  className="w-full border rounded px-4 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {loginError && <div className="text-red-500 text-center text-sm">{loginError}</div>}
              <button
                type="submit"
                className="w-full bg-warm-orange text-black font-semibold py-2 rounded hover:bg-warm-orange/90 disabled:opacity-60"
                disabled={loginLoading}
              >
                {loginLoading ? "Вход..." : "Войти"}
              </button>
            </form>
            <div className="my-4 text-center text-gray-400">или</div>
            <button
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100"
              onClick={() => window.location.href = '/api/auth/google'}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Войти через Google
            </button>
          </div>
        </div>
      )}
    </>
  );
}
