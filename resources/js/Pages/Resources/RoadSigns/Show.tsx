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
                          <span className="px-3 py-1 bg-white/20 rounded-full">
                            {sign.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sign Image */}
                  <div className="bg-gray-100 dark:bg-gray-700 p-12 flex items-center justify-center">
                    <img
                      src={sign.image_url}
                      alt={sign.name}
                      className="max-h-64 object-contain"
                    />
                  </div>

                  {/* Content Sections */}
                  <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Info className="w-5 h-5 mr-2 text-blue-600" />
                        Description
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        {sign.description}
                      </p>
                    </div>

                    {/* Meaning */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                        What It Means
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        {sign.meaning}
                      </p>
                    </div>

                    {/* What to Do */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        What You Should Do
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        {sign.what_to_do}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Sign Details */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Sign Details
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Category
                        </dt>
                        <dd className="mt-1">
                          <span
                            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${categoryColors[sign.category]
                              }`}
                          >
                            {sign.category}
                          </span>
                        </dd>
                      </div>
                      {sign.shape && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Shape
                          </dt>
                          <dd className="mt-1 text-gray-900 dark:text-white capitalize">
                            {sign.shape}
                          </dd>
                        </div>
                      )}
                      {sign.color_scheme && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Colors
                          </dt>
                          <dd className="mt-1 text-gray-900 dark:text-white capitalize">
                            {sign.color_scheme.replace('-', ' & ')}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* Related Signs */}
                  {relatedSigns.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Related Signs
                      </h3>
                      <div className="space-y-3">
                        {relatedSigns.map((relatedSign) => (
                          <Link
                            key={relatedSign.id}
                            href={route('road-signs.show', relatedSign.slug)}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <img
                              src={relatedSign.image_url}
                              alt={relatedSign.name}
                              className="w-12 h-12 object-contain"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {relatedSign.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {relatedSign.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
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