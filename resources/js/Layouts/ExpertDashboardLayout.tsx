// resources/js/Layouts/ExpertDashboardLayout.tsx
import { ReactNode, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import FlashMessages from '@/Components/ui/FlashMessages';
import Sidebar from './Sidebar';
import Header from './Header';

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
 * Hook to detect if we're on desktop
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.innerWidth >= 1024);

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsDesktop(window.innerWidth >= 1024);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return { isDesktop, mounted };
}

/**
 * Expert Dashboard Layout
 * 
 * Features:
 * - Fully responsive across all screen sizes
 * - Smooth transitions during window resize
 * - Mobile: Overlay sidebar with backdrop
 * - Desktop: Collapsible sidebar (persisted to localStorage)
 * - Sticky header with user menu
 * - Independent scrolling for sidebar and main content
 * - Dark mode support
 * - Flash message notifications
 * - Respects prefers-reduced-motion
 * 
 * Structure:
 * - Sidebar: Logo + Navigation (scrollable) + Collapse toggle (desktop only)
 * - Header: Mobile menu + Search + Theme Toggle + Notifications + User Menu
 * - Main Content: Page content area
 */
export default function ExpertDashboardLayout({ children, title }: ExpertDashboardLayoutProps) {
  const { auth, unreadNotifications = 0 } = usePage<PageProps>().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isDesktop, mounted } = useIsDesktop();
  const prefersReducedMotion = useReducedMotion();

  // Load collapse state from localStorage on mount (desktop only)
  useEffect(() => {
    if (isDesktop) {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setCollapsed(savedState === 'true');
      }
    }
  }, [isDesktop]);

  // Save collapse state to localStorage when it changes (desktop only)
  useEffect(() => {
    if (mounted && isDesktop) {
      localStorage.setItem('sidebarCollapsed', collapsed.toString());
    }
  }, [collapsed, mounted, isDesktop]);

  // Reset collapsed state when switching to mobile
  useEffect(() => {
    if (!isDesktop) {
      setCollapsed(false);
    }
  }, [isDesktop]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [usePage().url]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && !isDesktop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen, isDesktop]);

  // Calculate margin based on state
  const getMarginLeft = () => {
    if (!mounted) return 0;
    if (!isDesktop) return 0;
    return collapsed ? 80 : 256;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Flash Messages Component - Shows success/error notifications */}
      <FlashMessages />

      {/* Mobile Sidebar Overlay - Only shown on mobile */}
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isDesktop={isDesktop}
      />

      {/* Main Content Area - Adjusts based on sidebar state */}
      <div
        style={{
          marginLeft: mounted ? `${getMarginLeft()}px` : '0px',
          transition: prefersReducedMotion
            ? 'none'
            : 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="min-h-screen"
      >
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