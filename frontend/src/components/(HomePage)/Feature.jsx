import { Video, Clock, Shield } from "lucide-react";

const Feature = () => {
  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-6">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-12">
        Features for the Best Experience
      </h2>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-700 transition duration-300 border dark:border-gray-700">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
            <Video className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100 mb-3">
            Video Messaging
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Communicate seamlessly with built-in video messaging features designed for simplicity and efficiency.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-700 transition duration-300 border dark:border-gray-700">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
            <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100 mb-3">
            Save Your Time
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Automate repetitive tasks and boost your productivity with tools built to streamline your workflow.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-700 transition duration-300 border dark:border-gray-700">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
            <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100 mb-3">
            Keep Data Safe
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your privacy and security come first with advanced protection for your personal and professional data.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Feature;