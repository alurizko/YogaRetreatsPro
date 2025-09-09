import { useState } from "react";
import { Link, useLocation } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Clover, User, ChevronDown, Menu, X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../App";
import AuthModal from "./AuthModal";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isGoogleRegisterModalOpen, setGoogleRegisterModalOpen] = useState(false);
  const [isGoogleLoginModalOpen, setGoogleLoginModalOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showGoogleRegisterPassword, setShowGoogleRegisterPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [googleRegisterError, setGoogleRegisterError] = useState("");
  const [googleRegisterLoading, setGoogleRegisterLoading] = useState(false);
  const [googleLoginError, setGoogleLoginError] = useState("");
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isPartnerRegisterModalOpen, setIsPartnerRegisterModalOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showGoogleLoginPassword, setShowGoogleLoginPassword] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    company: "",
    experience: "",
    password: "",
    terms: false
  });
  const [partnerRegistrationLoading, setPartnerRegistrationLoading] = useState(false);
  const [partnerRegistrationError, setPartnerRegistrationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  const handleGoogleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleRegisterError("");
    setGoogleRegisterLoading(true);
    // Placeholder implementation
    setTimeout(() => {
      setGoogleRegisterLoading(false);
      setGoogleRegisterModalOpen(false);
    }, 1000);
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleLoginError("");
    // Placeholder implementation
    setTimeout(() => {
      setGoogleLoginModalOpen(false);
    }, 1000);
  };

  const setLocation = (path: string) => {
    window.location.href = path;
  };

  const handlePartnerFormChange = (field: string, value: string | boolean) => {
    setPartnerFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePartnerRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerRegistrationError("");
    setPartnerRegistrationLoading(true);

    try {
      // Валидация
      if (!partnerFormData.name || !partnerFormData.surname || !partnerFormData.email || !partnerFormData.password) {
        throw new Error("Пожалуйста, заполните все обязательные поля");
      }

      if (!partnerFormData.terms) {
        throw new Error("Необходимо согласиться с условиями использования");
      }

      if (partnerFormData.password.length < 8) {
        throw new Error("Пароль должен содержать минимум 8 символов");
      }

      // Отправка данных на сервер
      const response = await fetch('/api/auth/register-partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: partnerFormData.name,
          surname: partnerFormData.surname,
          email: partnerFormData.email,
          phone: partnerFormData.phone,
          company: partnerFormData.company,
          experience: partnerFormData.experience,
          password: partnerFormData.password,
          role: 'organizer'
        }),
      });

      // Проверяем статус ответа перед парсингом JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
      }

      // Проверяем, что ответ содержит JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText);
        throw new Error('Сервер вернул некорректный ответ');
      }

      const result = await response.json();

      if (response.ok && result.success) {
        // Успешная регистрация
        alert("Добро пожаловать! Аккаунт партнера успешно создан. Теперь вы можете добавлять ретриты.");

        // Обновляем состояние аутентификации
        // login(result.user); // Временно закомментировано

        // Закрываем модальное окно и перенаправляем
        setIsPartnerRegisterModalOpen(false);
        setPartnerFormData({
          name: "",
          surname: "",
          email: "",
          phone: "",
          company: "",
          experience: "",
          password: "",
          terms: false
        });

        // Перенаправляем на страницу добавления ретрита
        setTimeout(() => {
          window.location.href = '/organizer/add-retreat';
        }, 1000);

      } else {
        throw new Error(result.message || "Ошибка при регистрации партнера");
      }
    } catch (error: any) {
      console.error("Ошибка регистрации партнера:", error);
      setPartnerRegistrationError(error.message || "Произошла ошибка при регистрации");
    } finally {
      setPartnerRegistrationLoading(false);
    }
  };


  return (
    <div>
      <header className="bg-[#fff6f0] shadow-sm sticky top-0 z-50">
        <div className="flex h-16 items-center">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center pl-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-forest-green hover:text-warm-orange transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* 1. Логотип слева с отступом */}
          <div className="flex-1 flex justify-start pl-[40px] md:pl-[40px] pl-4">
            <Link href="/">
              <div className="flex items-center text-2xl font-bold text-forest-green cursor-pointer">
                <Clover className="mr-2" />
                YogaRetreat
              </div>
            </Link>
          </div>
          {/* 2. 'Ретриты' - скрыто на мобильных */}
          <div className="hidden md:flex flex-1 justify-center">
            <Link href="/retreats" className="text-forest-green hover:text-warm-orange transition-colors duration-200 font-semibold">
              Ретриты
            </Link>
          </div>
          {/* 3. 'Категории' - скрыто на мобильных */}
          <div className="hidden md:flex flex-1 justify-center">
            <Link href="/categories" className="text-forest-green hover:text-warm-orange transition-colors duration-200 font-semibold">
              Категории
            </Link>
          </div>
          {/* 4. Кнопка входа / аккаунта с выпадающим меню - скрыто на мобильных */}
          <div className="hidden md:flex flex-1 justify-center items-center relative">
            {!isAuthenticated ? (
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
                      setAuthModalMode('login');
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
                      setAuthModalMode('register');
                      setIsAuthModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-[#20B2AA] hover:text-white cursor-pointer flex justify-center"
                  >
                    <span className="font-semibold">Регистрация</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-gray-300 hover:border-[#20B2AA] bg-white hover:bg-gray-50 transition-colors duration-200 text-forest-green hover:text-[#20B2AA] font-semibold">
                    <User className="w-5 h-5" />
                    <span>Аккаунт</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-60 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                    <Link href="/profile" className="w-full">Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                    <Link href="/my-bookings" className="w-full">Мои бронирования</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                    <Link href="/my-trips" className="w-full">Мои поездки</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                    <Link href="/inquiries" className="w-full">Входящие</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem onClick={handleLogout} className="px-4 py-3 cursor-pointer flex justify-center">
                    <span className="font-semibold text-red-600">Выход</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {/* 5. 'Стать организатором' справа с отступом - скрыто на мобильных */}
          <div className="hidden md:flex flex-1 justify-end pr-[40px]">
            <button
              onClick={() => setIsPartnerRegisterModalOpen(true)}
              className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green"
              style={{ display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000 }}
            >
              Стать организатором
            </button>
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

      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        initialMode={authModalMode}
      />

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
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  console.log('Все данные авторизации очищены');
                }}
                className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
              >
                Очистить все данные авторизации
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('Auth state:', { isAuthenticated, user });
                  console.log('LocalStorage:', localStorage.getItem('token'));
                }}
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
        <Dialog open={isGoogleLoginModalOpen} onOpenChange={setGoogleLoginModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Вход через Google</DialogTitle>
              <DialogDescription className="text-center">
                Введите данные вашего Google аккаунта для входа
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {!showRegisterForm ? (
                <form className="space-y-4" onSubmit={handleGoogleLogin}>
                  <Input
                    type="email"
                    placeholder="Email Google аккаунта"
                    required
                  />
                  <div className="relative">
                    <Input
                      type={showGoogleLoginPassword ? "text" : "password"}
                      placeholder="Пароль Google аккаунта"
                      className="pr-10"
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
                  <Button
                    type="submit"
                    className="w-full bg-warm-orange hover:bg-warm-orange/90 text-black font-semibold"
                    disabled={googleLoginLoading}
                  >
                    {googleLoginLoading ? "Вход..." : "Войти через Google"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center text-red-500 text-sm">{googleLoginError}</div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={() => {
                      setShowRegisterForm(false);
                      setGoogleLoginModalOpen(false);
                      setGoogleRegisterModalOpen(true);
                    }}
                  >
                    Зарегистрироваться через Google
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Partner Registration Modal */}
      {isPartnerRegisterModalOpen && (
        <Dialog open={isPartnerRegisterModalOpen} onOpenChange={setIsPartnerRegisterModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-forest-green">
                Станьте партнером YogaRetreat
              </DialogTitle>
              <DialogDescription className="text-center text-soft-gray">
                Присоединяйтесь к нашему сообществу организаторов ретритов
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePartnerRegistration} className="space-y-4">
              {partnerRegistrationError && (
                <div className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">
                  {partnerRegistrationError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partner-name">Имя *</Label>
                  <Input
                    id="partner-name"
                    placeholder="Ваше имя"
                    value={partnerFormData.name}
                    onChange={(e) => handlePartnerFormChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="partner-surname">Фамилия *</Label>
                  <Input
                    id="partner-surname"
                    placeholder="Ваша фамилия"
                    value={partnerFormData.surname}
                    onChange={(e) => handlePartnerFormChange('surname', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="partner-email">Email *</Label>
                <Input
                  id="partner-email"
                  type="email"
                  placeholder="your@email.com"
                  value={partnerFormData.email}
                  onChange={(e) => handlePartnerFormChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="partner-phone">Телефон</Label>
                <Input
                  id="partner-phone"
                  type="tel"
                  placeholder="+38 (099) 123-45-67"
                  value={partnerFormData.phone}
                  onChange={(e) => handlePartnerFormChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="partner-company">Название компании/студии</Label>
                <Input
                  id="partner-company"
                  placeholder="Название вашей организации"
                  value={partnerFormData.company}
                  onChange={(e) => handlePartnerFormChange('company', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="partner-experience">Опыт проведения ретритов</Label>
                <select
                  id="partner-experience"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={partnerFormData.experience}
                  onChange={(e) => handlePartnerFormChange('experience', e.target.value)}
                >
                  <option value="">Выберите опыт</option>
                  <option value="beginner">Новичок (0-1 год)</option>
                  <option value="intermediate">Средний (2-5 лет)</option>
                  <option value="advanced">Опытный (5+ лет)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="partner-password">Пароль *</Label>
                <Input
                  id="partner-password"
                  type="password"
                  placeholder="Минимум 8 символов"
                  value={partnerFormData.password}
                  onChange={(e) => handlePartnerFormChange('password', e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="partner-terms"
                  checked={partnerFormData.terms}
                  onChange={(e) => handlePartnerFormChange('terms', e.target.checked)}
                  required
                />
                <Label htmlFor="partner-terms" className="text-sm">
                  Я согласен с условиями использования и политикой конфиденциальности
                </Label>
              </div>
              <Button
                type="submit"
                disabled={partnerRegistrationLoading}
                className="w-full bg-warm-orange hover:bg-warm-orange/90 text-black font-bold py-3 disabled:opacity-60"
              >
                {partnerRegistrationLoading ? "Создание аккаунта..." : "Создать аккаунт партнера"}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Уже есть аккаунт? <button type="button" onClick={() => { setIsPartnerRegisterModalOpen(false); setLoginModalOpen(true); }} className="text-forest-green hover:underline">Войти</button>
              </p>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
