import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { BackButton } from '@/Components/ui/BackButton';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Eye,
  Clock,
  Share2,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Zap,
  Battery,
  PlugZap,
  DollarSign,
  Award,
  Leaf,
  BookOpen,
  Star,
  TrendingUp,
  Play,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from 'lucide-react';
import type { ElectricVehicleShowProps, ElectricVehicle } from '@/types/electric-vehicle';

// Category icon mapping
const categoryIcons: Record<string, any> = {
  buying_guide: BookOpen,
  charging: PlugZap,
  battery_maintenance: Battery,
  cost_comparison: DollarSign,
  tax_incentives: Award,
  model_reviews: Star,
  technology: Zap,
  environmental: Leaf,
  infrastructure: '🏗️',
  general: Sparkles,
};

// Category badge colors
const categoryColors: Record<string, string> = {
  buying_guide: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  charging: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  battery_maintenance: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  cost_comparison: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  tax_incentives: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  model_reviews: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  technology: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  environmental: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  infrastructure: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  general: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
};

interface ContentSection {
  id: string;
  title: string;
  content: string;
  level: number;
}

/**
 * Parse markdown content into sections based on headers
 */
function parseContentIntoSections(markdown: string): ContentSection[] {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const sections: ContentSection[] = [];
  let currentSection: ContentSection | null = null;
  let sectionCounter = 0;

  for (const line of lines) {
    // Check if line is a header
    const h1Match = line.match(/^# (.+)$/);
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);

    if (h1Match || h2Match) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }

      // Start new section
      const title = h1Match ? h1Match[1] : h2Match![1];
      const level = h1Match ? 1 : 2;
      sectionCounter++;

      currentSection = {
        id: `section-${sectionCounter}`,
        title,
        content: '',
        level,
      };
    } else if (currentSection) {
      // Add content to current section
      currentSection.content += line + '\n';
    } else {
      // Content before first header - create intro section
      if (line.trim()) {
        if (!sections.length || sections[0].id !== 'section-intro') {
          sections.unshift({
            id: 'section-intro',
            title: 'Introduction',
            content: '',
            level: 2,
          });
        }
        sections[0].content += line + '\n';
      }
    }
  }

  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.filter(s => s.content.trim());
}

/**
 * Convert markdown to HTML (simplified version)
 */
