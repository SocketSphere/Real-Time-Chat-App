import React from "react";

const Subscribe = () => {
  return (
    <section className="w-full bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 py-24 px-6 text-center text-white mt-12 rounded-3xl shadow-xl">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Stay Updated With ChatMaster
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-12">
          Join our newsletter and be the first to know about new features,
          updates, and exclusive offers.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-2/3 px-6 py-4 rounded-2xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-lg"
            required
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-10 py-4 rounded-2xl text-lg shadow-lg transition duration-300 hover:scale-105"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Subscribe;
