import React, { useState, useEffect } from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
  autoContrast?: boolean;
  roundedClass?: string; // allow customizing shape
  unstyled?: boolean; // when true, do not apply default inner bg/text styles
};

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  autoContrast = true,
  roundedClass = 'rounded-full',
  unstyled = false,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';
  const [contrastLevel, setContrastLevel] = useState<'high' | 'medium' | 'low'>('medium');

  // Auto-detect theme and background contrast
  useEffect(() => {
    if (!autoContrast) return;

    const detectContrast = () => {
      if (typeof document === "undefined") return;
      
      const root = document.documentElement;
      const isDarkMode = root.classList.contains("dark");

      // Detect background brightness by checking computed styles
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const backgroundColor = computedStyle.backgroundColor;
      
      // Parse RGB values to determine brightness
      const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        if (brightness < 50) {
          setContrastLevel('high'); // Very dark background
        } else if (brightness < 150) {
          setContrastLevel('medium'); // Medium background
        } else {
          setContrastLevel('low'); // Light background
        }
      } else {
        // Fallback to theme detection
        setContrastLevel(isDarkMode ? 'high' : 'low');
      }
    };

    detectContrast();

    // Watch for theme changes
    const root = document.documentElement;
    const body = document.body;
    const observer = new MutationObserver(detectContrast);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    
    // Watch for background changes
    const bodyObserver = new MutationObserver(detectContrast);
    bodyObserver.observe(body, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      observer.disconnect();
      bodyObserver.disconnect();
    };
  }, [autoContrast]);

  // Dynamic styling based on contrast level
  const getContrastStyles = () => {
    
    switch (contrastLevel) {
      case 'high': // Dark background - need bright, high contrast
        return {
          glowOpacity: '50',
          particleOpacity: '80',
          backgroundOpacity: '50',
          borderOpacity: '30',
          textColor: 'text-white',
          backgroundGradient: 'from-black/60 via-gray-800/70 to-black/60',
          glowIntensity: '40',
          shadowIntensity: '35'
        };
      case 'low': // Light background - need darker, high contrast
        return {
          glowOpacity: '20',
          particleOpacity: '40',
          backgroundOpacity: '30',
          borderOpacity: '40',
          textColor: 'text-gray-900',
          backgroundGradient: 'from-white/90 via-gray-100/95 to-white/90',
          glowIntensity: '25',
          shadowIntensity: '20'
        };
      default: // Medium background - balanced contrast
        return {
          glowOpacity: '30',
          particleOpacity: '60',
          backgroundOpacity: '40',
          borderOpacity: '25',
          textColor: 'text-white',
          backgroundGradient: 'from-black/70 via-gray-800/80 to-black/70',
          glowIntensity: '30',
          shadowIntensity: '25'
        };
    }
  };

  const contrastStyles = getContrastStyles();

  return (
    <Component
      className={`relative inline-block overflow-hidden ${roundedClass} ${className}`}
      {...(rest as React.ComponentPropsWithoutRef<T>)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as React.ComponentPropsWithoutRef<T>).style
      }}
    >
      {/* Glowing background effect */}
      <div
        className="absolute inset-0 rounded-full blur-sm"
        style={{
          background: `linear-gradient(45deg, ${color}${contrastStyles.glowOpacity}, ${color}${contrastStyles.glowIntensity}, ${color}${contrastStyles.glowOpacity})`,
          opacity: parseInt(contrastStyles.backgroundOpacity) / 100,
          animationDuration: speed
        }}
      />
      
      {/* Animated star particles */}
      <div
        className="absolute w-[200%] h-[30%] bottom-[-5px] right-[-150%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 15%)`,
          opacity: parseInt(contrastStyles.particleOpacity) / 100,
          animationDuration: speed
        }}
      />
      <div
        className="absolute w-[200%] h-[30%] top-[-5px] left-[-150%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 15%)`,
          opacity: parseInt(contrastStyles.particleOpacity) / 100,
          animationDuration: speed
        }}
      />
      
      {/* Main button content */}
      <div 
        className={`relative z-10 text-center text-sm font-medium ${roundedClass} transition-all duration-300 ${unstyled ? '' : 'backdrop-blur-sm py-2 px-6 shadow-lg hover:shadow-xl hover:scale-105'} ${unstyled ? '' : contrastStyles.textColor}`}
        style={unstyled ? undefined : {
          background: `linear-gradient(to right, ${contrastLevel === 'low' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)'}, ${contrastLevel === 'low' ? 'rgba(240,240,240,0.95)' : 'rgba(30,30,30,0.7)'}, ${contrastLevel === 'low' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)'})`,
          borderColor: `rgba(255,255,255,${contrastStyles.borderOpacity})`,
          boxShadow: `0 0 25px ${color}${contrastStyles.shadowIntensity}, inset 0 1px 0 ${contrastLevel === 'low' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`
        }}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
//         'star-movement-top': 'star-movement-top linear infinite alternate',
//       },
//       keyframes: {
//         'star-movement-bottom': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
//         },
//         'star-movement-top': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
//         },
//       },
//     },
//   }
// }
