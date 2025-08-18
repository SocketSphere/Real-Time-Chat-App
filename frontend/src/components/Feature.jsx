import { Video, Clock, Shield } from "lucide-react";

const Feature = () => {
  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-6">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
        Features for the Best Experience
      </h2>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
            <Video className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-xl text-gray-800 mb-3">
            Video Messaging
          </h3>
          <p className="text-gray-600">
            Communicate seamlessly with built-in video messaging features designed for simplicity and efficiency.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
            <Clock className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-xl text-gray-800 mb-3">
            Save Your Time
          </h3>
          <p className="text-gray-600">
            Automate repetitive tasks and boost your productivity with tools built to streamline your workflow.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-xl text-gray-800 mb-3">
            Keep Data Safe
          </h3>
          <p className="text-gray-600">
            Your privacy and security come first with advanced protection for your personal and professional data.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Feature;
