import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
    HomeIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    HeartIcon,
    TruckIcon,
    Cog6ToothIcon,
    BellIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Bars3Icon,
    XMarkIcon,
    SunIcon,
    MoonIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

interface DriverLayoutProps extends PropsWithChildren {
    header?: ReactNode;
}

/**
 * DriverLayout Component
 * 
 * Dashboard layout for authenticated drivers.
 * This is NOT a public-facing layout - it's for the driver's dashboard/panel.
 * 
 * Features:
 * - Collapsible sidebar (desktop)
 * - Mobile-responsive with bottom navigation
 * - Quick action buttons
 * - User profile section
 * - Theme toggle
 * - Notification badge
 * - Independent of public Navbar/Footer
 */
export default function DriverLayout({ header, children }: DriverLayoutProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
    const [collapsed, setCollapsed] = useState(false); // Desktop sidebar collapse

    const navigation = [
        {
            name: 'Dashboard',
            href: 'dashboard',
            icon: HomeIcon,
            active: route().current('dashboard')
        },
        {
            name: 'New Diagnosis',
            href: 'diagnose.create',
            icon: WrenchScrewdriverIcon,
            active: route().current('diagnose.*'),
            highlight: true // Highlight as primary action
        },
        {
            name: 'History',
            href: 'dashboard', // TODO: Create history route
            icon: ClockIcon,
            active: false
        },
        {
            name: 'Saved Experts',
            href: 'dashboard', // TODO: Create saved experts route
            icon: HeartIcon,
            active: false
        },
        {
            name: 'My Vehicles',
            href: 'dashboard', // TODO: Create vehicles route
            icon: TruckIcon,
            active: false
        },
        {
            name: 'Settings',
            href: 'profile.edit',
            icon: Cog6ToothIcon,
            active: route().current('profile.*')
        },
    ];

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSidebarOpen(false)}
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            />

                            {/* Mobile Sidebar */}
                            <motion.aside
                                initial={{ x: -280 }}
                                animate={{ x: 0 }}
                                exit={{ x: -280 }}
                                transition={{ type: 'spring', damping: 30 }}
                                className="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-2xl lg:hidden"
                            >
                                {/* Mobile Header */}
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
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Mobile Navigation */}
                                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={route(item.href)}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`
                          flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
                          ${item.active
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }
                          ${item.highlight ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''}
                        `}
                                            >
                                                <Icon className="h-5 w-5 mr-3" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Mobile User Section */}
                                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center justify-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                                        Log Out
                                    </Link>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Desktop Sidebar */}
                <aside
                    className={`
            hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30
            ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          `}
                >
                    {/* Desktop Header */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                        <AnimatePresence mode="wait">
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Link href={route('home')} className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">DA</span>
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                            DriveAssist
                                        </span>
                                    </Link>
                                </motion.div>
                            )}
                            {collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
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
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`
                    flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-all relative group
                    ${item.active
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }
                    ${item.highlight && !collapsed ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''}
                  `}
                                    title={collapsed ? item.name : ''}
                                >
                                    <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                                    {!collapsed && <span>{item.name}</span>}

                                    {/* Tooltip for collapsed state */}
                                    {collapsed && (
                                        <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                                            {item.name}
                                            <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop Collapse Toggle */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className={`
                w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors
              `}
                        >
                            {!collapsed && <span>Collapse</span>}
                            {collapsed ? (
                                <ChevronRightIcon className="h-5 w-5" />
                            ) : (
                                <ChevronLeftIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className={`
          transition-all duration-300
          ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}>
                    {/* Top Bar */}
                    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        </button>

                        {/* Header Content */}
                        <div className="flex-1 lg:flex-none">
                            {header}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <SunIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                )}
                            </button>

                            {/* Notifications */}
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                                <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                {/* Notification badge */}
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Desktop User Menu */}
                            <div className="hidden lg:flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden xl:block">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Driver
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="py-8 px-4 sm:px-6 lg:px-8">
                        {children}
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
                    <div className="flex justify-around items-center h-16">
                        {navigation.slice(0, 5).map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`
                    flex flex-col items-center justify-center flex-1 h-full transition-colors
                    ${item.active
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }
                  `}
                                >
                                    <Icon className="h-6 w-6 mb-1" />
                                    <span className="text-xs font-medium">{item.name.split(' ')[0]}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Padding for mobile bottom nav */}
                <div className="h-16 lg:hidden"></div>
            </div>
        </ThemeProvider>
    );
}