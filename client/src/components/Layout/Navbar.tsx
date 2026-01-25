import { NavLink, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import React, { useState, useRef, useEffect } from 'react';

const Navbar: React.FC = () => {
  // Common active style class
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState('EN'); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeLink = "text-black border-b-2 border-black pb-1 transition-all";
  const normalLink = "text-gray-700 hover:text-[#33A6DC] transition-all pb-1 border-b-2 border-transparent";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white sticky top-0 z-50 shadow-sm">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img 
            src="/images/logo.png" 
            alt="KonnYoeung Logo" 
            className="h-10 w-auto" 
          />
          <span className="text-xl font-bold text-[#33A6DC]">KonnYoeung</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8 font-medium ml-auto mr-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
          end 
        >
          Home
        </NavLink>

        <HashLink 
          smooth 
          to="/#features-section" 
          className={normalLink}
        >
          Feature
        </HashLink>

        {/* About Link */}
        <NavLink 
          to="/about" 
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          About Us
        </NavLink>

        {/* Contact Link */}
        <NavLink 
          to="/contact" 
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
        >
          Contact Us
        </NavLink>
      </div>

      {/* Right side: Language & Profile */}
      <div className="flex items-center gap-4">
       <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsLangOpen(!isLangOpen)}
          className={`
            border border-gray-300 px-4 py-1.5 flex items-center gap-2 cursor-pointer rounded-full 
            transition-all duration-200 hover:bg-gray-50 hover:border-[#33A6DC] group
            ${isLangOpen ? 'border-[#33A6DC] bg-blue-50/50' : ''}
          `}
        >
          <span className="text-sm font-bold text-gray-700 group-hover:text-[#33A6DC]">
            {language === 'EN' ? 'English' : 'ភាសាខ្មែរ'}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isLangOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div 
              onClick={() => { setLanguage('EN'); setIsLangOpen(false); }}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group"
            >
              <span className={`text-sm ${language === 'EN' ? 'font-bold text-[#33A6DC]' : 'text-gray-600'}`}>English</span>
              {language === 'EN' && <div className="w-1.5 h-1.5 bg-[#33A6DC] rounded-full" />}
            </div>
            
            <div className="h-[1px] bg-gray-100 mx-2" /> 

            <div 
              onClick={() => { setLanguage('KH'); setIsLangOpen(false); }}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group"
            >
              <span className={`text-sm ${language === 'KH' ? 'font-bold text-[#33A6DC]' : 'text-gray-600'}`}>ភាសាខ្មែរ</span>
              {language === 'KH' && <div className="w-1.5 h-1.5 bg-[#33A6DC] rounded-full" />}
            </div>
          </div>
        )}
      </div>
        
        <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;