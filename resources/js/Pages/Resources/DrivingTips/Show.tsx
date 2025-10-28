import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { BackButton } from '@/Components/ui/BackButton';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Eye,
  Clock,
  Share2,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
  X as XIcon,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

// TypeScript Interfaces
interface DrivingTip {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_label: string;
  category_color: string;
  difficulty: string;
  difficulty_label: string;
  difficulty_color: string;
  excerpt: string;
  content: string;
  key_points: string[] | null;
  dos: string[] | null;
  donts: string[] | null;
  pro_tip: string | null;
  reading_time_minutes: number;
  formatted_reading_time: string;
  view_count: number;
  helpful_count: number;
  is_featured: boolean;
  is_popular: boolean;
}

interface Props {
  tip: DrivingTip;
  relatedTips: DrivingTip[];
  userProgress: {
    is_bookmarked: boolean;
    is_helpful: boolean;
    is_read: boolean;
  } | null;
}

// Category badge colors (same as Index)
const categoryColors = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  gray: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
};

const difficultyColors = {
  beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};

export default function DrivingTipShow({ tip, relatedTips, userProgress }: Props) {
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(userProgress?.is_bookmarked || false);
  const [isHelpful, setIsHelpful] = useState(userProgress?.is_helpful || false);
  const [currentHelpfulCount, setCurrentHelpfulCount] = useState(tip.helpful_count);

  // Safe data access
  const keyPoints = Array.isArray(tip.key_points) ? tip.key_points : [];
  const dos = Array.isArray(tip.dos) ? tip.dos : [];
  const donts = Array.isArray(tip.donts) ? tip.donts : [];

  const categoryColorClass =
    categoryColors[tip.category_color as keyof typeof categoryColors] || categoryColors.gray;
  const difficultyColorClass =
    difficultyColors[tip.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner;

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: tip.title,
          text: tip.excerpt,
          url: url,
        });
        setShareMessage('Shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }

    setTimeout(() => setShareMessage(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShareMessage('Link copied to clipboard!');
  };

  // Handle bookmark
  const handleBookmark = async () => {
    try {
      const response = await fetch(route('driving-tips.bookmark', tip.slug), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const data = await response.json();
      setIsBookmarked(data.is_bookmarked);
      setShareMessage(data.message);
      setTimeout(() => setShareMessage(null), 3000);
    } catch (error) {
      console.error('Bookmark error:', error);
      setShareMessage('Please log in to bookmark tips');
      setTimeout(() => setShareMessage(null), 3000);
    }
  };

  // Handle helpful
  const handleHelpful = async () => {
    try {
      const response = await fetch(route('driving-tips.helpful', tip.slug), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIsHelpful(true);
        setCurrentHelpfulCount(data.helpful_count);
        setShareMessage(data.message);
      } else {
        setShareMessage(data.message);
      }
      setTimeout(() => setShareMessage(null), 3000);
    } catch (error) {
      console.error('Helpful error:', error);
      setShareMessage('Please log in to mark as helpful');
      setTimeout(() => setShareMessage(null), 3000);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title={`${tip.title} - DriveAssist`} />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton href="/resources/driving-tips" label="Back to Driving Tips" className="mb-6" />

            {/* Share Message Toast */}
            {shareMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {shareMessage}
              </motion.div>
            )}

            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColorClass}`}>
                  {tip.category_label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColorClass}`}>
                  {tip.difficulty_label}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {tip.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{tip.formatted_reading_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{tip.view_count.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  <span>{currentHelpfulCount} found helpful</span>
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">{tip.excerpt}</p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-purple-600" />
                      <span>Bookmarked</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Bookmark</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleHelpful}
                  disabled={isHelpful}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isHelpful
                    ? 'bg-purple-600 text-white border-purple-600 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{isHelpful ? 'Marked Helpful' : 'Mark Helpful'}</span>
                </button>
              </div>
            </motion.div>

            {/* Key Points */}
            {keyPoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 mb-8"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  Key Takeaways
                </h2>
                <ul className="space-y-2">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: tip.content.replace(/\n/g, '<br />'),
                }}
              />
            </motion.div>

            {/* Do's and Don'ts */}
            {(dos.length > 0 || donts.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-2 gap-6 mb-8"
              >
                {/* Do's */}
                {dos.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Do's
                    </h3>
                    <ul className="space-y-2">
                      {dos.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Don'ts */}
                {donts.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <XIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      Don'ts
                    </h3>
                    <ul className="space-y-2">
                      {donts.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <XIcon className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Pro Tip */}
            {tip.pro_tip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 mb-8"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  Pro Tip
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{tip.pro_tip}</p>
              </motion.div>
            )}

            {/* Related Tips */}
            {relatedTips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Tips
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedTips.map((relatedTip) => (
                    <Link
                      key={relatedTip.id}
                      href={route('driving-tips.show', relatedTip.slug)}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
                    >
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[relatedTip.category_color as keyof typeof categoryColors] ||
                          categoryColors.gray
                          }`}
                      >
                        {relatedTip.category_label}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {relatedTip.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {relatedTip.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {relatedTip.reading_time_minutes} min read
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-2 transition-all" />
                      </div>
                    </Link>
                  ))}
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