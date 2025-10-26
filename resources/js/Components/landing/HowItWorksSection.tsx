// resources/js/Components/Landing/HowItWorks.tsx

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  MapPinIcon,
  CameraIcon,
  MicrophoneIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const steps = [
  {
    number: 1,
    title: 'Describe Your Issue',
    description:
      'Tell us what\'s wrong with your vehicle - type, speak, or upload a photo. No account needed.',
    icon: ChatBubbleLeftRightIcon,
    features: [
      { icon: CameraIcon, label: 'Photo Upload' },
      { icon: MicrophoneIcon, label: 'Voice Input' },
      { icon: ChatBubbleLeftRightIcon, label: 'Text Description' },
    ],
    color: 'blue',
    image: '/images/landing/step1-describe.jpg', // User describing/photographing issue
    imageAlt: 'Driver taking photo of car issue with smartphone',
  },
  {
    number: 2,
    title: 'Get AI Analysis',
    description:
      'Our AI analyzes your issue and provides instant diagnosis with cost estimates and safety recommendations.',
    icon: SparklesIcon,
    features: [
      { icon: SparklesIcon, label: 'Instant Diagnosis' },
      { icon: CurrencyDollarIcon, label: 'Cost Estimate' },
      { icon: ShieldCheckIcon, label: 'Safety Check' },
    ],
    color: 'purple',
    image: '/images/landing/step2-analysis.jpg', // AI analysis screen or dashboard
    imageAlt: 'AI analysis dashboard showing vehicle diagnosis results',
  },
  {
    number: 3,
    title: 'Find Expert (if needed)',
    description:
      'Connect with verified local mechanics who can fix your issue. Get quotes, read reviews, and book appointments.',
    icon: MapPinIcon,
    features: [
      { icon: MapPinIcon, label: 'Local Experts' },
      { icon: CheckCircleIcon, label: 'Verified Ratings' },
      { icon: ClockIcon, label: 'Quick Response' },
    ],
    color: 'green',
    image: '/images/landing/step3-success.jpg', // Success handshake photo
    imageAlt: 'Satisfied driver and mechanic handshake after successful repair',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-20 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/5 dark:bg-purple-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium mb-4"
          >
            <SparklesIcon className="w-4 h-4" />
            Simple Process
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Get Back on the Road in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From diagnosis to repair, we make fixing your car as easy as 1-2-3
          </p>
        </motion.div>

        {/* Steps with Vertical Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Timeline Line - Hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 dark:from-blue-900 dark:via-purple-900 dark:to-green-900">
              <motion.div
                className="h-full w-full bg-gradient-to-b from-blue-600 via-purple-600 to-green-600"
                initial={{ height: '0%' }}
                animate={isInView ? { height: '100%' } : { height: '0%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-16 lg:space-y-32">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                index={index}
                isInView={isInView}
                isLeft={index % 2 === 0} // Alternating: 0=left, 1=right, 2=left
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center mt-20"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to diagnose your car issue?
          </p>
          <motion.a
            href="/diagnose"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span>Start Free Diagnosis</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

interface StepCardProps {
  step: typeof steps[0];
  index: number;
  isInView: boolean;
  isLeft: boolean;
}

function StepCard({ step, index, isInView, isLeft }: StepCardProps) {
  const Icon = step.icon;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-600 dark:border-blue-400',
        gradient: 'from-blue-500 to-blue-600',
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-600 dark:border-purple-400',
        gradient: 'from-purple-500 to-purple-600',
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-600 dark:border-green-400',
        gradient: 'from-green-500 to-green-600',
      },
    };
    return colors[color as keyof typeof colors];
  };

  const colors = getColorClasses(step.color);

  return (
    <div className="relative">
      {/* Mobile Layout - Stacked */}
      <div className="lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          {/* Number Badge */}
          <div className="flex justify-center mb-6">
            <NumberBadge number={step.number} colors={colors} index={index} isInView={isInView} />
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <ContentSection step={step} colors={colors} Icon={Icon} />
            <ImageSection step={step} index={index} isInView={isInView} />
          </div>
        </motion.div>

        {/* Arrow indicator for mobile */}
        {index < steps.length - 1 && (
          <div className="flex justify-center my-8">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-8 h-8 ${colors.text}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        )}
      </div>

      {/* Desktop Layout - Alternating Left/Right */}
      <div className="hidden lg:block">
        <div className={`grid grid-cols-2 gap-8 items-center ${isLeft ? '' : 'direction-rtl'}`}>
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
            className={isLeft ? 'text-right' : 'text-left'}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <ContentSection step={step} colors={colors} Icon={Icon} alignRight={isLeft} />
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? 50 : -50 }}
            transition={{ duration: 0.6, delay: index * 0.3 + 0.2 }}
            className={isLeft ? 'order-first' : ''}
          >
            <ImageSection step={step} index={index} isInView={isInView} showBadge />
          </motion.div>
        </div>

        {/* Number Badge - Center on timeline */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <NumberBadge number={step.number} colors={colors} index={index} isInView={isInView} />
        </div>
      </div>
    </div>
  );
}

function NumberBadge({ number, colors, index, isInView }: any) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={isInView ? { scale: 1 } : { scale: 0 }}
      transition={{ duration: 0.5, delay: index * 0.3 + 0.3, type: 'spring', stiffness: 260 }}
      className="relative"
    >
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-900`}>
        <span className="text-3xl font-bold text-white">{number}</span>
      </div>

      {/* Pulsing Ring Animation */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} opacity-20`}
        animate={{
          scale: [1, 1.3, 1.3, 1],
          opacity: [0.2, 0, 0, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}

function ContentSection({ step, colors, Icon, alignRight = false }: any) {
  return (
    <>
      {/* Icon */}
      <div className={`flex ${alignRight ? 'justify-end' : 'justify-start'} mb-6`}>
        <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${colors.text}`} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {step.description}
      </p>

      {/* Features */}
      <div className="space-y-3">
        {step.features.map((feature: any) => {
          const FeatureIcon = feature.icon;
          return (
            <div key={feature.label} className={`flex items-center gap-3 ${alignRight ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <FeatureIcon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {feature.label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ImageSection({ step, index, isInView, showBadge = false }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.3 + 0.4 }}
      className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-xl"
    >
      <img
        src={step.image}
        alt={step.imageAlt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Success Badge - Only for Step 3 */}
      {showBadge && step.number === 3 && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg">
            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Issue Resolved Successfully
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}