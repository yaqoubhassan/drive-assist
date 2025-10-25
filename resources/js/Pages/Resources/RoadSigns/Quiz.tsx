import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  difficulty: string;
  roadSign: {
    id: number;
    name: string;
    image_url: string;
  };
}

interface Props {
  questions: Question[];
  category: string | null;
  difficulty: string | null;
}

export default function Quiz({ questions, category, difficulty }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    // Save answer
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: selectedAnswer,
    });

    // Reset for next question
    setSelectedAnswer(null);
    setShowResult(false);

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Include the last answer if it exists
    const finalAnswers = selectedAnswer !== null
      ? { ...answers, [questions[currentQuestion].id]: selectedAnswer }
      : answers;

    router.post(
      route('road-signs.quiz.submit'),
      {
        answers: finalAnswers,
        timeTaken: timeElapsed,
      },
      {
        onSuccess: () => {
          // Will redirect to results page
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <ThemeProvider>
      <Head title={`Quiz Question ${currentQuestion + 1} of ${questions.length}`} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Header */}
            <div className="mb-8">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(timeElapsed)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Category & Difficulty Badge */}
              <div className="flex flex-wrap gap-2">
                {category && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full capitalize">
                    {category}
                  </span>
                )}
                {difficulty && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium rounded-full capitalize">
                    {difficulty}
                  </span>
                )}
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Road Sign Emoji */}
                {question.roadSign && (
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 inline-block p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
                        <span className="text-8xl">{question.roadSign.image_url}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {question.roadSign.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Question */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {question.question}
                  </h2>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                          } ${showResult ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                          }`}
                      >
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-700 dark:text-gray-300 mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-gray-900 dark:text-white">{option}</span>
                          {selectedAnswer === index && (
                            <CheckCircle className="ml-auto w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null || isSubmitting}
                      className={`px-8 py-3 rounded-lg font-semibold transition-all ${selectedAnswer === null || isSubmitting
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md'
                        }`}
                    >
                      {isSubmitting
                        ? 'Submitting...'
                        : currentQuestion < questions.length - 1
                          ? 'Next Question →'
                          : 'Submit Quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Helper Text */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Select an answer and click next to continue
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}