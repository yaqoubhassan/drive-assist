import { ReactNode, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { motion, AnimatePresence } from 'framer-motion';
import FlashMessages from '@/Components/ui/FlashMessages';
import Sidebar from './Sidebar';
import Header from './/Header';

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

/**
 * Expert Dashboard Layout
 * 
 * Features:
 * - Responsive sidebar with mobile support
 * - Sticky header with user menu
 * - Independent scrolling for sidebar and main content
 * - Dark mode support
 * - Flash message notifications
 * 
 * Structure:
 * - Sidebar: Logo + Navigation (scrollable)
 * - Header: Search + Theme Toggle + Notifications + User Menu
 * - Main Content: Page content area
 */
export default function ExpertDashboardLayout({ children, title }: ExpertDashboardLayoutProps) {
  const { auth, unreadNotifications = 0 } = usePage<PageProps>().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Flash Messages Component - Shows success/error notifications */}
      <FlashMessages />

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

      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header Component */}
        <Header
          title={title}
          user={auth.user}
          unreadNotifications={unreadNotifications}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}