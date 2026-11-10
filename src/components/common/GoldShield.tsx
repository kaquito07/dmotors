import React from 'react';

interface GoldShieldProps {
  className?: string;
  size?: number;
}

export const GoldShield: React.FC<GoldShieldProps> = ({ className = 'w-7 h-7', size }) => {
  return (
    <svg
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id="dmotorsGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="50%" stopColor="#C9A24A" />
          <stop offset="100%" stopColor="#8A6720" />
        </linearGradient>
        <linearGradient id="dmotorsShieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1C1917" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
      </defs>

      {/* Outer shield border with gold stroke */}
      <path
        d="M50 6 L88 20 C88 64 68 96 50 108 C32 96 12 64 12 20 Z"
        fill="url(#dmotorsShieldBg)"
        stroke="url(#dmotorsGoldGrad)"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Inner thin shield outline */}
      <path
        d="M50 14 L80 25 C80 60 63 88 50 98 C37 88 20 60 20 25 Z"
        fill="none"
        stroke="#C9A24A"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Stylized "D" letter in center */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="url(#dmotorsGoldGrad)"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="44"
        letterSpacing="-1"
      >
        D
      </text>

      {/* Small top star accent */}
      <path
        d="M50 22 L51.5 25 L55 25.5 L52.5 27.5 L53.5 31 L50 29 L46.5 31 L47.5 27.5 L45 25.5 L48.5 25 Z"
        fill="#F5D061"
      />
    </svg>
  );
};
