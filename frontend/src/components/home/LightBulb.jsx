const Lightbulb = ({ text }) => {
  const getFontSize = (text) => {
    if (text.length > 25) return 'text-xs';
    if (text.length > 15) return 'text-sm';
    if (text.length > 10) return 'text-base';
    return 'text-lg';
  };

  return (
    <div className="relative w-48 h-64">
      <svg width="192" height="256" viewBox="0 0 192 256" className="absolute inset-0">
        <defs>
          <filter id="glow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="96" cy="96" r="80" fill="#FFDD82" filter="url(#glow)" />

        <rect x="68" y="190" width="56" height="8" fill="white" rx="5" />
        <rect x="68" y="198" width="56" height="8" fill="white" rx="5" />
        <rect x="68" y="206" width="56" height="8" fill="white" rx="5" />
        <rect x="76" y="200" width="40" height="22" fill="white" rx="40" />
        <rect x="68" y="152" width="56" height="30" fill="#FFDD82" rx="5" filter="url(#glow)" />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ top: '20px', height: '152px' }}
      >
        <div className="w-32 text-center px-3">
          <span
            className={`font-bold text-black leading-tight break-words ${getFontSize(text)}`}
            style={{ fontFamily: 'Montserrat' }}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Lightbulb;
