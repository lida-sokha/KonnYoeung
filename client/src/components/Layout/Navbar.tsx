import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white ">
      <Link to="/">
      <div className="flex items-center gap-2">
        <img 
          src="../public/images/logo.png" 
          alt="KonnYoeung Logo" 
          className="h-10 w-auto" 
        />
        <span className="text-xl font-bold text-[#33A6DC]">KonnYoeung</span>
      </div>
      </Link>

    <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium ml-auto mr-8">
      <Link to="/" className="text-black border-b-2 border-black pb-1">Home</Link>
      <Link to="/features" className="hover:text-blue-500 transition">Feature</Link>
      <Link to="/about" className="hover:text-blue-500 transition">About Us</Link>
      <Link to="/contact" className="hover:text-blue-500 transition">Contact Us</Link>
    </div>

      {/* Right side: Language & Profile */}
      <div className="flex items-center gap-4">
        <div className="border border-gray-300 px-3 py-1 flex items-center gap-1 cursor-pointer hover:bg-gray-50">
          <span>EN/KH</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* User Profile Icon */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Link to="/login">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;