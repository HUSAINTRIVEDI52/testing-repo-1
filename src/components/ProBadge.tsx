import React from 'react';

interface ProBadgeProps {
  style?: React.CSSProperties;
}

const ProBadge: React.FC<ProBadgeProps> = ({ style }) => {
  return (
    <svg
      width="60"
      height="24"
      viewBox="0 0 60 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      {/* Orange pill background */}
      <rect width="60" height="24" rx="12" fill="#FF7C02" />
      
      {/* Crown icon - matching Figma */}
      <g transform="translate(18, 7)">
        {/* Crown base */}
        <rect x="0" y="8" width="14" height="2" fill="white" rx="0.5" />
        {/* Crown points */}
        <path 
          d="M2 8 L2 2 L4 4 L7 0 L10 4 L12 2 L12 8 Z" 
          fill="white"
        />
      </g>
    </svg>
  );
};

export default ProBadge;
