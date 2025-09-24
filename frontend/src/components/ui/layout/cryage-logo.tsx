import React from 'react';

interface CryageLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export const CryageLogo: React.FC<CryageLogoProps> = ({ 
  size = 24, 
  className = "",
  animated = true
}) => {
  const uniqueId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={`${className} ${animated ? 'animate-logo' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
      }}
    >
      <defs>
        {/* Animated lighter emerald gradient for the main 'C' shape */}
        <linearGradient id={`cGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981">
            {animated && (
              <animate attributeName="stop-color" 
                values="#10b981;#34d399;#6ee7b7;#10b981" 
                dur="3s" 
                repeatCount="indefinite" />
            )}
          </stop>
          <stop offset="100%" stopColor="#047857">
            {animated && (
              <animate attributeName="stop-color" 
                values="#047857;#10b981;#059669;#047857" 
                dur="3s" 
                repeatCount="indefinite" />
            )}
          </stop>
        </linearGradient>
        
        {/* Enhanced dark background gradient */}
        <linearGradient id={`bgGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="1"/> 
          <stop offset="50%" stopColor="#1e293b" stopOpacity="1"/>
          <stop offset="100%" stopColor="#0f172a" stopOpacity="1"/>
        </linearGradient>
        
        {/* Animated chart gradient in bright emerald for visibility */}
        <linearGradient id={`chartGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399">
            {animated && (
              <animate attributeName="stop-color" 
                values="#34d399;#6ee7b7;#a7f3d0;#34d399" 
                dur="2s" 
                repeatCount="indefinite" />
            )}
          </stop>
          <stop offset="50%" stopColor="#6ee7b7">
            {animated && (
              <animate attributeName="stop-color" 
                values="#6ee7b7;#a7f3d0;#d1fae5;#6ee7b7" 
                dur="2s" 
                repeatCount="indefinite" />
            )}
          </stop>
          <stop offset="100%" stopColor="#a7f3d0">
            {animated && (
              <animate attributeName="stop-color" 
                values="#a7f3d0;#d1fae5;#ecfdf5;#a7f3d0" 
                dur="2s" 
                repeatCount="indefinite" />
            )}
          </stop>
        </linearGradient>
        
        {/* Enhanced glow filter */}
        <filter id={`glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Pulsing glow filter for animation */}
        <filter id={`pulseGlow-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
          {animated && (
            <feGaussianBlur stdDeviation="1">
              <animate attributeName="stdDeviation" 
                values="1;2;1" 
                dur="2s" 
                repeatCount="indefinite" />
            </feGaussianBlur>
          )}
        </filter>
      </defs>

      {/* Background with subtle gradient */}
      <rect width="32" height="32" rx="8" ry="8" fill={`url(#bgGradient-${uniqueId})`}/>
      
      {/* Main 'C' shape with dark emerald colors */}
      <path d="M 22 12.5
               C 22 9.5, 19.5 7.5, 16 7.5
               C 12.5 7.5, 10 9.5, 10 12.5
               L 10 19.5
               C 10 22.5, 12.5 24.5, 16 24.5
               C 19.5 24.5, 22 22.5, 22 19.5" 
            fill="none" 
            stroke={`url(#cGradient-${uniqueId})`} 
            strokeWidth="2.8" 
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${uniqueId})`}>
        {animated && (
          <animateTransform 
            attributeName="transform" 
            type="scale" 
            values="1;1.05;1" 
            dur="3s" 
            repeatCount="indefinite" />
        )}
      </path>

      {/* Chart line with bright emerald and enhanced animation */}
      <polyline points="13,18 17,17 20,14 24,10 27,7" 
              fill="none"
              stroke={`url(#chartGradient-${uniqueId})`} 
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#pulseGlow-${uniqueId})`}>
        {animated && (
          <animate attributeName="stroke-dasharray" 
            values="0,20;20,0;0,20" 
            dur="3s" 
            repeatCount="indefinite" />
        )}
      </polyline>
              
      {/* Arrow head with bright emerald */}
      <polyline points="27,7 25,7 27,7 27,9" 
              fill="none"
              stroke="#6ee7b7" 
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-${uniqueId})`}>
        {animated && (
          <animate attributeName="opacity" 
            values="0.8;1;0.8" 
            dur="2s" 
            repeatCount="indefinite" />
        )}
      </polyline>
    </svg>
  );
};
 
export default CryageLogo;
