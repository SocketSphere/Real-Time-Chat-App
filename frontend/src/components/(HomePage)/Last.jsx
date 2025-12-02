import React from "react";
import { Link } from "react-router";

const Last = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800 text-white py-24 px-6 text-center rounded-3xl shadow-xl dark:shadow-gray-900 max-w-6xl mx-auto mt-12">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8 drop-shadow-lg">
        Ready to Chat With Your Friends? <br />
        Start With <span className="text-cyan-300 dark:text-cyan-200">ChatMaster</span>, Become
        Faster <br />
        Every Second
      </h1>
      <Link 
        to="/chat" 
        className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 font-semibold px-10 py-5 rounded-2xl shadow-lg dark:shadow-gray-900 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
      >
        Start Chatting Now
      </Link>
    </section>
  );
};

export default Last;