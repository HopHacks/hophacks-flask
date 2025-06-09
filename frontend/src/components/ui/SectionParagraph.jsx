import React from 'react';
import clsx from 'clsx';

const SectionParagraph = ({ children, className = '', style = {} }) => {
  return (
    <p
      className={clsx('font-semibold text-[20px] font-montserrat text-white', className)}
      style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', ...style }}
    >
      {children}
    </p>
  );
};

export default SectionParagraph;
