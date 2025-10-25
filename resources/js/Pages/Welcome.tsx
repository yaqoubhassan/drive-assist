import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import HeroSection from '@/Components/landing/HeroSection';
import QuickCategoriesSection from '@/Components/landing/QuickCategoriesSection';
import HowItWorksSection from '@/Components/landing/HowItWorksSection';
import FeaturesSection from '@/Components/landing/FeaturesSection';
import StatsSection from '@/Components/landing/StatsSection';
import CTASection from '@/Components/landing/CTASection';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function Welcome() {
    return (
        <ThemeProvider>
            <Head title="DriveAssist - Your Car's Smart Companion" />

            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                <Navbar />

                <main>
                    <HeroSection />
                    <QuickCategoriesSection />
                    <HowItWorksSection />
                    <FeaturesSection />
                    <StatsSection />
                    <CTASection />
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}