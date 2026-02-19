import React from 'react';
import clsx from 'clsx';

const SectionSubtext = ({ children, className = '', style = {} }) => {
  return (
    <p
      className={clsx(
        'font-semibold text-[30px] leading-[60px] tracking-[0.05em] font-montserrat text-white',
        className
      )}
      style={{ fontVariant: 'small-caps', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', ...style }}
    >
      {children}
    </p>
  );
};

export default SectionSubtext;
