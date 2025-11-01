import UserAvatar from '@/Components/UserAvatar';
import { useTheme } from '@/hooks/useTheme';
import { clearBrowserSession } from '@/utils/sessionHelper';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface HeaderProps {
  title?: string;
  user: {
    id: number;
    name: string;
    email: string;
    user_type: 'driver' | 'expert' | 'admin';
    avatar_url?: string | null;
  };
  unreadNotifications: number;
  onMenuClick: () => void;
}

export default function Header({ title, user, unreadNotifications, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const logout = () => {
    router.post(route('logout'), {}, {
      onSuccess: () => {
        clearBrowserSession();
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
          {title && (
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Right: Search, Theme Toggle, Notifications, User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Search - Hidden on small mobile */}
          <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-48 lg:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="User menu"
            >
              <div className="hidden sm:block text-right mr-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Expert Account
                </p>
              </div>
              <UserAvatar
                name={user.name}
                avatarUrl={user.avatar_url}
                size="md"
              />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                {/* User Info with Avatar */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <UserAvatar
                      name={user.name}
                      avatarUrl={user.avatar_url}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => {
                    router.visit(route('expert.profile.edit'));
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <UserIcon className="h-4 w-4 mr-3" />
                  View Profile
                </button>

                <button
                  onClick={() => {
                    router.visit(route('expert.settings'));
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Cog6ToothIcon className="h-4 w-4 mr-3" />
                  Settings
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}