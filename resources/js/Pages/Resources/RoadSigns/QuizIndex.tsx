import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Trophy,
  Play,
  Clock,
  Target,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

interface Category {
  category: string;
  count: number;
}

interface QuizAttempt {
  id: number;
  score_percentage: number;
  correct_answers: number;
  total_questions: number;
  time_taken_seconds: number;
  created_at: string;
}

interface Props {
  totalSigns: number;
  totalQuestions: number;
  categories: Category[];
  recentAttempts: QuizAttempt[] | null;
}

export default function QuizIndex({
  totalSigns,
  totalQuestions,
  categories,
  recentAttempts,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(10);

  const handleStartQuiz = () => {
    router.post(route('road-signs.quiz.start'), {
      category: selectedCategory || undefined,
      difficulty: selectedDifficulty || undefined,
      questionCount,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      warning: 'yellow',
      regulatory: 'red',
      information: 'blue',
      guide: 'green',
    };
    return colors[category] || 'blue';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <ThemeProvider>
      <Head title="Road Signs Quiz - Test Your Knowledge" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href={route('road-signs.index')}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Road Signs
            </Link>

            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6"
              >
                <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Test Your Knowledge
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              >
                Challenge yourself with our interactive road signs quiz and improve your road
                safety knowledge
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quiz Setup */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Customize Your Quiz
                  </h2>

                  {/* Category Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Select Category (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedCategory('')}
                        className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === ''
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                      >
                        <div className="font-semibold text-gray-900 dark:text-white">
                          All Signs
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {totalSigns} signs
                        </div>
                      </button>

                      {categories.map((cat) => (
                        <button
                          key={cat.category}
                          onClick={() => setSelectedCategory(cat.category)}
                          className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === cat.category
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white capitalize">
                            {cat.category}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {cat.count} signs
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Difficulty Level (Optional)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['', 'easy', 'medium', 'hard'].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`p-3 rounded-lg border-2 transition-all ${selectedDifficulty === diff
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                        >
                          <div className="font-semibold text-gray-900 dark:text-white capitalize">
                            {diff || 'All Levels'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Count */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Number of Questions: {questionCount}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span>5</span>
                      <span>50</span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={handleStartQuiz}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-4 rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Quiz</span>
                  </button>
                </motion.div>
              </div>

              {/* Stats & Recent Attempts */}
              <div className="space-y-6">
                {/* Quiz Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Quiz Statistics
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-700 dark:text-gray-300">Total Signs</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {totalSigns}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-gray-700 dark:text-gray-300">Quiz Questions</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {totalQuestions}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Recent Attempts */}
                {recentAttempts && recentAttempts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                      Your Recent Attempts
                    </h3>

                    <div className="space-y-3">
                      {recentAttempts.map((attempt) => (
                        <div
                          key={attempt.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-2xl font-bold ${attempt.score_percentage >= 70
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                                }`}
                            >
                              {attempt.score_percentage}%
                            </span>
                            {attempt.score_percentage >= 70 && (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <div>
                              {attempt.correct_answers}/{attempt.total_questions} correct
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTime(attempt.time_taken_seconds)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Quiz Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Take your time and read each question carefully</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Pay attention to colors, shapes, and symbols</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>You need 70% to pass the quiz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Review explanations after each question</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}