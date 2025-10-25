import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ArrowLeft, Eye, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface RoadSign {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  meaning: string;
  what_to_do: string;
  image_url: string;
  shape: string;
  color_scheme: string;
  view_count: number;
}

interface Props {
  sign: RoadSign;
  relatedSigns: Array<{
    id: number;
    name: string;
    slug: string;
    image_url: string;
    description: string;
  }>;
}

export default function RoadSignShow({ sign, relatedSigns }: Props) {
  const categoryColors: Record<string, string> = {
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    regulatory: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700',
    information: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    guide: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700',
  };

  return (
    <ThemeProvider>
      <Head title={`${sign.name} - Road Signs Guide`} />

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
              Back to all signs
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{sign.name}</h1>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {sign.view_count} views
                          </span>
                          <span className="px-3 py-1 bg-white/20 rounded-full capitalize">
                            {sign.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sign Emoji Display */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 inline-block p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
                        <span className="text-9xl">{sign.image_url}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Info className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Description
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {sign.description}
                      </p>
                    </div>

                    {/* Meaning */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                        What It Means
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {sign.meaning}
                      </p>
                    </div>

                    {/* What To Do */}
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                        What You Should Do
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {sign.what_to_do}
                      </p>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shape</p>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                          {sign.shape}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Color Scheme
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                          {sign.color_scheme.replace('-', ' & ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`rounded-xl p-6 border-2 ${categoryColors[sign.category]}`}
                >
                  <h3 className="font-bold mb-2">Sign Category</h3>
                  <p className="text-2xl font-bold capitalize">{sign.category}</p>
                  <p className="text-sm mt-2 opacity-75">
                    {sign.category === 'warning' && 'Warns of potential hazards ahead'}
                    {sign.category === 'regulatory' && 'Laws and regulations you must follow'}
                    {sign.category === 'information' && 'Helpful services and information'}
                    {sign.category === 'guide' && 'Directional and route information'}
                  </p>
                </motion.div>

                {/* Related Signs */}
                {relatedSigns.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Related Signs
                    </h3>
                    <div className="space-y-3">
                      {relatedSigns.map((relatedSign) => (
                        <Link
                          key={relatedSign.id}
                          href={route('road-signs.show', relatedSign.slug)}
                          className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                        >
                          <span className="text-3xl mr-3 group-hover:scale-110 transition-transform">
                            {relatedSign.image_url}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {relatedSign.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {relatedSign.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Test Your Knowledge
                  </h3>
                  <Link
                    href={route('road-signs.quiz.index')}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                  >
                    Take Quiz
                  </Link>
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