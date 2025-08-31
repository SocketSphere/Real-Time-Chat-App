import React from "react";
import { Link } from "react-router";

const Conversation = () => {
  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-16">
      {/* Text Section */}
      <div className="max-w-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug mb-4">
          Start Chatting Instantly <br />
          Inside Conversations
        </h2>
        <p className="text-gray-600 mb-6">
          Connect with friends and customers directly through seamless chat
          conversations. Share updates, answer questions, and build stronger
          connections in real-time.
        </p>
        <Link to="/chat" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-300">
          Start Chatting Now
        </Link>
      </div>

      {/* Image Section */}
      <div className="flex-shrink-0">
        <img
          src="/s3.png"
          alt="Conversation illustration"
          className="w-full max-w-md h-auto rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
};

export default Conversation;
