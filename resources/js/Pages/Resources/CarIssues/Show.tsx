import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  ArrowLeft,
  AlertCircle,
  Wrench,
  Zap,
  Cog,
  Disc,
  Move,
  Droplets,
  Fuel,
  Wind,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Clock,
  Wrench as WrenchIcon,
  Car,
  PhoneCall,
  BookOpen,
  ChevronRight,
  XCircle,
} from 'lucide-react';

interface CarIssue {
  id: number;
  title: string;
  slug: string;
  category: string;
  severity: string;
  symptoms: string;
  description: string;
  possible_causes: string | null;
  diy_solutions: string | null;
  when_to_call_expert: string | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  estimated_time: string | null;
  view_count: number;
  helpful_count: number;
  not_helpful_count: number;
  content: string | null;
  is_popular: boolean;
  cost_range: string;
}

interface RelatedIssue {
  id: number;
  title: string;
  slug: string;
  category: string;
  severity: string;
  description?: string;
}

interface Props {
  issue: CarIssue;
  relatedIssues: RelatedIssue[];
}

const categoryIcons: Record<string, any> = {
  engine: Wrench,
  brakes: AlertCircle,
  electrical: Zap,
  transmission: Cog,
  tires: Disc,
  suspension: Move,
  cooling: Droplets,
  fuel: Fuel,
  exhaust: Wind,
  steering: Cog,
};

const categoryColors: Record<string, string> = {
  engine: 'from-red-500 to-orange-500',
  brakes: 'from-yellow-500 to-red-500',
  electrical: 'from-blue-500 to-purple-500',
  transmission: 'from-purple-500 to-pink-500',
  tires: 'from-gray-500 to-slate-600',
  suspension: 'from-green-500 to-teal-500',
  cooling: 'from-cyan-500 to-blue-500',
  fuel: 'from-amber-500 to-orange-500',
  exhaust: 'from-gray-600 to-gray-700',
  steering: 'from-indigo-500 to-purple-500',
};

