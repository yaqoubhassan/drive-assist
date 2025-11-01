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
} from '@heroicons/react/24/outline';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
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
 * - Responsive sidebar with mobile overlay
 * - Navigation menu with active state
 * - Independent scrolling
 * - Logo and branding
 * - Dark mode support
 */
export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
      `}
    >
      {/* Logo - Fixed at top */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
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
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = item.href !== '#' && route().current(item.href);
          return (
            <Link
              key={item.name}
              href={item.href !== '#' ? route(item.href) : item.href}
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
              <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              {item.name}
              {item.href === '#' && (
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}