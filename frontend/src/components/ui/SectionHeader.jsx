import React from 'react';
import clsx from 'clsx'; // optional: helps merge Tailwind classes cleanly

const SectionHeader = ({ children, className = '', style = {} }) => {
  return (
    <h2
      className={clsx(
        'font-extrabold text-[80px] leading-[160px] tracking-[0.04em] font-montserrat text-white',
        className
      )}
      style={{ fontVariant: 'small-caps', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', ...style }}
    >
      {children}
    </h2>
  );
};

export default SectionHeader;
