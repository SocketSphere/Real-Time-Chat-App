import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Icon Section */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-full blur-2xl"></div>
          </div>
          <div className="relative">
            <AlertTriangle className="h-24 w-24 mx-auto text-red-500 dark:text-red-400" />
            <div className="mt-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                404
              </h1>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                Page Not Found
              </p>
            </div>
          </div>
        </div>

        {/* Message Section */}
        <div className="space-y-3">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Oops! The page you're looking for seems to have wandered off.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            It might have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Suggestions Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5" />
            What you can do:
          </h3>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Check the URL for typos or errors
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Navigate back to the previous page
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Use the search function to find what you're looking for
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            asChild
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-300"
          >
            <Link to="/" className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Return to Home
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            onClick={() => window.history.back()}
          >
            <button className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </Button>
        </div>

        {/* Search CTA */}
        <div className="pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Can't find what you're looking for?
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300"
          >
            <Search className="w-4 h-4" />
            Try searching instead
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full blur-xl opacity-50"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full blur-xl opacity-50"></div>
      </div>
    </div>
  );
};

export default NotFound;