import React from 'react';
import { CryageLogo } from './cryage-logo';

interface BrandProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showSubtext?: boolean;
  className?: string;
  variant?: 'default' | 'header' | 'sidebar';
}

export const Brand: React.FC<BrandProps> = ({ 
  size = 'md',
  showText = true,
  showSubtext = true,
  className = '',
  variant = 'default'
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          logoSize: 24,
          titleClass: 'text-base',
          subtextClass: 'text-xs',
          gap: 'gap-2'
        };
      case 'lg':
        return {
          logoSize: 40,
          titleClass: 'text-xl',
          subtextClass: 'text-sm',
          gap: 'gap-4'
        };
      default: // md
        return {
          logoSize: 32,
          titleClass: 'text-lg',
          subtextClass: 'text-xs',
          gap: 'gap-3'
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'header':
        return {
          container: 'flex items-center',
          title: 'font-bold bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-700 bg-clip-text text-transparent',
          subtext: 'text-muted-foreground font-medium tracking-wide'
        };
      case 'sidebar':
        return {
          container: 'flex items-center w-full',
          title: 'font-bold bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-700 bg-clip-text text-transparent animate-pulse',
          subtext: 'text-muted-foreground font-medium tracking-wide'
        };
      default:
        return {
          container: 'flex items-center',
          title: 'font-bold bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-700 bg-clip-text text-transparent',
          subtext: 'text-muted-foreground font-medium tracking-wide'
        };
    }
  };

  const sizeConfig = getSizeConfig();
  const variantStyles = getVariantStyles();

  return (
    <div className={`${variantStyles.container} ${sizeConfig.gap} ${className}`}>
      <div className="flex aspect-square items-center justify-center flex-shrink-0">
        <CryageLogo size={sizeConfig.logoSize} />
      </div>
      {showText && (
        <div className="flex flex-col min-w-0">
          <span className={`${variantStyles.title} ${sizeConfig.titleClass}`}>
            Cryage
          </span>
          {showSubtext && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className={`${variantStyles.subtext} ${sizeConfig.subtextClass}`}>
                AI Crypto Agent
              </span>
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse animation-delay-500"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Brand;