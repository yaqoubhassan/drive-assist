import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    CarIcon,
    WrenchIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from 'lucide-react';

interface UserTypeOption {
    title: string;
    description: string;
    features: string[];
    icon: string;
}

interface Props {
    userTypes: {
        driver: UserTypeOption;
        expert: UserTypeOption;
    };
}

export default function Register({ userTypes }: Props) {
    const [step, setStep] = useState<'select' | 'form'>('select');
    const [selectedType, setSelectedType] = useState<'driver' | 'expert' | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: selectedType || 'driver',
    });

    const handleTypeSelection = (type: 'driver' | 'expert') => {
        setSelectedType(type);
        setData('user_type', type);
        setStep('form');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const iconMap = {
        car: CarIcon,
        wrench: WrenchIcon,
    };

    return (
        <>
            <Head title="Get Started - DriveAssist" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    {/* Logo */}
                    <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
                        <CarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            DriveAssist
                        </span>
                    </Link>

                    {step === 'select' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Header */}
                            <div className="text-center mb-12">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                    Get Started with DriveAssist
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300">
                                    Choose how you'd like to use our platform
                                </p>
                            </div>

                            {/* User Type Selection Cards */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {Object.entries(userTypes).map(([type, config]) => {
                                    const Icon = iconMap[config.icon as keyof typeof iconMap];

                                    return (
                                        <motion.button
                                            key={type}
                                            onClick={() => handleTypeSelection(type as 'driver' | 'expert')}
                                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-left border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400"
                                            whileHover={{ y: -8 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {/* Icon */}
                                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                                                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                            </div>

                                            {/* Title & Description */}
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                {config.title}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                {config.description}
                                            </p>

                                            {/* Features */}
                                            <ul className="space-y-3">
                                                {config.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start space-x-2">
                                                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* CTA */}
                                            <div className="mt-8 flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold">
                                                <span>Continue as {type === 'driver' ? 'Driver' : 'Expert'}</span>
                                                <ArrowRightIcon className="w-5 h-5" />
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Already have an account */}
                            <div className="text-center mt-8">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                    >
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 'form' && selectedType && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-md mx-auto"
                        >
                            {/* Back Button */}
                            <button
                                type="button"
                                onClick={() => setStep('select')}
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                <span>Back to selection</span>
                            </button>

                            {/* Form Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        Create your {selectedType === 'driver' ? 'Driver' : 'Expert'} account
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Just a few details to get started
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoFocus
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 transition-colors"
                                            placeholder="John Doe"
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 transition-colors"
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 transition-colors"
                                            placeholder="••••••••"
                                        />
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Confirm Password
                                        </label>
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 transition-colors"
                                            placeholder="••••••••"
                                        />
                                        {errors.password_confirmation && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Creating account...' : 'Create Account'}
                                    </button>

                                    {/* Terms */}
                                    <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                                        By creating an account, you agree to our{' '}
                                        <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </form>
                            </div>

                            {/* Already have an account */}
                            <div className="text-center mt-6">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                    >
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}