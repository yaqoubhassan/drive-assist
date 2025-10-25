import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Search,
  Filter,
  PlayCircle,
  BookOpen,
  Trophy,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

// Road sign categories
const categories = [
  { id: 'warning', name: 'Warning Signs', color: 'yellow', count: 45 },
  { id: 'regulatory', name: 'Regulatory Signs', color: 'red', count: 38 },
  { id: 'information', name: 'Information Signs', color: 'blue', count: 52 },
  { id: 'guide', name: 'Guide Signs', color: 'green', count: 25 },
];

// Sample road signs data (in production, this would come from API/database)
const roadSigns = [
  {
    id: 1,
    name: 'Stop Sign',
    category: 'regulatory',
    image: '/images/signs/stop.svg',
    meaning: 'Come to a complete stop at the stop line or before entering the intersection',
    action: 'Stop completely, check for traffic, proceed when safe',
    shape: 'Octagon',
    color: 'Red with white text',
  },
  {
    id: 2,
    name: 'Yield Sign',
    category: 'regulatory',
    image: '/images/signs/yield.svg',
    meaning: 'Slow down and give right-of-way to traffic',
    action: 'Slow down, be prepared to stop, let other traffic go first',
    shape: 'Inverted Triangle',
    color: 'Red and white',
  },
  {
    id: 3,
    name: 'Speed Limit',
    category: 'regulatory',
    image: '/images/signs/speed-limit.svg',
    meaning: 'Maximum legal speed under ideal conditions',
    action: 'Do not exceed this speed',
    shape: 'Rectangle',
    color: 'White with black text',
  },
  {
    id: 4,
    name: 'Curve Ahead',
    category: 'warning',
    image: '/images/signs/curve.svg',
    meaning: 'Road curves ahead',
    action: 'Slow down, stay in your lane',
    shape: 'Diamond',
    color: 'Yellow with black symbol',
  },
  {
    id: 5,
    name: 'Pedestrian Crossing',
    category: 'warning',
    image: '/images/signs/pedestrian.svg',
    meaning: 'Pedestrians may be crossing',
    action: 'Be alert, yield to pedestrians',
    shape: 'Diamond',
    color: 'Yellow with black symbol',
  },
  {
    id: 6,
    name: 'School Zone',
    category: 'warning',
    image: '/images/signs/school.svg',
    meaning: 'School area ahead',
    action: 'Reduce speed, watch for children',
    shape: 'Pentagon',
    color: 'Yellow-green with black symbol',
  },
  {
    id: 7,
    name: 'Hospital',
    category: 'information',
    image: '/images/signs/hospital.svg',
    meaning: 'Medical facility nearby',
    action: 'Be aware of emergency vehicles and patients',
    shape: 'Rectangle',
    color: 'Blue with white symbol',
  },
  {
    id: 8,
    name: 'Rest Area',
    category: 'information',
    image: '/images/signs/rest-area.svg',
    meaning: 'Rest stop ahead',
    action: 'Take a break if tired',
    shape: 'Rectangle',
    color: 'Blue with white symbol',
  },
  // Add more signs...
];

// Quiz questions
const quizQuestions = [
  {
    id: 1,
    image: '/images/signs/stop.svg',
    question: 'What does this sign mean?',
    options: [
      'Slow down',
      'Come to a complete stop',
      'Yield to traffic',
      'Caution ahead',
    ],
    correctAnswer: 1,
    explanation: 'An octagonal red sign always means you must come to a complete stop.',
  },
  {
    id: 2,
    image: '/images/signs/yield.svg',
    question: 'What shape is a yield sign?',
    options: [
      'Octagon',
      'Circle',
      'Inverted Triangle',
      'Diamond',
    ],
    correctAnswer: 2,
    explanation: 'Yield signs are inverted (upside-down) triangles.',
  },
  // Add more questions...
];

