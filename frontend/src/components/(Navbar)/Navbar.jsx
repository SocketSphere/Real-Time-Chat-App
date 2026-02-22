import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice.js";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, Monitor, Menu, X, Search } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const moreRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const { user, isLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-toggle')) {
        setMobileMenuOpen(false);
      }
      // Close mobile search if clicking outside
      if (mobileSearchOpen && !event.target.closest('.mobile-search-container') && !event.target.closest('.mobile-search-toggle')) {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileSearchOpen]);

  // Focus search input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [mobileSearchOpen]);

  // Scroll handler for pricing
  const handleScrollToPricing = () => {
    if (location.pathname === "/") {
      const section = document.getElementById("pricing");
      section?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollToPricing: true } });
    }
    setMobileMenuOpen(false);
  };

  // Close mobile menu on navigation
  const handleNavigation = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  // Theme toggle functions
  const setLightTheme = () => {
    localStorage.setItem('vite-ui-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  };

  const setDarkTheme = () => {
    localStorage.setItem('vite-ui-theme', 'dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  };

  const setSystemTheme = () => {
    localStorage.setItem('vite-ui-theme', 'system');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(systemTheme);
    document.documentElement.setAttribute('data-theme', systemTheme);
  };

  // Mobile search toggle
  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    setMobileMenuOpen(false); // Close menu if open
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implement your search logic here
      setSearchQuery("");
      setMobileSearchOpen(false);
    }
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", action: () => handleNavigation() },
    { name: "About Us", path: "/about-us", action: () => handleNavigation() },
    { name: "Blog", path: "/blog", action: () => handleNavigation() },
    // { name: "Chat", path: "/chat", action: () => handleNavigation() },
    { name: "Pricing", path: null, action: () => handleScrollToPricing() },
  ];

  const moreItems = [
    { name: "With Freinds", path: "/chat", action: () => handleNavigation() },
    { name: "With AI", path: "/ai", action:()=>handleNavigation() },
  ];

  return (
    <nav className="navbar bg-white dark:bg-gray-900 shadow-md px-4 sticky top-0 z-50 md:px-8 border-b dark:border-gray-700">
      {/* Branding */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-2xl font-extrabold tracking-tight flex items-center"
          onClick={handleNavigation}
        >
          <span className="text-blue-600 dark:text-blue-400">Chat</span>
          <span className="text-red-400 dark:text-red-300 -ml-1">Master</span>
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex navbar-center">
        <ul className="menu menu-horizontal px-1 gap-2 text-gray-700 dark:text-gray-300 font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.path ? (
                <Link to={item.path} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {item.name}
                </Link>
              ) : (
                <button
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={item.action}
                >
                  {item.name}
                </button>
              )}
            </li>
          ))}

          <li ref={moreRef} className="relative">
            <button
              className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              Chat
            </button>

            {moreOpen && (
              <ul className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 shadow rounded-md w-40 z-50 border dark:border-gray-700">
                {moreItems.map((item) => (
                  <li key={item.name}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md block p-2"
                        onClick={() => {
                          item.action();
                          setMoreOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md block p-2 w-full text-left"
                        onClick={() => {
                          item.action();
                          setMoreOpen(false);
                        }}
                      >
                        {item.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Desktop Search */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Find Your Friend or Group..."
            className="input bg-gray-200 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 h-13 input-bordered rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 dark:border-gray-600"
          />
        </div>

        {/* Dark Mode Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={setLightTheme} className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={setDarkTheme} className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={setSystemTheme} className="cursor-pointer">
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Link to="/notifications" className="btn btn-ghost btn-circle relative" onClick={handleNavigation}>
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
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
        </Link>

        {/* Profile or Signup */}
        {isLogin ? (
          <div className="dropdown dropdown-end">
            <div tabIndex="0" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full border-2 border-blue-400 dark:border-blue-500">
                <img
                  src={user?.profileImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                  alt="User Avatar"
                />
              </div>
            </div>
            <ul
              tabIndex="0"
              className="menu dropdown-content bg-gray-300 dark:bg-gray-800 rounded-lg shadow-lg mt-3 w-52 p-2 border dark:border-gray-700"
            >
              <li>
                <Link to="/Profile" className="justify-between hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md dark:text-gray-300" onClick={handleNavigation}>
                  Profile <span className="badge badge-primary">New</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="justify-between hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md dark:text-gray-300" onClick={handleNavigation}>
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-red-500 dark:text-red-400"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="hidden md:block">
            <button className="m-3 p-1 rounded-md btn-ghost hover:bg-slate-100 dark:hover:bg-gray-700">
              <Link to="/signup" className="dark:text-gray-300" onClick={handleNavigation}>Sign up</Link>
            </button>
          </div>
        )}

        {/* Mobile Search Button */}
        <button
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mobile-search-toggle"
          onClick={toggleMobileSearch}
          aria-label="Toggle search"
        >
          <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Mobile Hamburger Menu Button - MOVED TO END */}
        <button
          className="lg:hidden mobile-menu-toggle p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            setMobileSearchOpen(false); // Close search if open
          }}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Search Bar (Appears below navbar when toggled) */}
      {mobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-lg mobile-search-container">
          <form onSubmit={handleSearch} className="p-3">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find Your Friend or Group..."
                className="w-full px-4 py-3 pl-10 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                aria-label="Close search"
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b dark:border-gray-700">
          {/* <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold">
              <span className="text-blue-600 dark:text-blue-400">Chat</span>
              <span className="text-red-400 dark:text-red-300">Master</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div> */}

          {/* Mobile Search in Menu */}
          {/* <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 rounded-lg border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(true);
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div> */}
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-120px)]">
          {/* Navigation Links */}
          <ul className="space-y-2 mb-6">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {item.name}
                  </button>
                )}
              </li>
            ))}

            {/* More Items in Mobile */}
            {moreItems.map((item) => (
              <li key={item.name}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {item.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
            <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 rounded-lg border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(true);
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          {/* Theme Selector for Mobile */}
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</h3>
            <div className="flex-col  gap-2">
              <button
                onClick={() => {
                  setLightTheme();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <Sun className="h-4 w-4" />
                <span className="text-sm">Light</span>
              </button>
              <button
                onClick={() => {
                  setDarkTheme();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <Moon className="h-4 w-4" />
                <span className="text-sm">Dark</span>
              </button>
              <button
                onClick={() => {
                  setSystemTheme();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                <span className="text-sm">System</span>
              </button>
            </div>
          </div>

          {/* User Section */}
          {isLogin ? (
            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex items-center gap-3 mb-4 p-3">
                <div className="w-10 h-10 rounded-full border-2 border-blue-400 dark:border-blue-500 overflow-hidden">
                  <img
                    src={user?.profileImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium dark:text-gray-100">{user?.firstName || "User"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View Profile</p>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  onClick={handleNavigation}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  onClick={handleNavigation}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 dark:text-red-400"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t dark:border-gray-700 pt-4">
              <Link
                to="/login"
                className="block w-full text-center p-3 mb-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleNavigation}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center p-3 rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                onClick={handleNavigation}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;