function markdownToHTML(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // Headers (H3 only, since H1/H2 are section titles)
  html = html.replace(/^### (.+)$/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-4">$1</h3>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Lists
  const listItems = html.split('\n').map(line => {
    if (line.match(/^[-*•]\s+(.+)/)) {
      return line.replace(/^[-*•]\s+(.+)/, '<li class="ml-4">$1</li>');
    }
    return line;
  }).join('\n');

  html = listItems.replace(/(<li.*<\/li>\n?)+/g, (match) =>
    `<ul class="list-disc list-inside space-y-1 my-3 text-gray-700 dark:text-gray-300">${match}</ul>`
  );

  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<h') || para.startsWith('<ul>') || para.startsWith('<li>')) {
      return para;
    }
    if (para.trim()) {
      return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${para.replace(/\n/g, '<br />')}</p>`;
    }
    return '';
  }).join('\n');

  return html;
}

export default function ElectricVehicleShow({ article, userFeedback }: ElectricVehicleShowProps) {
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(
    userFeedback ? userFeedback.is_helpful : null
  );
  const [currentHelpfulCount, setCurrentHelpfulCount] = useState(article.helpful_count);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Safe data access
  const keyTakeaways = Array.isArray(article.key_takeaways) ? article.key_takeaways : [];
  const pros = Array.isArray(article.pros) ? article.pros : [];
  const cons = Array.isArray(article.cons) ? article.cons : [];
  const relatedArticles = Array.isArray(article.related_articles) ? article.related_articles : [];

  const CategoryIcon = categoryIcons[article.category];
  const isIconComponent = typeof CategoryIcon !== 'string';

  // Parse content into sections
  const sections = parseContentIntoSections(article.content);

  // Expand first 3 sections by default
  useEffect(() => {
    const defaultExpanded = new Set(sections.slice(0, 3).map(s => s.id));
    setExpandedSections(defaultExpanded);
  }, []);

  // Handle scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setShowMobileNav(false);
  };

  // Handle share functionality
  const handleShare = async () => {
    const url = window.location.href;
    const title = article.title;
    const text = `Check out this article: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        setShareMessage('Shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareMessage('Link copied to clipboard!');
    }

    setTimeout(() => setShareMessage(null), 3000);
  };

  // Handle helpful feedback
  const handleFeedback = async (helpful: boolean) => {
    if (isSubmitting || isHelpful !== null) {
      if (isHelpful !== null) {
        setFeedbackMessage('You have already provided feedback for this article');
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      const response = await axios.post(
        route('electric-vehicles.helpful', article.slug),
        { is_helpful: helpful, comment: null },
        {
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      setIsHelpful(helpful);
      if (helpful) {
        setCurrentHelpfulCount(currentHelpfulCount + 1);
      }
      setFeedbackMessage('Thank you for your feedback!');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      if (error.response?.status === 422) {
        setFeedbackMessage('You have already provided feedback for this article');
        setIsHelpful(true);
      } else {
        setFeedbackMessage('Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const getHelpfulButtonClasses = () => {
    const baseClasses = 'flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all';
    if (isHelpful === true) return `${baseClasses} bg-green-600 text-white`;
    if (isHelpful === false) return `${baseClasses} bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed`;
    const activeClasses = `${baseClasses} bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-300 dark:border-gray-600`;
    return isSubmitting ? `${activeClasses} opacity-50 cursor-not-allowed` : activeClasses;
  };

  const getNotHelpfulButtonClasses = () => {
    const baseClasses = 'flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all';
    if (isHelpful === false) return `${baseClasses} bg-red-600 text-white`;
    if (isHelpful === true) return `${baseClasses} bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed`;
    const activeClasses = `${baseClasses} bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-300 dark:border-gray-600`;
    return isSubmitting ? `${activeClasses} opacity-50 cursor-not-allowed` : activeClasses;
  };

  return (
    <ThemeProvider>
      <Head title={`${article.title} - Electric Vehicles - DriveAssist`} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <BackButton href="/resources/electric-vehicles" className="mb-6" />

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${categoryColors[article.category]}`}>
                  {isIconComponent ? <CategoryIcon className="w-4 h-4" /> : <span>{CategoryIcon}</span>}
                  <span>{article.category_label}</span>
                </span>
                {article.is_featured && (
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium rounded-full flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {article.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {article.reading_time_minutes} min read
                </span>
                <span className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  {article.view_count.toLocaleString()} views
                </span>
                {currentHelpfulCount > 0 && (
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    {currentHelpfulCount} helpful
                  </span>
                )}
                <button onClick={handleShare} className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>

              {shareMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-center"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {shareMessage}
                </motion.div>
              )}
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Navigation - Desktop */}
              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-24">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Contents
                    </h3>
                    <nav className="space-y-1">
                      {sections.map((section, index) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            } ${section.level === 1 ? 'font-semibold' : 'pl-6'}`}
                        >
                          {section.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>

              {/* Mobile Navigation Toggle */}
              <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <button
                  onClick={() => setShowMobileNav(!showMobileNav)}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  {showMobileNav ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

              {/* Mobile Navigation Menu */}
              {showMobileNav && (
                <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileNav(false)}>
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contents</h3>
                      <nav className="space-y-1">
                        {sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                          >
                            {section.title}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="lg:col-span-9 space-y-6">
                {/* Key Takeaways */}
                {keyTakeaways.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-l-4 border-blue-600">
                      <div className="flex items-center mb-4">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Key Takeaways
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {keyTakeaways.map((takeaway, index) => (
                          <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* Content Sections */}
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="scroll-mt-24"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {/* Section Header - Clickable */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <h2 className={`${section.level === 1 ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 dark:text-white flex items-center`}>
                          <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold mr-3">
                            {index + 1}
                          </span>
                          {section.title}
                        </h2>
                        {expandedSections.has(section.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {/* Section Content - Collapsible */}
                      {expandedSections.has(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700"
                        >
                          <div
                            className="prose prose-lg dark:prose-invert max-w-none mt-4"
                            dangerouslySetInnerHTML={{ __html: markdownToHTML(section.content) }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Pros and Cons */}
                {(pros.length > 0 || cons.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {pros.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                        <div className="flex items-center mb-4">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advantages</h3>
                        </div>
                        <ul className="space-y-2">
                          {pros.map((pro, index) => (
                            <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                              <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {cons.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                        <div className="flex items-center mb-4">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Disadvantages</h3>
                        </div>
                        <ul className="space-y-2">
                          {cons.map((con, index) => (
                            <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                              <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Cost Range */}
                {article.cost_range && article.cost_range !== 'Varies' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estimated Cost</h3>
                        </div>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{article.cost_range}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Prices may vary based on location, model, and additional features
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Helpful Feedback */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                      Was this article helpful?
                    </h3>
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => handleFeedback(true)}
                        disabled={isSubmitting || isHelpful !== null}
                        className={getHelpfulButtonClasses()}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span>Yes, helpful</span>
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        disabled={isSubmitting || isHelpful !== null}
                        className={getNotHelpfulButtonClasses()}
                      >
                        <ThumbsDown className="w-5 h-5" />
                        <span>Not helpful</span>
                      </button>
                    </div>
                    {feedbackMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-3 rounded-lg flex items-center justify-center ${feedbackMessage.includes('Thank you')
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          }`}
                      >
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {feedbackMessage}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
                      Related Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedArticles.map((relatedArticle) => (
                        <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

// Related Article Card Component
function RelatedArticleCard({ article }: { article: ElectricVehicle }) {
  const CategoryIcon = categoryIcons[article.category];
  const isIconComponent = typeof CategoryIcon !== 'string';

  return (
    <Link href={route('electric-vehicles.show', article.slug)}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-[360px] flex flex-col hover:shadow-lg transition-all duration-300 group">
        <div className="p-5 flex-1">
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium mb-3 ${categoryColors[article.category]}`}>
            {isIconComponent ? <CategoryIcon className="w-3 h-3" /> : <span>{CategoryIcon}</span>}
            <span>{article.category_label}</span>
          </span>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
            {article.description}
          </p>
        </div>
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {article.reading_time_minutes} min
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}