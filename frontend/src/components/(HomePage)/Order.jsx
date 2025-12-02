import React from "react";

const Order = () => {
  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-16">
      {/* Image Section */}
      <div className="flex-shrink-0">
        <img
          src="/s4.png"
          alt="Direct orders illustration"
          className="w-full max-w-md h-auto rounded-xl shadow-lg dark:shadow-gray-900"
        />
      </div>

      {/* Text Section */}
      <div className="max-w-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 leading-snug mb-4 transition-colors duration-300">
          Receive Direct Orders <br />
          From Your Customers
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
          Streamline your sales process by connecting with customers directly through
          real-time chat. Respond instantly, manage orders efficiently, and boost your business growth.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-3xl font-extrabold text-orange-500 dark:text-orange-400">4.3K+</h3>
            <p className="text-gray-600 dark:text-gray-400">Active Websites Powered</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-orange-500 dark:text-orange-400">7M+</h3>
            <p className="text-gray-600 dark:text-gray-400">Chats Processed in 2025</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Order;