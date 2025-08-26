import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "../App";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ open, onOpenChange, initialMode = 'login' }: AuthModalProps) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Синхронизируем режим при изменении initialMode
  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleGoogleAuth = (mode: 'login' | 'register') => {
    const url = `/api/auth/google?mode=${mode}`;
    window.location.href = url;
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
        let data = null;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        }
        throw new Error((data && data.message) || "Ошибка отправки запроса");
      }
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(err.message || "Ошибка отправки запроса");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitError("");
    
    try {
      if (isLogin) {
        // Вход пользователя
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
        
        let data = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        }
        
        if (!response.ok) {
          throw new Error((data && data.message) || 'Ошибка входа');
        }
        
        // Успешный вход - обновляем контекст
        login(data.user);
        onOpenChange(false);
        
        // Очищаем форму
        setEmail("");
        setPassword("");
        
      } else {
        // Регистрация пользователя
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            firstName: "Новый",
            lastName: "Пользователь", 
            email, 
            password,
            role: "user"
          }),
          credentials: 'include'
        });
        
        let data = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        }
        
        if (!response.ok) {
          throw new Error((data && data.message) || 'Ошибка регистрации');
        }
        
        // Успешная регистрация - обновляем контекст
        login(data.user);
        onOpenChange(false);
        
        // Очищаем форму
        setEmail("");
        setPassword("");
      }
      
    } catch (error: any) {
      setSubmitError(error.message || 'Произошла ошибка');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 border-0 bg-white rounded-lg shadow-xl">
          {/* Header with close button */}
          <div className="relative p-6 pb-4">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? "Войти" : "Регистрация"}
              </h2>
              <p className="text-sm text-gray-600">
                {isLogin ? (
                  <>
                    Уже есть аккаунт?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-[#20B2AA] hover:underline font-medium"
                    >
                      Зарегистрироваться
                    </button>
                  </>
                ) : (
                  <>
                    Уже есть аккаунт?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-[#20B2AA] hover:underline font-medium"
                    >
                      Войти
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="например john@smith.com"
                  className="w-full h-12 border-gray-300 rounded-md focus:border-[#20B2AA] focus:ring-[#20B2AA]"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите ваш пароль"
                    className="w-full h-12 border-gray-300 rounded-md focus:border-[#20B2AA] focus:ring-[#20B2AA] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-[#20B2AA] hover:underline text-sm font-medium"
                  >
                    Забыли пароль?
                  </button>
                </div>
              )}

              {/* Main Action Button */}
              {submitError && (
                <div className="text-red-600 text-sm text-center mb-1">{submitError}</div>
              )}
              <Button type="submit" disabled={submitLoading} className="w-full h-12 bg-[#20B2AA] hover:bg-[#1A9B94] text-white font-semibold rounded-md transition-colors disabled:opacity-60">
                {isLogin ? (submitLoading ? "Вход..." : "Войти") : (submitLoading ? "Открытие..." : "Зарегистрироваться")}
              </Button>
            </form>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleGoogleAuth(isLogin ? 'login' : 'register')}
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-md"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Вход через аккаунт Google
              </Button>

              <Button
                onClick={() => window.location.href = '/auth'}
                variant="outline"
                className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2] font-medium rounded-md"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ИЛИ</span>
              </div>
            </div>

            {/* Partner Login */}
            <Button
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-md"
            >
              Войти как партнер
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Восстановление пароля
            </DialogTitle>
          </DialogHeader>
          {forgotSent ? (
            <div className="py-6 text-center text-green-700">
              Если email зарегистрирован, инструкция по восстановлению отправлена!
            </div>
          ) : (
            <form className="space-y-4 py-4" onSubmit={handleForgot}>
              <label className="block text-sm font-medium text-gray-700 text-left" htmlFor="forgot-email">
                Введите ваш email
              </label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
                placeholder="you@email.com"
                className="w-full h-12"
                autoFocus
              />
              {forgotError && <div className="text-red-600 text-xs">{forgotError}</div>}
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
                disabled={forgotLoading}
              >
                {forgotLoading ? "Отправка..." : "Восстановить пароль"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
