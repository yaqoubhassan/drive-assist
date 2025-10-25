import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, Sparkles, MapPin, Camera, Mic, FileText } from 'lucide-react';

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: '01',
      title: 'Describe Your Issue',
      description:
        'Tell us what\'s wrong with your vehicle - type, speak, or upload a photo. No account needed.',
      icon: MessageSquare,
      features: [
        { icon: FileText, text: 'Text' },
        { icon: Mic, text: 'Voice' },
        { icon: Camera, text: 'Photo' },
      ],
      colorClasses: {
        numberText: 'text-blue-500/20',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconText: 'text-blue-600 dark:text-blue-400',
        centerGradient: 'from-blue-500 to-blue-600',
      },
    },
    {
      number: '02',
      title: 'Get AI Analysis',
      description:
        'Our AI analyzes your issue and provides instant diagnosis with cost estimates and safety checks.',
      icon: Sparkles,
      features: [
        { text: 'Instant diagnosis' },
        { text: 'Cost estimate' },
        { text: 'Safety check' },
      ],
      colorClasses: {
        numberText: 'text-purple-500/20',
        iconBg: 'bg-purple-100 dark:bg-purple-900/30',
        iconText: 'text-purple-600 dark:text-purple-400',
        centerGradient: 'from-purple-500 to-purple-600',
      },
    },
    {
      number: '03',
      title: 'Find Expert (if needed)',
      description:
        'Connect with verified local experts who can fix your issue. Compare prices and reviews.',
      icon: MapPin,
      features: [
        { text: 'Local experts' },
        { text: 'Verified ratings' },
        { text: 'Direct contact' },
      ],
      colorClasses: {
        numberText: 'text-pink-500/20',
        iconBg: 'bg-pink-100 dark:bg-pink-900/30',
        iconText: 'text-pink-600 dark:text-pink-400',
        centerGradient: 'from-pink-500 to-pink-600',
      },
    },
  ];

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="py-20 bg-gray-50 dark:bg-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Back on the Road in 3 Simple Steps
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our streamlined process makes car diagnostics fast and easy
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - z-0 to stay behind icons */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2 z-0" />

          <div className="space-y-12 lg:space-y-24 relative">
            {steps.map((step, index) => {
              const isReversed = index % 2 === 1;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={
                    isInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
                  }
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${isReversed ? 'lg:flex-row-reverse' : ''
                    }`}
                >
                  {/* Content - Add padding based on position */}
                  <div className={`flex-1 w-full ${isReversed ? 'lg:pl-12' : 'lg:pr-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-full ${step.colorClasses.iconBg} flex items-center justify-center`}
                        >
                          <step.icon
                            className={`w-6 h-6 ${step.colorClasses.iconText}`}
                          />
                        </div>
                        <span
                          className={`text-4xl font-bold ${step.colorClasses.numberText}`}
                        >
                          {step.number}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {step.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {step.description}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {step.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                          >
                            {'icon' in feature && feature.icon && <feature.icon className="w-4 h-4" />}
                            <span>{feature.text}</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Center icon (visible on large screens) - z-10 to stay above line */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-10">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.colorClasses.centerGradient} shadow-lg flex items-center justify-center`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 w-full" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}