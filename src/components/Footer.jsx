import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <Logo showText={true} />
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ExpiryGuard. All rights reserved. Keep track, stay fresh.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
