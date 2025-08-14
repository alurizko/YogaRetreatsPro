import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleAuthButtons from "@/components/GoogleAuthButtons";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleGoogleAuth = (mode: 'login' | 'register') => {
    let url = `/api/auth/google?mode=${mode}`;
    if (mode === 'register') {
      url += '&prompt=select_account';
    }
    window.location.href = url;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка входа");
      }

      // Успешный вход - перенаправляем на главную
      window.location.href = "/";
    } catch (err: any) {
      setLoginError(err.message || "Ошибка входа");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Ошибка регистрации");
      }

      // Успешная регистрация - перенаправляем на главную
      window.location.href = "/";
    } catch (err: any) {
      setRegisterError(err.message || "Ошибка регистрации");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться на главную
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Добро пожаловать
            </CardTitle>
            <CardDescription className="text-gray-600">
              Войдите в свой аккаунт или создайте новый
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google OAuth Buttons */}
            <GoogleAuthButtons onGoogleAuth={handleGoogleAuth} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">или</span>
              </div>
            </div>

            {/* Traditional Auth */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                      Пароль
                    </label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Введите пароль"
                        className="h-12 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                      {loginError}
                    </div>
                  )}

                  <Button 
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Вход..." : "Войти"}
                  </Button>

                  <div className="text-center">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Забыли пароль?
                    </Link>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="register-firstName" className="text-sm font-medium text-gray-700">
                        Имя
                      </label>
                      <Input
                        id="register-firstName"
                        name="firstName"
                        type="text"
                        placeholder="Имя"
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="register-lastName" className="text-sm font-medium text-gray-700">
                        Фамилия
                      </label>
                      <Input
                        id="register-lastName"
                        name="lastName"
                        type="text"
                        placeholder="Фамилия"
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                      Пароль
                    </label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Создайте пароль"
                        className="h-12 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Минимум 8 символов
                    </p>
                  </div>

                  {registerError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                      {registerError}
                    </div>
                  )}

                  <Button 
                    type="submit"
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
                    disabled={registerLoading}
                  >
                    {registerLoading ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              <p>
                Продолжая, вы соглашаетесь с нашими{" "}
                <a href="#" className="text-blue-600 hover:underline">Условиями использования</a>
                {" "}и{" "}
                <a href="#" className="text-blue-600 hover:underline">Политикой конфиденциальности</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 