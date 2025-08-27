import { Link } from "react-router-dom";

const foot = [
  { label: "About", url: "/about" },
  { label: "Features", url: "/features" },
  { label: "Contact", url: "/contact" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-8 px-6 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="text-2xl font-bold text-white">
          <Link to="/">ChatMaster</Link>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          {foot.map((item, index) => (
            <Link
              key={index}
              to={item.url}
              className="hover:text-white hover:underline transition duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-6">
        © {new Date().getFullYear()} ChatMaster. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
