import React from 'react';

const Logo = ({ className = "h-9 w-auto", showText = true }) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0984e3] to-[#00b894] shadow-md shadow-[#0984e3]/20">
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth="2"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
          />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e17055] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#e17055]"></span>
        </span>
      </div>
      {showText && (
        <span className="font-bold text-xl tracking-tight text-gray-900">
          Expiry<span className="text-[#0984e3]">Guard</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
