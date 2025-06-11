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
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center text-2xl font-bold text-forest-green cursor-pointer">
                <Clover className="mr-2" />
                YogaRetreat
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/retreats">
                <a className="text-soft-gray hover:text-forest-green transition-colors">Ретриты</a>
              </Link>
              {isAuthenticated && user?.role === 'organizer' && (
                <Link href="/organizer/dashboard">
                  <a className="text-soft-gray hover:text-forest-green transition-colors">Организаторам</a>
                </Link>
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated && (
                <Button 
                  variant="ghost"
                  className="hidden md:block text-soft-gray hover:text-forest-green"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Стать организатором
                </Button>
              )}

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'У'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user?.firstName && (
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                        )}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {user?.role === 'organizer' ? (
                      <Link href="/organizer/dashboard">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Панель организатора
                        </DropdownMenuItem>
                      </Link>
                    ) : (
                      <Link href="/participant/dashboard">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Мои бронирования
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  className="bg-forest-green text-white hover:bg-forest-green/90"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Войти
                </Button>
              )}

              <Button 
                variant="ghost" 
                className="md:hidden text-soft-gray"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

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
        </div>
      </header>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}
