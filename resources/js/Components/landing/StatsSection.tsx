import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, Wrench, Star, Clock } from 'lucide-react';

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    {
      icon: Wrench,
      value: 50000,
      suffix: '+',
      label: 'Issues Solved',
      color: 'blue',
    },
    {
      icon: Users,
      value: 5000,
      suffix: '+',
      label: 'Expert Network',
      color: 'purple',
    },
    {
      icon: Star,
      value: 4.9,
      suffix: '★',
      label: 'Average Rating',
      color: 'yellow',
      decimals: 1,
    },
    {
      icon: Clock,
      value: 2,
      suffix: 'min',
      label: 'Response Time',
      prefix: '<',
      color: 'green',
    },
  ];

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Drivers
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join our growing community of satisfied drivers and expert mechanics
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} isInView={isInView} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  isInView,
  delay,
}: {
  stat: any;
  isInView: boolean;
  delay: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        setCount(stat.value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, stat.value]);

  const displayValue = stat.decimals
    ? count.toFixed(stat.decimals)
    : Math.floor(count).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="inline-block mb-4"
      >
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <stat.icon className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {stat.prefix}
        {displayValue}
        {stat.suffix}
      </div>

      <div className="text-white/90 font-medium">{stat.label}</div>
    </motion.div>
  );
}