export default function RoadSigns() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSign, setSelectedSign] = useState<typeof roadSigns[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Filter signs
  const filteredSigns = roadSigns.filter((sign) => {
    const matchesCategory = !selectedCategory || sign.category === selectedCategory;
    const matchesSearch = sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === quizQuestions[quizStep].correctAnswer) {
      setQuizScore(quizScore + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      setShowQuiz(false);
      setQuizStep(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <ThemeProvider>
      <Head title="Road Signs Guide - Master Every Road Sign" />

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-orange-900/20">
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(251, 191, 36, 0.3) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
                className="absolute inset-0"
              />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center mb-4">
                <Link
                  href="/resources"
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Resources
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                  Master{' '}
                  <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    Every Road Sign
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                  Interactive database of 160+ road signs with detailed meanings, actions, and a
                  knowledge quiz to test your skills.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 mb-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                      160+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Road Signs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                      4
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                      20
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Quiz Questions</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="#database"
                    className="inline-flex items-center justify-center px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Browse Database
                  </Link>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-lg transition-all"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Take Quiz
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="py-12 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === category.id ? null : category.id)
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-6 rounded-xl border-2 transition-all ${selectedCategory === category.id
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-yellow-400'
                      }`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color === 'yellow'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30'
                          : category.color === 'red'
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : category.color === 'blue'
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : 'bg-green-100 dark:bg-green-900/30'
                          }`}
                      >
                        <Filter className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.count} signs
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          {/* Search & Filter Section */}
          <section id="database" className="py-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search road signs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-yellow-500 dark:focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Results Count */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  Showing {filteredSigns.length} of {roadSigns.length} signs
                </div>
              </div>
            </div>
          </section>

          {/* Signs Grid */}
          <section ref={ref} className="py-12 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredSigns.map((sign, index) => (
                  <motion.button
                    key={sign.id}
                    onClick={() => setSelectedSign(sign)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
                    }
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all text-left"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      {/* Sign image would go here */}
                      <div className="text-6xl">🚦</div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {sign.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {sign.category}
                    </p>
                  </motion.button>
                ))}
              </div>

              {filteredSigns.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No signs found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Sign Detail Modal */}
          {selectedSign && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedSign(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedSign.name}
                  </h2>
                  <button
                    onClick={() => setSelectedSign(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-6 flex items-center justify-center">
                  <div className="text-9xl">🚦</div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Meaning
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedSign.meaning}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      What You Should Do
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedSign.action}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        Shape
                      </h4>
                      <p className="text-gray-900 dark:text-white">{selectedSign.shape}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        Color
                      </h4>
                      <p className="text-gray-900 dark:text-white">{selectedSign.color}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium capitalize">
                      {selectedSign.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Quiz Modal */}
          {showQuiz && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Road Signs Quiz
                    </h2>
                    <button
                      onClick={() => {
                        setShowQuiz(false);
                        setQuizStep(0);
                        setQuizScore(0);
                        setSelectedAnswer(null);
                        setShowExplanation(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Question {quizStep + 1} of {quizQuestions.length}
                    </span>
                    <span>
                      Score: {quizScore}/{quizStep + (showExplanation ? 1 : 0)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-600 transition-all duration-300"
                      style={{
                        width: `${((quizStep + 1) / quizQuestions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-6 flex items-center justify-center max-w-xs mx-auto">
                    <div className="text-8xl">🚦</div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">
                    {quizQuestions[quizStep].question}
                  </h3>

                  <div className="space-y-3">
                    {quizQuestions[quizStep].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => !showExplanation && handleQuizAnswer(index)}
                        disabled={showExplanation}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${showExplanation
                          ? index === quizQuestions[quizStep].correctAnswer
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                            : index === selectedAnswer
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-yellow-500'
                          }`}
                      >
                        <span className="text-gray-900 dark:text-white font-medium">
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>

                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg"
                    >
                      <p className="text-gray-700 dark:text-gray-300">
                        {quizQuestions[quizStep].explanation}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Next Button */}
                {showExplanation && (
                  <button
                    onClick={nextQuizQuestion}
                    className="w-full py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                  >
                    {quizStep < quizQuestions.length - 1 ? (
                      <>
                        Next Question
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Quiz
                        <Trophy className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}