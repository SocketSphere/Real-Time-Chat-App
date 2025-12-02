import React, { useState } from "react";

const AboutUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can connect this to your backend or email service
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      {/* About Section */}
      <div className="flex flex-col items-center px-6 py-16">
        <div className="max-w-4xl text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
            About <span className="text-orange-500 dark:text-orange-400">Us</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            We're on a mission to make communication seamless, fun, and secure.
            Our platform connects people worldwide with real-time chat, media
            sharing, and meaningful interactions{" "}
            <span className="text-orange-400 dark:text-orange-300 font-bold">
              anytime, anywhere.
            </span>
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            We built this chat platform to make communication simple, fun, and
            accessible for everyone. Whether you're catching up with friends,
            sharing media, or collaborating with teammates, our real-time chat app
            helps you stay connected anytime, anywhere.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            With a growing community of users worldwide, we're dedicated to
            providing a seamless and secure messaging experience. Your
            conversations, your privacy, and your connections matter to us.
          </p>
        </div>

        {/* Founder Section */}
        <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-2xl p-8 max-w-5xl w-full mb-16 transition-all duration-300">
          <img
            src="/my.png"
            alt="Founder"
            className="w-40 h-40 rounded-full object-cover border-4 border-orange-400 dark:border-orange-500 shadow-md mb-6 md:mb-0 md:mr-10"
          />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Siyamregn Yeshidagna
            </h3>
            <p className="text-orange-500 dark:text-orange-400 font-medium mb-4">
              Founder & CEO
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              "I started this project to create a platform where people can
              connect without barriers. With innovation, security, and a
              human-first approach, our mission is to make communication
              effortless for everyone."
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full text-center mb-16">
          <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <h4 className="text-3xl font-bold text-orange-500 dark:text-orange-400">2200+</h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Happy Users</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <h4 className="text-3xl font-bold text-orange-500 dark:text-orange-400">50+</h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Countries</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <h4 className="text-3xl font-bold text-orange-500 dark:text-orange-400">24/7</h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Support</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <h4 className="text-3xl font-bold text-orange-500 dark:text-orange-400">100%</h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Secure</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-2xl p-8 md:p-10 max-w-3xl w-full transition-all duration-300">
          <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Contact Us
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Have a question or suggestion? Send us a message!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-colors duration-300"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 transition-colors duration-300"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 resize-none transition-colors duration-300"
              rows={5}
              required
            ></textarea>
            <div className="flex justify-center">
              <button
                type="submit"
                className="py-3 px-8 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-500 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 max-w-5xl w-full">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-gray-900 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                To become the most trusted and innovative communication platform
                that bridges connections across the globe, making every
                conversation meaningful and secure.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-gray-900 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Our Values
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Privacy and security first</li>
                <li>• User-centric innovation</li>
                <li>• Global connectivity</li>
                <li>• Continuous improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;