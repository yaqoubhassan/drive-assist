import { ReactNode } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  HomeIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from '@/hooks/useTheme';

interface ExpertDashboardLayoutProps {
  children: ReactNode;
  title?: string;
}
interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      user_type: "driver" | "expert" | "admin";
    };
  };
  unreadNotifications?: number;
}

export default function ExpertDashboardLayout({ children, title }: ExpertDashboardLayoutProps) {
  const { auth, unreadNotifications = 0 } = usePage<PageProps>().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: route('expert.dashboard'), icon: HomeIcon },
    { name: 'Leads', href: route('expert.leads.index'), icon: UsersIcon },
    { name: 'Jobs', href: route('expert.jobs.index'), icon: BriefcaseIcon },
    { name: 'Schedule', href: '#', icon: CalendarIcon },
    { name: 'Reviews', href: route('expert.reviews.index'), icon: StarIcon },
    { name: 'Analytics', href: "#", icon: ChartBarIcon },
    { name: 'Earnings', href: "#", icon: CurrencyDollarIcon },
    { name: 'Messages', href: "#", icon: ChatBubbleLeftRightIcon },
    { name: 'Documents', href: "#", icon: DocumentTextIcon },
    { name: 'Settings', href: "#", icon: Cog6ToothIcon },
  ];

  const logout = () => {
    router.post(route('logout'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
                    fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href={route('home')} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DA</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              DriveAssist
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = route().current(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                                    flex items-center px-4 py-3 text-sm font-medium rounded-lg
                                    transition-all duration-200
                                    ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                                `}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {auth.user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {auth.user.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16">
          <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            {/* Left: Mobile Menu + Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bars3Icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
              {title && (
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h1>
              )}
            </div>

            {/* Right: Search, Notifications, Theme Toggle */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}