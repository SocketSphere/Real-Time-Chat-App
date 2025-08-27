import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