export default function CarIssueShow({ issue, relatedIssues }: Props) {
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const Icon = categoryIcons[issue.category] || AlertCircle;

  const getSeverityInfo = (severity: string) => {
    const severityMap = {
      low: {
        label: 'Minor Issue',
        description: 'Can usually be fixed with routine maintenance',
        icon: '🟢',
        bgClass: 'from-green-500 to-emerald-500',
        borderClass: 'border-green-200 dark:border-green-800',
        textClass: 'text-green-700 dark:text-green-400',
      },
      medium: {
        label: 'Moderate Issue',
        description: 'Should be addressed soon to prevent complications',
        icon: '🟡',
        bgClass: 'from-yellow-500 to-orange-500',
        borderClass: 'border-yellow-200 dark:border-yellow-800',
        textClass: 'text-yellow-700 dark:text-yellow-400',
      },
      high: {
        label: 'Serious Issue',
        description: 'Requires prompt attention from a professional',
        icon: '🟠',
        bgClass: 'from-orange-500 to-red-500',
        borderClass: 'border-orange-200 dark:border-orange-800',
        textClass: 'text-orange-700 dark:text-orange-400',
      },
      critical: {
        label: 'Critical Issue',
        description: 'Immediate professional attention required - do not drive',
        icon: '🔴',
        bgClass: 'from-red-500 to-pink-500',
        borderClass: 'border-red-200 dark:border-red-800',
        textClass: 'text-red-700 dark:text-red-400',
      },
    };
    return severityMap[severity as keyof typeof severityMap] || severityMap.medium;
  };

  const severityInfo = getSeverityInfo(issue.severity);

  const handleHelpfulClick = async (helpful: boolean) => {
    if (wasHelpful !== null || isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    setWasHelpful(helpful);

    try {
      const response = await axios.post(
        route('car-issues.helpful', issue.slug),
        { helpful }
      );

      console.log('Feedback submitted successfully:', response.data);

      // Show success state briefly
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Reset state on error
      setWasHelpful(null);
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: issue.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
    // Show a toast or notification here
  };

  const parseListContent = (content: string | null) => {
    if (!content) return [];
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-*•]\s*/, '').trim());
  };

  const symptoms = parseListContent(issue.symptoms);
  const causes = parseListContent(issue.possible_causes);
  const diySolutions = parseListContent(issue.diy_solutions);
  const expertReasons = parseListContent(issue.when_to_call_expert);

  return (
    <ThemeProvider>
      <Head title={`${issue.title} - Car Issues - DriveAssist`} />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        <main className="pt-24 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href={route('car-issues.index')}
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Car Issues</span>
            </Link>

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              {/* Category Badge */}
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColors[issue.category] || 'from-gray-500 to-gray-600'} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                    {issue.category}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {issue.view_count.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {issue.title}
              </h1>

              {/* Severity Badge */}
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r ${severityInfo.bgClass} shadow-lg`}>
                <span className="text-2xl">{severityInfo.icon}</span>
                <div>
                  <p className="text-white font-semibold">{severityInfo.label}</p>
                  <p className="text-white/90 text-sm">{severityInfo.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
            >
              {/* Description */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Cost Estimate */}
                {issue.estimated_cost_min && issue.estimated_cost_max && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Estimated Cost
                        </h3>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${issue.estimated_cost_min} - ${issue.estimated_cost_max}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Parts and labor included
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Estimate */}
                {issue.estimated_time && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                        <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Repair Time
                        </h3>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {issue.estimated_time}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Average completion time
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Symptoms */}
              {symptoms.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Common Symptoms
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Possible Causes */}
              {causes.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Possible Causes
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {causes.map((cause, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* DIY Solutions */}
              {diySolutions.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <WrenchIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      DIY Troubleshooting Steps
                    </h2>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-400 mb-4 font-medium">
                      ⚠️ Safety First: Only attempt these steps if you feel comfortable and have the proper tools.
                    </p>
                    <ol className="space-y-4">
                      {diySolutions.map((solution, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 pt-1">{solution}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* When to Call Expert */}
              {expertReasons.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <PhoneCall className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      When to Call an Expert
                    </h2>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Contact a professional mechanic if you experience any of the following:
                    </p>
                    <ul className="space-y-3">
                      {expertReasons.map((reason, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <XCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{reason}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
                      <Link
                        href={route('experts')}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                      >
                        <PhoneCall className="w-5 h-5" />
                        <span>Find Local Expert</span>
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
                  Was this article helpful?
                </h3>

                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={() => handleHelpfulClick(true)}
                    disabled={wasHelpful !== null || isSubmitting}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-medium transition-all ${wasHelpful === true
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${(wasHelpful !== null || isSubmitting) ? 'cursor-not-allowed opacity-75' : ''}`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>Yes, helpful</span>
                    {wasHelpful === true && isSubmitting && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2"
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>

                  <button
                    onClick={() => handleHelpfulClick(false)}
                    disabled={wasHelpful !== null || isSubmitting}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-medium transition-all ${wasHelpful === false
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${(wasHelpful !== null || isSubmitting) ? 'cursor-not-allowed opacity-75' : ''}`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    <span>Not helpful</span>
                    {wasHelpful === false && isSubmitting && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-2"
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>
                </div>

                {wasHelpful !== null && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-gray-600 dark:text-gray-400 text-sm"
                  >
                    Thank you for your feedback!
                  </motion.p>
                )}

                {/* Share Button */}
                <div className="flex justify-center mt-8 relative">
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share this article</span>
                  </button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-10 border border-gray-200 dark:border-gray-700"
                    >
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full text-left"
                      >
                        <span>📋</span>
                        <span>Copy link</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Related Issues */}
            {relatedIssues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Related Issues You Might Find Helpful
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedIssues.map((related, index) => {
                    const RelatedIcon = categoryIcons[related.category] || AlertCircle;
                    const relatedSeverityInfo = getSeverityInfo(related.severity);

                    return (
                      <motion.div
                        key={related.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={route('car-issues.show', related.slug)}
                          className="block group"
                        >
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 h-full">
                            {/* Icon and Category */}
                            <div className="flex items-start justify-between mb-4">
                              <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColors[related.category] || 'from-gray-500 to-gray-600'} shadow-lg group-hover:scale-110 transition-transform`}>
                                <RelatedIcon className="w-5 h-5 text-white" />
                              </div>

                              {/* Severity Badge */}
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${relatedSeverityInfo.textClass} bg-opacity-10`}>
                                {relatedSeverityInfo.icon} {relatedSeverityInfo.label}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {related.title}
                            </h3>

                            {/* Description */}
                            {related.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                {related.description}
                              </p>
                            )}

                            {/* Category Badge */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                                {related.category}
                              </span>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* View All Link */}
                <div className="text-center mt-8">
                  <Link
                    href={route('car-issues.index')}
                    className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Browse All Car Issues</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center shadow-xl"
            >
              <Car className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Still Need Help?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Get an AI-powered diagnosis of your specific issue or connect with verified local experts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={route('diagnose')}
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  <span>Get AI Diagnosis</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href={route('experts')}
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border-2 border-white/30"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Find Expert</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}