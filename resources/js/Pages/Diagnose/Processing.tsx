
import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Sparkles, Cog, CheckCircle2, Zap } from 'lucide-react';

interface ProcessingProps {
  diagnosis_id?: number;
}

const loadingMessages = [
  { icon: Sparkles, text: '🔍 Analyzing your vehicle issue...', color: 'text-blue-500' },
  { icon: Cog, text: '🤖 Consulting our AI mechanic...', color: 'text-purple-500' },
  { icon: Zap, text: '⚙️ Cross-referencing thousands of cases...', color: 'text-amber-500' },
  { icon: CheckCircle2, text: '✨ Preparing your diagnosis...', color: 'text-green-500' },
];

export default function Processing({ diagnosis_id }: ProcessingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Rotate through messages every 2 seconds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Cap at 95% until actual completion
        return prev + Math.random() * 10;
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, []);

  // Redirect to results after animation (3-5 seconds)
  useEffect(() => {
    if (diagnosis_id) {
      const timer = setTimeout(() => {
        router.visit(route('diagnose.show', diagnosis_id));
      }, 4000); // 4 seconds total

      return () => clearTimeout(timer);
    }
  }, [diagnosis_id]);

  const currentMessage = loadingMessages[messageIndex];
  const MessageIcon = currentMessage.icon;

  return (
    <>
      <Head title="Analyzing Your Vehicle..." />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Animated Car Icon */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Glowing effect */}
              <motion.div
                className="absolute inset-0 bg-blue-400 dark:bg-blue-600 rounded-full blur-2xl opacity-30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Car Icon Container */}
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-8 shadow-2xl">
                <Car className="w-24 h-24 text-blue-600 dark:text-blue-400" />

                {/* Spinning gears */}
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Cog className="w-8 h-8 text-blue-400 dark:text-blue-500" />
                </motion.div>

                <motion.div
                  className="absolute bottom-4 left-4"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Cog className="w-6 h-6 text-purple-400 dark:text-purple-500" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Rotating Messages */}
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <MessageIcon className={`w-8 h-8 ${currentMessage.color}`} />
                </motion.div>
                <p className="text-xl font-medium text-gray-800 dark:text-gray-200">
                  {currentMessage.text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pulsing dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Fun fact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Did you know?</span>{' '}
              Our AI analyzes over 50,000 automotive diagnostic cases to provide you with accurate results.
            </p>
          </motion.div>

          {/* Shimmer effect overlay */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>
    </>
  );
}