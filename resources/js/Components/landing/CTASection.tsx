import { Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle, TrendingUp, Calendar, DollarSign } from 'lucide-react';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const benefits = [
    {
      icon: TrendingUp,
      text: 'Get matched with nearby drivers',
    },
    {
      icon: CheckCircle,
      text: 'Build your reputation',
    },
    {
      icon: Calendar,
      text: 'Flexible schedule',
    },
    {
      icon: DollarSign,
      text: 'No monthly fees',
    },
  ];

  return (
    <section
      ref={ref}
      id="experts"
      className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden"
    >
      {/* CSS-based Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, white 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Are You an Auto Expert?
            </h2>

            <p className="text-lg text-white/90 mb-8">
              Join our network and grow your business with qualified leads from drivers
              who need your expertise.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium text-lg">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/expert/register"
                  className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Join as Expert →
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/expert/learn-more"
                  className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="space-y-4">
                {/* Mock dashboard elements */}
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-white/20 rounded w-32"></div>
                  <div className="h-8 w-8 bg-white/20 rounded-full"></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">12</div>
                    <div className="text-white/70 text-sm">New Leads</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">8</div>
                    <div className="text-white/70 text-sm">Active Jobs</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">4.9</div>
                    <div className="text-white/70 text-sm">Rating</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-white/20 rounded w-3/4"></div>
                        <div className="h-2 bg-white/10 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}