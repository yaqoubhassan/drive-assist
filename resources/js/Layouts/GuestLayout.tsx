import { PropsWithChildren } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PageProps } from '@/types';

/**
 * GuestLayout Component
 * 
 * Layout for unauthenticated users and public pages.
 * Uses the existing Navbar and Footer components.
 * 
 * Features:
 * - Branded navbar with proper auth awareness
 * - Theme support via ThemeProvider
 * - Full-page content area
 * - Site-wide footer
 * - Proper spacing for fixed navbar
 */

interface GuestLayoutProps extends PropsWithChildren {
    auth?: PageProps['auth'];
}

export default function GuestLayout({ auth, children }: GuestLayoutProps) {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
                {/* Navbar - using existing component */}
                <Navbar auth={auth} />

                {/* Main content area with padding for fixed navbar */}
                <main className="flex-1 pt-16">
                    {children}
                </main>

                {/* Footer - using existing component */}
                <Footer />
            </div>
        </ThemeProvider>
    );
}