import React, { useState } from 'react';

export const LAFACTORIA_LOGO_URL = 'https://i.postimg.cc/ZnDVJsN1/Chat-GPT-Image-28-jul-2026-09-21-23-p-m.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  imageOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  const heightClasses = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-16 md:h-20',
    lg: 'h-20 sm:h-24 md:h-28',
    xl: 'h-28 sm:h-36 md:h-40',
    '2xl': 'h-40 sm:h-48 md:h-56',
  };

  if (imageError) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <span className="font-display font-black text-2xl text-white tracking-tight">
          La factor<span className="text-cyan-400">IA</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center group select-none ${className}`}>
      <img
        src={LAFACTORIA_LOGO_URL}
        alt="La factorIA"
        referrerPolicy="no-referrer"
        className={`${heightClasses[size]} w-auto object-contain max-w-[280px] sm:max-w-[340px] md:max-w-[400px] transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]`}
        onError={() => setImageError(true)}
      />
    </div>
  );
};
