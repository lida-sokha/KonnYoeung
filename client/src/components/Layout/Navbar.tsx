import { NavLink, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import React, { useState, useRef, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState('EN'); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const activeLink = "text-[#33A6DC] md:text-black md:border-b-2 md:border-black pb-1 transition-all font-bold";
  const normalLink = "text-gray-700 hover:text-[#33A6DC] transition-all pb-1 md:border-b-2 border-transparent";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
        
        {/* LOGO */}
        <Link to="/" onClick={closeMenu}>
          <div className="flex items-center gap-2">
            <img 
              src="/images/logo.png" 
              alt="KonnYoeung Logo" 
              className="h-8 md:h-10 w-auto" 
            />
            <span className="text-lg md:text-xl font-bold text-[#33A6DC]">KonnYoeung</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium ml-auto mr-8">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeLink : normalLink)} end>Home</NavLink>
          <HashLink smooth to="/#features-section" className={normalLink}>Feature</HashLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? activeLink : normalLink)}>About Us</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? activeLink : normalLink)}>Contact Us</NavLink>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`border border-gray-300 px-3 md:px-4 py-1 flex items-center gap-1 md:gap-2 cursor-pointer rounded-full transition-all duration-200 hover:border-[#33A6DC] ${isLangOpen ? 'border-[#33A6DC] bg-blue-50/50' : ''}`}
            >
              <span className="text-xs md:text-sm font-bold text-gray-700">{language}</span>
              <svg className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] overflow-hidden">
                <div onClick={() => { setLanguage('EN'); setIsLangOpen(false); closeMenu(); }} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm">English</div>
                <div onClick={() => { setLanguage('KH'); setIsLangOpen(false); closeMenu(); }} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm">ភាសាខ្មែរ</div>
              </div>
            )}
          </div>
          
          <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#33A6DC] focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col px-6 py-4 gap-4 font-medium">
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? activeLink : normalLink)} end>Home</NavLink>
          <HashLink smooth to="/#features-section" onClick={closeMenu} className={normalLink}>Feature</HashLink>
          <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => (isActive ? activeLink : normalLink)}>About Us</NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => (isActive ? activeLink : normalLink)}>Contact Us</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;