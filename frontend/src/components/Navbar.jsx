import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-white shadow-md px-4 sticky top-0 z-50 md:px-8">
      {/* Branding */}
      <div className="flex-1">
        <Link to="/"
          className="btn btn-ghost normal-case text-2xl sm:text-2xl font-extrabold tracking-tight flex items-center"
        >
          <span className="text-blue-600">Chat</span>
          <span className="text-red-400 -ml-1">Master</span>
        </Link>
      </div>
      {/* Left Section */}
      <div className="flex-none lg:hidden">
        <Link className="btn btn-ghost normal-case text-xl font-bold">Menu</Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex navbar-center">
        <ul className="menu menu-horizontal px-1 gap-2 text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to="/chat" className="hover:text-blue-600">Chats</Link></li>
          <li><Link to="/contact" className="hover:text-blue-600">Contacts</Link></li>
          <li><Link to="/group" className="hover:text-blue-600">Groups</Link></li>
          <li>
            <details className="group">
              <summary className="cursor-pointer hover:text-blue-600">More</summary>
              <ul className="p-2 bg-white shadow rounded-md mt-1">
                <li><Link className="hover:bg-gray-100 rounded-md">Archived</Link></li>
                <li><Link className="hover:bg-gray-100 rounded-md">Settings</Link></li>
              </ul>
            </details>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 
                6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 
                6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 
                11-6 0v-1m6 0H9" />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>

        {/* Profile Dropdown */}
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
              <Link className="justify-between hover:bg-gray-100 rounded-md">
                Profile
                <span className="badge badge-primary">New</span>
              </Link>
            </li>
            <li><Link className="hover:bg-gray-100 rounded-md">Settings</Link></li>
            <li><Link className="hover:bg-gray-100 rounded-md">Logout</Link></li>
          </ul>
        </div>


        <label className="swap swap-rotate text-sm">
          <input type="checkbox" className="theme-controller" value="synthwave" />

          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>


        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden">
          <label htmlFor="mobile-menu" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
