import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
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

export default function CarIssueShow({ issue, relatedIssues }: Props) {
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const Icon = categoryIcons[issue.category] || AlertCircle;

  const getSeverityInfo = (severity: string) => {
    const severityMap = {
      low: {
        label: 'Minor Issue',
        description: 'Can usually be fixed with routine maintenance',
        icon: '🟢',
        bgClass: 'from-green-500 to-emerald-500',
        borderClass: 'border-green-200 dark:border-green-800',
      },
      medium: {
        label: 'Moderate Issue',
        description: 'Should be addressed soon to prevent complications',
        icon: '🟡',
        bgClass: 'from-yellow-500 to-orange-500',
        borderClass: 'border-yellow-200 dark:border-yellow-800',
      },
      high: {
        label: 'Serious Issue',
        description: 'Requires prompt attention from a professional',
        icon: '🟠',
        bgClass: 'from-orange-500 to-red-500',
        borderClass: 'border-orange-200 dark:border-orange-800',
      },
      critical: {
        label: 'Critical Issue',
        description: 'Immediate professional attention required - do not drive',
        icon: '🔴',
        bgClass: 'from-red-500 to-pink-500',
        borderClass: 'border-red-200 dark:border-red-800',
      },
    };
    return severityMap[severity as keyof typeof severityMap] || severityMap.low;
  };

  const severityInfo = getSeverityInfo(issue.severity);

  const handleHelpfulClick = async (helpful: boolean) => {
    setWasHelpful(helpful);
    // API call to record feedback would go here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: issue.description,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
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
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm mb-8">
              <Link
                href="/"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link
                href={route('car-issues.index')}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Car Issues
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white font-medium">
                {issue.title}
              </span>
            </nav>

            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-12"
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-br ${severityInfo.bgClass} p-8 md:p-12 text-white relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }} />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

                <div className="relative">
                  {/* Back Button */}
                  <Link
                    href={route('car-issues.index')}
                    className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to All Issues
                  </Link>

                  {/* Title & Icon */}
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
                        {issue.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                          {severityInfo.icon} {severityInfo.label}
                        </span>
                        <span className="flex items-center text-white/80 text-sm">
                          <Eye className="w-4 h-4 mr-2" />
                          {issue.view_count} views
                        </span>
                        <span className="flex items-center text-white/80 text-sm">
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {issue.helpful_count} found helpful
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Severity Description */}
                  <p className="text-white/90 text-lg">
                    {severityInfo.description}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                {/* Description */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3 text-blue-600" />
                    What's Happening?
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Common Symptoms */}
                {symptoms.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <AlertTriangle className="w-6 h-6 mr-3 text-orange-600" />
                      Common Symptoms
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {symptoms.map((symptom, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800"
                        >
                          <CheckCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {symptom}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Possible Causes */}
                {causes.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
                      Possible Causes
                    </h2>
                    <div className="space-y-3">
                      {causes.map((cause, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                        >
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 flex-1">
                            {cause}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DIY Solutions */}
                {diySolutions.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <WrenchIcon className="w-6 h-6 mr-3 text-blue-600" />
                      DIY Solutions
                    </h2>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                      <div className="space-y-4">
                        {diySolutions.map((solution, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 flex-1 pt-1">
                              {solution}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* When to Call Expert */}
                {expertReasons.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <PhoneCall className="w-6 h-6 mr-3 text-red-600" />
                      When to Call an Expert
                    </h2>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800">
                      <p className="text-red-800 dark:text-red-300 font-semibold mb-4">
                        Contact a professional immediately if you experience:
                      </p>
                      <div className="space-y-3">
                        {expertReasons.map((reason, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {reason}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cost & Time Estimate */}
                {(issue.cost_range || issue.estimated_time) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {issue.cost_range && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              Estimated Cost
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {issue.cost_range}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Based on average parts and labor costs. Actual costs may vary.
                        </p>
                      </div>
                    )}

                    {issue.estimated_time && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              Estimated Time
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {issue.estimated_time}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Average repair time for qualified technicians.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8">
                  <h3 className="text-2xl font-bold mb-3">
                    Need Help with This Issue?
                  </h3>
                  <p className="text-white/90 mb-6">
                    Get AI-powered diagnosis or connect with verified local experts
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/diagnose"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl"
                    >
                      <Car className="w-5 h-5 mr-2" />
                      Diagnose My Issue
                    </Link>
                    <Link
                      href="/experts"
                      className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                    >
                      <PhoneCall className="w-5 h-5 mr-2" />
                      Find Expert Near Me
                    </Link>
                  </div>
                </div>

                {/* Was This Helpful */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <p className="text-center text-gray-700 dark:text-gray-300 font-semibold mb-4">
                    Was this information helpful?
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handleHelpfulClick(true)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${wasHelpful === true
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span>Yes, helpful</span>
                    </button>
                    <button
                      onClick={() => handleHelpfulClick(false)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${wasHelpful === false
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      <ThumbsDown className="w-5 h-5" />
                      <span>Not helpful</span>
                    </button>
                  </div>

                  {/* Share Button */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share this article</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Issues */}
            {relatedIssues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Issues
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedIssues.map((related) => {
                    const RelatedIcon = categoryIcons[related.category] || AlertCircle;
                    const relatedSeverityInfo = getSeverityInfo(related.severity);

                    return (
                      <Link
                        key={related.id}
                        href={route('car-issues.show', related.slug)}
                      >
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 h-full">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <RelatedIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${relatedSeverityInfo.bgClass.replace('from-', 'bg-').replace('to-', '').split(' ')[0]}/10 text-gray-700 dark:text-gray-300`}>
                              {relatedSeverityInfo.icon}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}