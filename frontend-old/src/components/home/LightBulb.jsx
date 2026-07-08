const LightBulb = ({ text, fullText, isHovered }) => {
  const getFontSize = (text) => {
    if (isHovered) {
      if (text.length > 25) return 'text-xs';
      if (text.length > 15) return 'text-sm';
      if (text.length > 10) return 'text-base';
    }
    return 'text-xl';
  };

  const displayText = isHovered ? fullText : text;
  const renderedText = !isHovered
    ? text.split(' ').map((word, i) => <div key={i}>{word}</div>)
    : displayText;

  return (
    <div className="relative w-48 h-64">
      <svg width="192" height="256" viewBox="0 0 192 256" className="absolute inset-0">
        <defs>
          <filter
            id={`glow-${isHovered ? 'bright' : 'normal'}`}
            x="-200%"
            y="-200%"
            width="400%"
            height="400%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={isHovered ? '10' : '5'}
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x="68"
          y="152"
          width="56"
          height="30"
          fill={`${isHovered ? '#FFD300' : '#FFDD82'}`}
          rx="5"
          filter={`url(#glow-${isHovered ? 'bright' : 'normal'})`}
        />
        <circle
          cx="96"
          cy="96"
          r="80"
          fill={`${isHovered ? '#FFD300' : '#FFDD82'}`}
          filter={`url(#glow-${isHovered ? 'bright' : 'normal'})`}
          className="transition-all duration-300"
        />
        <rect x="76" y="198" width="40" height="22" fill="#B2EBF2" rx="40" />
        <rect x="68" y="190" width="56" height="8" fill="#E0F7FA" rx="5" />
        <rect x="68" y="197" width="56" height="8" fill="#E0F7FA" rx="5" />
        <rect x="68" y="204" width="56" height="8" fill="#E0F7FA" rx="5" />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ top: '20px', height: '152px' }}
      >
        <div className="w-34 text-center px-3">
          <span
            className={`font-bold text-black leading-tight break-words transition-all duration-300 ${getFontSize(displayText)}`}
            style={{ fontFamily: 'Montserrat' }}
          >
            {renderedText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LightBulb;
