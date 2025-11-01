// resources/js/Layouts/Sidebar.tsx
import { Link } from '@inertiajs/react';
import {
  HomeIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UsersIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isDesktop: boolean;
}

const navigation = [
  { name: 'Dashboard', href: 'expert.dashboard', icon: HomeIcon },
  { name: 'Leads', href: 'expert.leads.index', icon: UsersIcon },
  { name: 'Jobs', href: 'expert.jobs.index', icon: BriefcaseIcon },
  { name: 'Schedule', href: '#', icon: CalendarIcon },
  { name: 'Reviews', href: 'expert.reviews.index', icon: StarIcon },
  { name: 'Analytics', href: '#', icon: ChartBarIcon },
  { name: 'Earnings', href: '#', icon: CurrencyDollarIcon },
  { name: 'Messages', href: '#', icon: ChatBubbleLeftRightIcon },
  { name: 'Documents', href: '#', icon: DocumentTextIcon },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon },
];

/**
 * Sidebar Component for Expert Dashboard
 * 
 * Features:
 * - Fully responsive across all screen sizes
 * - Smooth transitions during window resize
 * - Mobile: Slide-in overlay (always full width)
 * - Desktop: Collapsible sidebar (256px → 80px)
 * - Smooth animations
 * - Navigation menu with active state
 * - Independent scrolling
 * - Dark mode support
 * - Tooltips in collapsed mode
 * - Respects prefers-reduced-motion
 */
export default function Sidebar({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed, isDesktop }: SidebarProps) {
  const prefersReducedMotion = useReducedMotion();

  // Mobile Sidebar
  const MobileSidebar = () => (
    <motion.aside
      initial={false}
      animate={{
        x: sidebarOpen ? 0 : -256,
      }}
      transition={{
        type: prefersReducedMotion ? 'tween' : 'spring',
        damping: 30,
        stiffness: 300,
        duration: prefersReducedMotion ? 0 : undefined,
      }}
      className="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-2xl"
    >
      {/* Mobile Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <Link href={route('home')} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">DA</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
            DriveAssist
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {navigation.map((item) => {
          const isActive = item.href !== '#' && route().current(item.href);
          return (
            <Link
              key={item.name}
              href={item.href !== '#' ? route(item.href) : item.href}
              onClick={() => item.href !== '#' && setSidebarOpen(false)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg
                transition-all duration-200
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${item.href === '#' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              <span className="whitespace-nowrap">{item.name}</span>
              {item.href === '#' && (
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Footer Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          DriveAssist Expert Dashboard
        </div>
      </div>
    </motion.aside>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside
      style={{
        width: collapsed ? '80px' : '256px',
        transition: prefersReducedMotion
          ? 'none'
          : 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
    >
      {/* Desktop Header */}
      <div className="h-16 flex items-center justify-center px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              className="flex items-center space-x-2"
            >
              <Link href={route('home')} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">DA</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  DriveAssist
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
            >
              <Link href={route('home')} className="flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DA</span>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {navigation.map((item) => {
          const isActive = item.href !== '#' && route().current(item.href);
          return (
            <Link
              key={item.name}
              href={item.href !== '#' ? route(item.href) : item.href}
              className={`
                flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg
                transition-all duration-200 relative group
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${item.href === '#' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              title={collapsed ? item.name : ''}
            >
              <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />

              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden">
                  {item.name}
                </span>
              )}

              {!collapsed && item.href === '#' && (
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                  Soon
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                  {item.name}
                  {item.href === '#' && <span className="ml-2 text-xs opacity-75">(Coming Soon)</span>}
                  {/* Tooltip arrow */}
                  <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Collapse Toggle Button */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            w-full flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg
            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
            transition-all duration-200
          `}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeftIcon className="h-5 w-5 mr-3" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );

  return isDesktop ? <DesktopSidebar /> : <MobileSidebar />;
}