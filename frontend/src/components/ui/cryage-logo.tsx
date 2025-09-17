import React from 'react';

interface CryageLogoProps {
  size?: number;
  className?: string;
}

export const CryageLogo: React.FC<CryageLogoProps> = ({ 
  size = 24, 
  className = "" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f7be"/>
          <stop offset="100%" stopColor="#008b6e"/>
        </linearGradient>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10201C" stopOpacity="1"/> 
          <stop offset="100%" stopColor="#05100D" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00c59c"/>
          <stop offset="50%" stopColor="#00e0af"/>
          <stop offset="100%" stopColor="#00ffcc"/>
        </linearGradient>
        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <rect width="32" height="32" rx="8" ry="8" fill="url(#bgGradient)"/>
      
      <path d="M 22 12.5
               C 22 9.5, 19.5 7.5, 16 7.5
               C 12.5 7.5, 10 9.5, 10 12.5
               L 10 19.5
               C 10 22.5, 12.5 24.5, 16 24.5
               C 19.5 24.5, 22 22.5, 22 19.5" 
            fill="none" 
            stroke="url(#cGradient)" 
            strokeWidth="2.8" 
            strokeLinecap="round"
            strokeLinejoin="round"/>

      <polyline points="13,18 17,17 20,14 24,10 27,7" 
              fill="none"
              stroke="url(#chartGradient)" 
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)" />
              
      <polyline points="27,7 25,7 27,7 27,9" 
              fill="none"
              stroke="#00ffcc" 
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round" />
    </svg>
  );
};
 
export default CryageLogo;
