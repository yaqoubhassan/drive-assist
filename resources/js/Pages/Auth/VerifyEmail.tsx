import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, ArrowPathIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-blue-100 dark:bg-blue-900/50 rounded-full p-4">
                                    <EnvelopeIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                            Verify Your Email
                        </h1>

                        {/* Description */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just emailed to you.
                        </p>

                        {/* Success Message */}
                        {status === 'verification-link-sent' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                            >
                                <div className="flex items-start">
                                    <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-sm text-green-800 dark:text-green-200">
                                        A new verification link has been sent to your email address!
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Development Info */}
                        {import.meta.env.DEV && (
                            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                                    🔧 Development Mode
                                </p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                    Check your Laravel log file for the verification URL
                                </p>
                            </div>
                        )}

                        {/* Resend Form */}
                        <form onSubmit={submit} className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                                        Resend Verification Email
                                    </>
                                )}
                            </button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all duration-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                Back to Login
                            </Link>
                        </form>

                        {/* Help Text */}
                        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                            Didn't receive the email? Check your spam folder or click the button above to resend.
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Having trouble?{' '}
                        <a href="mailto:support@driveassist.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Contact Support
                        </a>
                    </p>
                </motion.div>
            </div>
        </>
    );
}