'use client';

import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/authStore';
import { Sun, Moon, Bell, LogOut, User } from 'lucide-react';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-background/80 backdrop-blur-lg border-b border-border">
      <div>
        <h2 className="text-lg font-semibold">
          Welcome back, <span className="gradient-text">{user?.firstName || 'User'}</span>
        </h2>
        <p className="text-xs text-muted-foreground">
          Let&apos;s reduce your carbon footprint today
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-muted transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 ml-2 border-l border-border">
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
            <User className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <button
            onClick={() => logout()}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
