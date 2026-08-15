import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Navigation Links & Auth CTAs */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0984e3] transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold text-white bg-[#0984e3] hover:bg-[#0077d4] active:bg-[#0066b8] rounded-xl shadow-md shadow-[#0984e3]/25 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
