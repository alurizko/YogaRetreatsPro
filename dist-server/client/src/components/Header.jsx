var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Clover, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
export default function Header() {
    var _this = this;
    var _a = useAuth(), isAuthenticated = _a.isAuthenticated, user = _a.user;
    var _b = useState(false), isAuthModalOpen = _b[0], setIsAuthModalOpen = _b[1];
    var _c = useState(false), isMobileMenuOpen = _c[0], setIsMobileMenuOpen = _c[1];
    var _d = useState(false), dropdownOpen = _d[0], setDropdownOpen = _d[1];
    var _e = useState(false), isRegisterModalOpen = _e[0], setRegisterModalOpen = _e[1];
    var _f = useState(false), showPassword = _f[0], setShowPassword = _f[1];
    var _g = useState(false), isLoginModalOpen = _g[0], setLoginModalOpen = _g[1];
    var _h = useState(false), showLoginPassword = _h[0], setShowLoginPassword = _h[1];
    var _j = useState(""), registerError = _j[0], setRegisterError = _j[1];
    var _k = useState(false), registerLoading = _k[0], setRegisterLoading = _k[1];
    var _l = useState(""), loginError = _l[0], setLoginError = _l[1];
    var _m = useState(false), loginLoading = _m[0], setLoginLoading = _m[1];
    var _o = useLocation(), setLocation = _o[1];
    var handleLogout = function () {
        window.location.href = "/api/logout";
    };
    return (<>
      <header className="bg-[#fff6f0] shadow-sm sticky top-0 z-50">
        <div className="flex h-16 items-center">
          {/* 1. Логотип слева с отступом */}
          <div className="flex-1 flex justify-start pl-[40px]">
            <Link href="/">
              <div className="flex items-center text-2xl font-bold text-forest-green cursor-pointer">
                <Clover className="mr-2"/>
                YogaRetreat
              </div>
            </Link>
          </div>
          {/* 2. 'Ретриты' */}
          <div className="flex-1 flex justify-center">
              <Link href="/retreats">
              <a className="text-soft-gray hover:text-forest-green transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green" style={{ display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000 }}>
                Ретриты
              </a>
              </Link>
          </div>
          {/* 3. 'Найти ретрит' */}
          <div className="flex-1 flex justify-center">
            <Link href="/retreats">
              <a className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green" style={{ display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000 }}>
                Найти ретрит
              </a>
                </Link>
          </div>
          {/* 4. 'Войти' */}
          <div className="flex-1 flex justify-center relative">
            {/* Dropdown */}
            <div className="relative group">
              <button className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green px-4 py-2 rounded focus:outline-none" onClick={function () { return setDropdownOpen(function (v) { return !v; }); }} tabIndex={0}>
                Войти
              </button>
              {dropdownOpen && (<div className="absolute left-1/2 -translate-x-1/2 mt-2 min-w-[140px] bg-white border rounded shadow-lg z-50">
                  <button className="block w-full px-4 py-2 hover:bg-warm-orange/20 transition text-center" onClick={function () {
                setDropdownOpen(false);
                setRegisterModalOpen(true);
            }}>
                    Регистрация
                  </button>
                  <button className="block w-full px-4 py-2 hover:bg-warm-orange/20 transition text-center" onClick={function () {
                setDropdownOpen(false);
                setLoginModalOpen(true);
            }}>
                    Войти
                  </button>
                </div>)}
            </div>
          </div>
          {/* 5. 'Стать организатором' справа с отступом */}
          <div className="flex-1 flex justify-end pr-[40px]">
            <Link href="/api/login">
              <a className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green" style={{ display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000 }}>
                Стать организатором
              </a>
            </Link>
          </div>
        </div>
      </header>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (<div className="md:hidden py-4 border-t">
              <nav className="space-y-2">
                <Link href="/retreats">
                  <a className="block py-2 text-soft-gray hover:text-forest-green transition-colors">
                    Ретриты
                  </a>
                </Link>
                {isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === 'organizer' && (<Link href="/organizer/dashboard">
                    <a className="block py-2 text-soft-gray hover:text-forest-green transition-colors">
                      Организаторам
                    </a>
                  </Link>)}
                {!isAuthenticated && (<Button variant="ghost" className="text-soft-gray hover:text-forest-green w-full justify-start p-2" onClick={function () { return window.location.href = "/api/login"; }}>
                    Стать организатором
                  </Button>)}
              </nav>
            </div>)}

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}/>

      {/* Register Modal */}
      {isRegisterModalOpen && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={function () { return setRegisterModalOpen(false); }}>✕</button>
            <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
            <form className="space-y-4" onSubmit={function (e) { return __awaiter(_this, void 0, void 0, function () {
                var form, firstName, lastName, email, password, res, data, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.preventDefault();
                            setRegisterError("");
                            setRegisterLoading(true);
                            form = e.target;
                            firstName = form[0].value;
                            lastName = form[1].value;
                            email = form[2].value;
                            password = form[3].value;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, fetch("/api/register", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, password: password, role: "user" })
                                })];
                        case 2:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 3:
                            data = _a.sent();
                            if (!res.ok)
                                throw new Error(data.message || "Ошибка регистрации");
                            localStorage.setItem("token", data.token);
                            setRegisterModalOpen(false);
                            setLocation("/participant-dashboard");
                            return [3 /*break*/, 6];
                        case 4:
                            err_1 = _a.sent();
                            setRegisterError(err_1.message || "Ошибка регистрации");
                            return [3 /*break*/, 6];
                        case 5:
                            setRegisterLoading(false);
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            }); }}>
              <input type="text" placeholder="Имя" className="w-full border rounded px-4 py-2" required/>
              <input type="text" placeholder="Фамилия" className="w-full border rounded px-4 py-2" required/>
              <input type="email" placeholder="Email" className="w-full border rounded px-4 py-2" required/>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Пароль" className="w-full border rounded px-4 py-2 pr-10" required/>
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black" onClick={function () { return setShowPassword(function (v) { return !v; }); }} tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
              {registerError && <div className="text-red-500 text-center text-sm">{registerError}</div>}
              <button type="submit" className="w-full bg-warm-orange text-black font-semibold py-2 rounded hover:bg-warm-orange/90 disabled:opacity-60" disabled={registerLoading}>
                {registerLoading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>
            <div className="my-4 text-center text-gray-400">или</div>
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100" onClick={function () { return window.location.href = '/api/auth/google'; }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
              Зарегистрироваться через Google
            </button>
          </div>
        </div>)}

      {/* Login Modal */}
      {isLoginModalOpen && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={function () { return setLoginModalOpen(false); }}>✕</button>
            <h2 className="text-2xl font-bold text-center mb-6">Вход</h2>
            <form className="space-y-4" onSubmit={function (e) { return __awaiter(_this, void 0, void 0, function () {
                var form, email, password, res, data, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e.preventDefault();
                            setLoginError("");
                            setLoginLoading(true);
                            form = e.target;
                            email = form[0].value;
                            password = form[1].value;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, fetch("/api/login", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ email: email, password: password })
                                })];
                        case 2:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 3:
                            data = _a.sent();
                            if (!res.ok)
                                throw new Error(data.message || "Ошибка входа");
                            localStorage.setItem("token", data.token);
                            setLoginModalOpen(false);
                            setLocation("/participant-dashboard");
                            return [3 /*break*/, 6];
                        case 4:
                            err_2 = _a.sent();
                            setLoginError(err_2.message || "Ошибка входа");
                            return [3 /*break*/, 6];
                        case 5:
                            setLoginLoading(false);
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            }); }}>
              <input type="email" placeholder="Email" className="w-full border rounded px-4 py-2" required/>
              <div className="relative">
                <input type={showLoginPassword ? "text" : "password"} placeholder="Пароль" className="w-full border rounded px-4 py-2 pr-10" required/>
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black" onClick={function () { return setShowLoginPassword(function (v) { return !v; }); }} tabIndex={-1}>
                  {showLoginPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
              {loginError && <div className="text-red-500 text-center text-sm">{loginError}</div>}
              <button type="submit" className="w-full bg-warm-orange text-black font-semibold py-2 rounded hover:bg-warm-orange/90 disabled:opacity-60" disabled={loginLoading}>
                {loginLoading ? "Вход..." : "Войти"}
              </button>
            </form>
            <div className="my-4 text-center text-gray-400">или</div>
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100" onClick={function () { return window.location.href = '/api/auth/google'; }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
              Войти через Google
            </button>
          </div>
        </div>)}
    </>);
}
