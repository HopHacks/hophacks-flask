import React from 'react';
import PropTypes from 'prop-types';

const GlowButton = ({
  onClick,
  children,
  className = '',
  style = {},
  variant = 'primary',
  disabled = false
}) => {
  const isPrimary = variant === 'primary';

  const baseClasses = `px-5 py-4 text-2xl font-bold rounded-2xl cursor-pointer 
    transition-shadow duration-300 max-w-[200px] min-w-[150px] w-[30%] mt-5 mb-10`;

  const primaryClasses = `bg-recap-gold text-white 
    shadow-[0_0_40px_rgba(255,255,148,0.3)] 
    hover:shadow-[0_0_50px_rgba(255,255,148,0.5)]`;

  const secondaryClasses = `bg-[#29A0E2] text-white 
    shadow-[0_0_40px_rgba(41,160,226,0.3)] 
    hover:shadow-[0_0_50px_rgba(41,160,226,0.5)]`;

  const combinedClassName = `${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses} ${className}`;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={combinedClassName}
      style={{ fontVariant: 'small-caps', ...style }}
    >
      {children}
    </button>
  );
};

GlowButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  variant: PropTypes.oneOf(['primary', 'secondary'])
};

export default GlowButton;
