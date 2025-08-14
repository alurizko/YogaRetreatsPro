import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clover, Menu, User, Settings, LogOut, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useAuth, resetAuthCache } from "@/hooks/useAuth";
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
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  
  // Новые состояния для Google форм
  const [isGoogleRegisterModalOpen, setGoogleRegisterModalOpen] = useState(false);
  const [isGoogleLoginModalOpen, setGoogleLoginModalOpen] = useState(false);
  const [googleRegisterError, setGoogleRegisterError] = useState("");
  const [googleRegisterLoading, setGoogleRegisterLoading] = useState(false);
  const [googleLoginError, setGoogleLoginError] = useState("");
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [showGoogleRegisterPassword, setShowGoogleRegisterPassword] = useState(false);
  const [showGoogleLoginPassword, setShowGoogleLoginPassword] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // Функция для полной очистки данных авторизации
  const clearAllAuthData = () => {
    console.log("🧹 Очищаем все данные авторизации...");
    localStorage.removeItem("token");
    resetAuthCache(); // Сбрасываем кэш авторизации
    // Очищаем куки через API
    fetch("/api/logout", { credentials: "include" });
    // Перезагружаем страницу
    window.location.reload();
  };

  // Функция для диагностики состояния авторизации
  const diagnoseAuthState = () => {
    console.log("🔍 === ДИАГНОСТИКА СОСТОЯНИЯ АВТОРИЗАЦИИ ===");
    
    // Проверяем localStorage
    const token = localStorage.getItem("token");
    console.log("🔍 localStorage token:", token ? token.substring(0, 20) + "..." : "НЕТ");
    
    // Проверяем куки
    console.log("🔍 Все куки:", document.cookie);
    
    // Проверяем кэш авторизации
    console.log("🔍 Кэш авторизации: недоступен в этом компоненте");
    
    // Проверяем текущего пользователя
    console.log("🔍 Текущий пользователь:", user);
    
    // Проверяем состояние аутентификации
    console.log("🔍 isAuthenticated:", isAuthenticated);
    console.log("🔍 === КОНЕЦ ДИАГНОСТИКИ ===");
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка отправки запроса");
      }
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(err.message || "Ошибка отправки запроса");
    } finally {
      setForgotLoading(false);
    }
  };

  // Обработчик регистрации через Google
  const handleGoogleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleRegisterError("");
    setGoogleRegisterLoading(true);
    
    // Принудительно очищаем старые данные перед регистрацией
    console.log("🧹 Очищаем старые данные перед регистрацией...");
    localStorage.removeItem("token");
    
    const form = e.target as HTMLFormElement;
    const firstName = (form[0] as HTMLInputElement).value;
    const lastName = (form[1] as HTMLInputElement).value;
    const email = (form[2] as HTMLInputElement).value;
    const password = (form[3] as HTMLInputElement).value;
    
    console.log("🔍 [Google Register] Отправляем данные:", { firstName, lastName, email });
    
    try {
      const res = await fetch("/api/google-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
        credentials: "include",
      });
      const data = await res.json();
      
      console.log("🔍 [Google Register] Ответ сервера:", data);
      
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Пользователь с таким Email уже существует. Выберите другой email.");
        }
        throw new Error(data.message || "Ошибка регистрации");
      }
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("🔍 [Google Register] Сохранен токен:", data.token.substring(0, 20) + "...");
      }
      
      console.log("🔍 [Google Register] Переходим в dashboard для пользователя:", data.user?.email);
      setGoogleRegisterModalOpen(false);
      setLocation("/participant-dashboard");
    } catch (err: any) {
      setGoogleRegisterError(err.message || "Ошибка регистрации");
    } finally {
      setGoogleRegisterLoading(false);
    }
  };

  // Обработчик входа через Google
  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleLoginError("");
    setGoogleLoginLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;
    
    try {
      const res = await fetch("/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 404) {
          setGoogleLoginError("Пользователь с такими данными не зарегистрирован");
          setShowRegisterForm(true);
          return;
        }
        throw new Error(data.message || "Ошибка входа");
      }
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      setGoogleLoginModalOpen(false);
      setLocation("/participant-dashboard");
    } catch (err: any) {
      setGoogleLoginError(err.message || "Ошибка входа");
    } finally {
      setGoogleLoginLoading(false);
    }
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
            <Link href="/retreats" className="text-soft-gray hover:text-forest-green transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green" style={{display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000}}>
              Ретриты
            </Link>
          </div>
          {/* 3. 'Найти ретрит' */}
          <div className="flex-1 flex justify-center">
            <Link href="/retreats" className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green" style={{display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000}}>
              Найти ретрит
            </Link>
          </div>
          {/* 4. Login Button with User Icon */}
          <div className="flex-1 flex justify-center items-center relative">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-gray-300 hover:border-[#20B2AA] bg-white hover:bg-gray-50 transition-colors duration-200 text-forest-green hover:text-[#20B2AA] font-semibold">
                  <User className="w-5 h-5" />
                  <span>Войти</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                <DropdownMenuItem 
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-[#20B2AA] hover:text-white cursor-pointer flex justify-center"
                >
                  <span className="font-semibold">Вход</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem 
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-[#20B2AA] hover:text-white cursor-pointer flex justify-center"
                >
                  <span className="font-semibold">Регистрация</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* 5. 'Стать организатором' справа с отступом */}
          <div className="flex-1 flex justify-end pr-[40px]">
            <Link href="/organizer/add-retreat" className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green" style={{display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000}}>
              Стать организатором
            </Link>
          </div>
        </div>
      </header>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="space-y-2">
                <Link href="/retreats" className="block py-2 text-soft-gray hover:text-forest-green transition-colors">
                  Ретриты
                </Link>
                {isAuthenticated && user?.role === 'organizer' && (
                  <Link href="/organizer/dashboard" className="block py-2 text-soft-gray hover:text-forest-green transition-colors">
                    Организаторам
                  </Link>
                )}
                {!isAuthenticated && (
                  <>
                    <Link href="/auth" className="block py-2 text-soft-gray hover:text-forest-green transition-colors">
                      Войти / Регистрация
                    </Link>
                    <Button 
                      variant="ghost"
                      className="text-soft-gray hover:text-forest-green w-full justify-start p-2"
                      onClick={() => window.location.href = "/api/login"}
                    >
                      Стать организатором
                    </Button>
                  </>
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
              const firstName = (form[0] as HTMLInputElement).value;
              const lastName = (form[1] as HTMLInputElement).value;
              const email = (form[2] as HTMLInputElement).value;
              const password = (form[3] as HTMLInputElement).value;
              try {
                const res = await fetch("/api/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ firstName, lastName, email, password, role: "user" }),
                  credentials: "include",
                });
                let data = null;
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                  data = await res.json();
                }
                if (!res.ok) throw new Error((data && data.message) || "Ошибка регистрации");
                if (data && data.token) {
                  localStorage.setItem("token", data.token);
                }
                setRegisterModalOpen(false);
                setLocation("/participant-dashboard");
              } catch (err: any) {
                setRegisterError(err.message || "Ошибка регистрации");
              } finally {
                setRegisterLoading(false);
              }
            }}>
              <input
                type="text"
                placeholder="Имя"
                className="w-full border rounded px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Фамилия"
                className="w-full border rounded px-4 py-2"
                required
              />
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
              onClick={() => {
                setRegisterModalOpen(false);
                // Используем настоящий Google OAuth для регистрации
                window.location.href = '/api/auth/google?mode=register';
              }}
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
                  body: JSON.stringify({ email, password }),
                  credentials: "include",
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
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline focus:outline-none mb-2"
                onClick={() => { setForgotOpen(true); setLoginModalOpen(false); }}
              >
                Забыли пароль?
              </button>
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
              onClick={() => {
                setLoginModalOpen(false);
                // Используем настоящий Google OAuth для входа
                window.location.href = '/api/auth/google?mode=login';
              }}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Войти через Google
            </button>
          </div>
        </div>
      )}
      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(""); }}>
              ✕
            </button>
            <h2 className="text-xl font-bold text-center text-forest-green mb-4">Восстановление пароля</h2>
            {forgotSent ? (
              <div className="py-6 text-center text-green-700">
                Если email зарегистрирован, инструкция по восстановлению отправлена!
              </div>
            ) : (
              <form className="space-y-4 py-4" onSubmit={handleForgot}>
                <label className="block text-sm font-medium text-gray-700 text-left" htmlFor="forgot-email">
                  Введите ваш email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  placeholder="you@email.com"
                  className="w-full border rounded px-4 py-2"
                  autoFocus
                />
                {forgotError && <div className="text-red-600 text-xs">{forgotError}</div>}
                <button
                  type="submit"
                  className="w-full bg-forest-green text-white hover:bg-forest-green/90 py-2 rounded"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Отправка..." : "Восстановить пароль"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Google Register Modal */}
      {isGoogleRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setGoogleRegisterModalOpen(false)}>✕</button>
            <h2 className="text-2xl font-bold text-center mb-6">Регистрация через Google</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Введите данные вашего Google аккаунта для регистрации
            </p>
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Важно:</strong> Если у вас проблемы с авторизацией, очистите данные:
              </p>
              <button
                type="button"
                onClick={clearAllAuthData}
                className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
              >
                Очистить все данные авторизации
              </button>
              <button
                type="button"
                onClick={diagnoseAuthState}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Диагностика
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleGoogleRegister}>
              <input
                type="text"
                placeholder="Имя"
                className="w-full border rounded px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Фамилия"
                className="w-full border rounded px-4 py-2"
                required
              />
              <input
                type="email"
                placeholder="Email Google аккаунта"
                className="w-full border rounded px-4 py-2"
                required
              />
              <div className="relative">
                <input
                  type={showGoogleRegisterPassword ? "text" : "password"}
                  placeholder="Пароль Google аккаунта"
                  className="w-full border rounded px-4 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  onClick={() => setShowGoogleRegisterPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showGoogleRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {googleRegisterError && <div className="text-red-500 text-center text-sm">{googleRegisterError}</div>}
              <button
                type="submit"
                className="w-full bg-warm-orange text-black font-semibold py-2 rounded hover:bg-warm-orange/90 disabled:opacity-60"
                disabled={googleRegisterLoading}
              >
                {googleRegisterLoading ? "Регистрация..." : "Зарегистрироваться через Google"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Google Login Modal */}
      {isGoogleLoginModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => {
              setGoogleLoginModalOpen(false);
              setShowRegisterForm(false);
              setGoogleLoginError("");
            }}>✕</button>
            <h2 className="text-2xl font-bold text-center mb-6">Вход через Google</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Введите данные вашего Google аккаунта для входа
            </p>
            
            {!showRegisterForm ? (
              <form className="space-y-4" onSubmit={handleGoogleLogin}>
                <input
                  type="email"
                  placeholder="Email Google аккаунта"
                  className="w-full border rounded px-4 py-2"
                  required
                />
                <div className="relative">
                  <input
                    type={showGoogleLoginPassword ? "text" : "password"}
                    placeholder="Пароль Google аккаунта"
                    className="w-full border rounded px-4 py-2 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    onClick={() => setShowGoogleLoginPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showGoogleLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {googleLoginError && <div className="text-red-500 text-center text-sm">{googleLoginError}</div>}
                <button
                  type="submit"
                  className="w-full bg-warm-orange text-black font-semibold py-2 rounded hover:bg-warm-orange/90 disabled:opacity-60"
                  disabled={googleLoginLoading}
                >
                  {googleLoginLoading ? "Вход..." : "Войти через Google"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-red-500 text-sm">{googleLoginError}</div>
                <button
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setGoogleLoginModalOpen(false);
                    setGoogleRegisterModalOpen(true);
                  }}
                >
                  Зарегистрировать нового пользователя
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
