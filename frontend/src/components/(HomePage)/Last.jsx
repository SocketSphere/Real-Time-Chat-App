import React from "react";

const Last = () => {
  return (
    <section className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white py-24 px-6 text-center rounded-3xl shadow-xl max-w-6xl mx-auto mt-12">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8 drop-shadow-lg">
        Ready to Chat With Your Friends? <br />
        Start With <span className="text-yellow-300">ChatMaster</span>, Become
        Faster <br />
        Every Second
      </h1>
      <button className="bg-white text-orange-600 font-semibold px-10 py-5 rounded-2xl shadow-lg hover:scale-105 hover:bg-gray-100 transition-transform duration-300">
        Start Chatting Now
      </button>
    </section>
  );
};

export default Last;
