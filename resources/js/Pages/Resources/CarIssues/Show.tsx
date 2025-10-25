import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  AlertCircle,
  Wrench,
  Zap,
  Cog,
  Disc,
  Move,
  Droplets,
  Fuel,
  Wind,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Clock,
  ThumbsUp,
  Share2,
  ArrowLeft,
  ArrowRight,
  Phone,
  Eye,
} from 'lucide-react';

interface CarIssue {
  id: number;
  title: string;
  slug: string;
  category: string;
  severity: string;
  symptoms: string;
  description: string;
  possible_causes: string;
  diy_solution: string | null;
  when_to_call_expert: string;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  view_count: number;
  helpful_count: number;
  category_icon: string;
  severity_color: string;
  cost_range: string;
}

interface Props {
  issue: CarIssue;
  relatedIssues: CarIssue[];
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

export default function CarIssueShow({ issue, relatedIssues }: Props) {
  const [isHelpful, setIsHelpful] = useState(false);
  const Icon = categoryIcons[issue.category] || AlertCircle;

  const handleMarkHelpful = async () => {
    if (isHelpful) return;

    try {
      await router.post(
        route('car-issues.helpful', issue.id),
        {},
        {
          preserveScroll: true,
          onSuccess: () => {
            setIsHelpful(true);
          },
        }
      );
    } catch (error) {
      console.error('Failed to mark as helpful:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: issue.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    const baseClass = 'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold';
    switch (severity) {
      case 'low':
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'medium':
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'high':
        return `${baseClass} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`;
      case 'critical':
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  };

  return (
    <ThemeProvider>
      <Head title={`${issue.title} - Car Issues - DriveAssist`} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href={route('car-issues.index')}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Issues
            </Link>

            {/* Main Content Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold mb-3">{issue.title}</h1>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={getSeverityBadgeClass(issue.severity).replace('bg-', 'bg-white/20 ').replace('text-', 'text-white ')}>
                          {issue.severity.toUpperCase()} Severity
                        </span>
                        <span className="flex items-center text-white/80 text-sm">
                          <Eye className="w-4 h-4 mr-1" />
                          {issue.view_count} views
                        </span>
                        <span className="flex items-center text-white/80 text-sm">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {issue.helpful_count} found helpful
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Overview */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Overview
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {issue.description}
                  </p>
                </section>

                {/* Symptoms */}
                <section className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-600">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Common Symptoms
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {issue.symptoms}
                  </div>
                </section>

                {/* Possible Causes */}
                {issue.possible_causes && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <AlertCircle className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
                      Possible Causes
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {issue.possible_causes}
                    </div>
                  </section>
                )}

                {/* DIY Solution */}
                {issue.diy_solution && (
                  <section className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Wrench className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                      DIY Solution
                    </h2>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {issue.diy_solution}
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-start">
                        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Safety Notice:</strong> Only attempt DIY repairs if you have the
                          necessary tools, knowledge, and experience. When in doubt, consult a professional.
                        </span>
                      </p>
                    </div>
                  </section>
                )}

                {/* When to Call Expert */}
                {issue.when_to_call_expert && (
                  <section className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border-l-4 border-red-600">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                      When to Call an Expert
                    </h2>
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {issue.when_to_call_expert}
                    </div>
                  </section>
                )}

                {/* Cost Estimate */}
                <section className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                    Estimated Repair Cost
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {issue.cost_range}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Average repair cost (parts + labor)
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    * Costs may vary based on vehicle make/model, location, and shop rates. Get quotes from
                    multiple mechanics for accurate pricing.
                  </p>
                </section>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="/diagnose"
                    className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-center transition-colors flex items-center justify-center"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Diagnose My Issue
                  </Link>
                  <Link
                    href="/experts"
                    className="flex-1 px-6 py-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-900 dark:text-white rounded-xl font-semibold text-center transition-colors flex items-center justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Find Local Expert
                  </Link>
                </div>

                {/* Helpful & Share */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleMarkHelpful}
                      disabled={isHelpful}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${isHelpful
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
                      <span>{isHelpful ? 'Marked Helpful' : 'Was this helpful?'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Related Issues */}
            {relatedIssues.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Issues
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedIssues.map((relatedIssue) => {
                    const RelatedIcon = categoryIcons[relatedIssue.category] || AlertCircle;

                    return (
                      <Link
                        key={relatedIssue.id}
                        href={route('car-issues.show', relatedIssue.slug)}
                        className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <RelatedIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                            {relatedIssue.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {relatedIssue.description}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}