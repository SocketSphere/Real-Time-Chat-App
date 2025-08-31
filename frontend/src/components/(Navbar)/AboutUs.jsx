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
    <section className="bg-gray-50">
      {/* About Section */}
      <div className="min-h-screen flex flex-col items-center px-6 py-16">
        <div className="max-w-4xl text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            About <span className="text-orange-500">Us</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We’re on a mission to make communication seamless, fun, and secure.
            Our platform connects people worldwide with real-time chat, media
            sharing, and meaningful interactions <span className="text-orange-400 font-bold"> anytime, anywhere.</span> 
          </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
            We built this chat platform to make communication simple, fun, and
            accessible for everyone. Whether you're catching up with friends,
            sharing media, or collaborating with teammates, our real-time chat app
            helps you stay connected anytime, anywhere.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            With a growing community of users worldwide, we’re dedicated to
            providing a seamless and secure messaging experience. Your
            conversations, your privacy, and your connections matter to us.
          </p>
        </div>

        {/* Founder Section */}
        <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-2xl p-8 max-w-5xl w-full mb-16">
          <img
            src="/my.png"
            alt="Founder"
            className="w-40 h-40 rounded-full object-cover border-4 border-orange-400 shadow-md mb-6 md:mb-0 md:mr-10"
          />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Siyamregn Yeshidagna
            </h3>
            <p className="text-orange-500 font-medium mb-4">Founder & CEO</p>
            <p className="text-gray-600 leading-relaxed">
              “I started this project to create a platform where people can
              connect without barriers. With innovation, security, and a
              human-first approach, our mission is to make communication
              effortless for everyone.”
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full text-center mb-16">
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h4 className="text-3xl font-bold text-orange-500">2200+</h4>
            <p className="text-gray-600 mt-2">Happy Users</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h4 className="text-3xl font-bold text-orange-500">50+</h4>
            <p className="text-gray-600 mt-2">Countries</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h4 className="text-3xl font-bold text-orange-500">24/7</h4>
            <p className="text-gray-600 mt-2">Support</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h4 className="text-3xl font-bold text-orange-500">100%</h4>
            <p className="text-gray-600 mt-2">Secure</p>
          </div>
        </div>

        {/* Contact Section */}
        {/* Contact Section */}
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-3xl w-full">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Contact Us
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Have a question or suggestion? Send us a message!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              rows={5}
              required
            ></textarea>
            <div className="flex justify-center">
              <button
                type="submit"
                className="py-2 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
