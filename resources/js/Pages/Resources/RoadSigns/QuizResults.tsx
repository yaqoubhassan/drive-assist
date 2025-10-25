import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Award,
  RefreshCw,
  Home,
  Share2,
} from 'lucide-react';

interface DetailedAnswer {
  question_id: number;
  user_answer: number;
  correct_answer: number;
  is_correct: boolean;
  explanation: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  difficulty: string;
  road_sign: {
    id: number;
    name: string;
    image_url: string;
  };
}

interface QuizAttempt {
  id: number;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken_seconds: number;
  created_at: string;
}

interface Props {
  attempt: QuizAttempt;
  detailedAnswers: DetailedAnswer[];
  questions: Question[];
}

export default function QuizResults({ attempt, detailedAnswers, questions }: Props) {
  const passed = attempt.score_percentage >= 70;
  const grade = getGrade(attempt.score_percentage);

  function getGrade(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getQuestionById = (id: number) => {
    return questions.find((q) => q.id === id);
  };

  const getAnswerColor = (isCorrect: boolean) => {
    return isCorrect
      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';
  };

  return (
    <ThemeProvider>
      <Head title={`Quiz Results - ${attempt.score_percentage}%`} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl shadow-2xl p-8 mb-8 ${passed
                ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                : 'bg-gradient-to-br from-orange-400 to-red-600'
                } text-white`}
            >
              <div className="text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                >
                  {passed ? (
                    <Trophy className="w-12 h-12" />
                  ) : (
                    <Target className="w-12 h-12" />
                  )}
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold mb-2"
                >
                  {passed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl mb-8 opacity-90"
                >
                  {passed
                    ? 'You passed the quiz with flying colors!'
                    : "You're on the right track. Review the explanations below to improve!"}
                </motion.p>

                {/* Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-5xl font-bold mb-1">
                      {attempt.score_percentage}%
                    </div>
                    <div className="text-sm opacity-75">Your Score</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-5xl font-bold mb-1">{grade}</div>
                    <div className="text-sm opacity-75">Grade</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-5xl font-bold mb-1">
                      {attempt.correct_answers}/{attempt.total_questions}
                    </div>
                    <div className="text-sm opacity-75">Correct</div>
                  </div>
                </motion.div>

                {/* Time */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 flex items-center justify-center text-sm opacity-75"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Completed in {formatTime(attempt.time_taken_seconds)}
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center mb-12"
            >
              <Link
                href={route('road-signs.quiz.index')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Take Another Quiz
              </Link>

              <Link
                href={route('road-signs.index')}
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Road Signs
              </Link>
            </motion.div>

            {/* Detailed Results */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Review Your Answers
              </h2>

              <div className="space-y-6">
                {detailedAnswers.map((answer, index) => {
                  const question = getQuestionById(answer.question_id);
                  if (!question) return null;

                  return (
                    <motion.div
                      key={answer.question_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`border-2 rounded-xl p-6 ${getAnswerColor(
                        answer.is_correct
                      )}`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {answer.is_correct ? (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                            )}
                            <span
                              className={`font-semibold ${answer.is_correct
                                ? 'text-green-800 dark:text-green-300'
                                : 'text-red-800 dark:text-red-300'
                                }`}
                            >
                              Question {index + 1}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {question.question}
                          </h3>
                        </div>
                        {question.road_sign && (
                          <div className="ml-4 p-3 bg-white dark:bg-gray-900 rounded-lg">
                            <span className="text-4xl">{question.road_sign.image_url}</span>
                          </div>
                        )}
                      </div>

                      {/* Answers */}
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = optIndex === answer.user_answer;
                          const isCorrectAnswer = optIndex === answer.correct_answer;

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg ${isCorrectAnswer
                                ? 'bg-green-100 dark:bg-green-900/40 border-2 border-green-500'
                                : isUserAnswer && !answer.is_correct
                                  ? 'bg-red-100 dark:bg-red-900/40 border-2 border-red-500'
                                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                                }`}
                            >
                              <div className="flex items-center">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-300 mr-3">
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span className="flex-1 text-gray-900 dark:text-white">
                                  {option}
                                </span>
                                {isCorrectAnswer && (
                                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 ml-2" />
                                )}
                                {isUserAnswer && !answer.is_correct && (
                                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 ml-2" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {answer.explanation && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-start">
                            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                Explanation:
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {answer.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Bottom Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {passed
                  ? 'Great job! Share your achievement with friends!'
                  : 'Study the explanations above and try again!'}
              </p>

              <Link
                href={route('road-signs.quiz.index')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Practice More
              </Link>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}