"use client";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Moon, Sun, Menu } from "lucide-react";
import { logout } from "@/services/user/logout";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ProfileModal from "./Profile";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuth();

  const payload = {
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar,
  };

  const mediaUrl = useMemo(() => {
    if (!payload.avatar) return undefined;
    return payload.avatar;
  }, [payload.avatar]);

  const [isDark, setIsDark] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-14 border-b border-border bg-background backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Lado esquerdo */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Botão hambúrguer (só mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <h1 className="text-xl font-semibold text-primary">Connect</h1>
          </div>
        </div>

        {/* Lado direito */}
        <div className="flex items-center space-x-2">
          {/* Botão tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage src={mediaUrl || "?"} alt="Avatar" />
                <AvatarFallback className="bg-primary text-white">
                  <User />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div>
                  <p className="text-sm font-medium text-primary">
                    {payload.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payload.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ProfileModal open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </header>
  );
}
