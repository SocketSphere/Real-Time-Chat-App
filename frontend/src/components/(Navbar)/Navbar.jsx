import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice.js";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll handler for pricing
  const handleScrollToPricing = () => {
    if (location.pathname === "/") {
      const section = document.getElementById("pricing");
      section?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollToPricing: true } });
    }
  };

  return (
    <nav className="navbar bg-white shadow-md px-4 sticky top-0 z-50 md:px-8">
      {/* Branding */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost  normal-case text-2xl font-extrabold tracking-tight flex items-center"
        >
          <span className="text-blue-600">Chat</span>
          <span className="text-red-400 -ml-1">Master</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex navbar-center">
        <ul className="menu menu-horizontal px-1 gap-2 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about-us" className="hover:text-blue-600">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/chat" className="hover:text-blue-600">
              Chat
            </Link>
          </li>
          <li>
            <button
              className="hover:text-blue-600"
              onClick={handleScrollToPricing}
            >
              Pricing
            </button>
          </li>

          <li ref={moreRef} className="relative">
            <button
              className="cursor-pointer hover:text-blue-600"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              More
            </button>

            {moreOpen && (
              <ul className="absolute top-full left-0 mt-2 p-2 bg-white shadow rounded-md w-40 z-50">
                <li>
                  <Link
                    to="/contact"
                    className="hover:bg-gray-100 rounded-md block p-1"
                    onClick={() => setMoreOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <button
                    className="hover:bg-gray-100 rounded-md block p-1"
                    onClick={handleScrollToPricing}
                    
                  >
                    Pricing
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search messages or users..."
            className="input input-bordered rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Notifications */}
        <button className="btn btn-ghost btn-circle relative">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 
                   0118 14.158V11a6.002 6.002 0 
                   00-4-5.659V5a2 2 0 
                   10-4 0v.341C7.67 6.165 
                   6 8.388 6 11v3.159c0 
                   .538-.214 1.055-.595 
                   1.436L4 17h5m6 0v1a3 3 
                   0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>

        {/* Profile or Signup */}
        {isLogin ? (
          <div className="dropdown dropdown-end">
            <div tabIndex="0" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full border-2 border-blue-400">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="User Avatar"
                />
              </div>
            </div>
            <ul
              tabIndex="0"
              className="menu dropdown-content bg-gray-300 rounded-lg shadow-lg mt-3 w-52 p-2"
            >
              <li>
                <Link to="/Profile" className="justify-between hover:bg-gray-100 rounded-md">
                  Profile <span className="badge badge-primary">New</span>
                </Link>
              </li>
              {/* <li>
                <Link to="/setting-profile" className="hover:bg-gray-100 rounded-md">Settings</Link>
              </li> */}
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <button className="m-3 p-1 rounded-md btn-ghost hover:bg-slate-100">
              <Link to="/signup">Sign up</Link>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
