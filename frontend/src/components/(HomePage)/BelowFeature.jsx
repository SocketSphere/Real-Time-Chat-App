import React from "react";

const BelowFeature = () => {
  return (
    <section className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6 py-16">
      {/* Image Section */}
      <div className="flex-shrink-0">
        <img
          src="/s2.png"
          alt="Live video chat illustration"
          className="w-full max-w-[526px] h-auto rounded-xl shadow-lg dark:shadow-gray-900"
        />
      </div>

      {/* Text Section */}
      <div className="max-w-[511px]">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 leading-snug">
          Meet Your Friends <br />
          With Live Video Chat
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Connect instantly with friends and family anywhere in the world. Share
          moments, have fun, and stay close no matter the distance.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Enjoy high-quality live video, seamless communication, and a user-friendly
          platform built for socializing and collaboration.
        </p>
      </div>
    </section>
  );
};

export default BelowFeature;