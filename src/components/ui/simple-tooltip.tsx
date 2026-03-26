import React, { useState } from 'react';

interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function SimpleTooltip({ content, children }: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-default"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg shadow-xl z-[9999] whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-100 border border-white/20">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900/95"></div>
        </div>
      )}
    </div>
  );
}