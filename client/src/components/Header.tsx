import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clover, Menu, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="flex-1 flex justify-center">
            <Link href="/api/login">
              <a className="text-forest-green hover:text-warm-orange transition-colors text-lg font-semibold border-2 border-transparent hover:border-sage-green"
                style={{display: 'block', opacity: 1, visibility: 'visible', pointerEvents: 'auto', position: 'relative', zIndex: 1000}}>
                Войти
              </a>
            </Link>
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
    </>
  );
}
