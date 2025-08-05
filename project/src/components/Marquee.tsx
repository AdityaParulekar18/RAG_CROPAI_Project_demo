import React, { useState } from 'react';

const Marquee = () => {
  const [isPaused, setIsPaused] = useState(false);

  const toggleMarquee = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-2 shadow-lg">
      <div className="relative overflow-hidden">
        <div 
          className={`whitespace-nowrap ${isPaused ? '' : 'animate-marquee'} cursor-pointer hover:bg-black/10 transition-colors`}
          onClick={toggleMarquee}
          style={{
            animation: isPaused ? 'none' : 'marquee 20s linear infinite'
          }}
        >
          <span className="inline-block px-4 py-1 text-sm font-medium">
            ⚠️ DISCLAIMER: This website is made for final year project and for personal work, not associated with any official organization.
          </span>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Marquee;