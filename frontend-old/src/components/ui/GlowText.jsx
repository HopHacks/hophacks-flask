import PropTypes from 'prop-types';

const GlowText = ({ children, className = '', style = {}, variant = 'primary' }) => {
  const baseClasses = `font-[Montserrat] text-4xl font-extrabold tracking-wide 
    transition-shadow duration-300 text-center`;

  const primaryClasses = `text-white text-shadow-[0_0_20px_rgba(255,255,255,0.5)]`;
  const secondaryClasses = `text-[#29A0E2] shadow-[0_0_20px_rgba(41,160,226,0.6)]`;
  const goldClasses = `text-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.5)]`;

  const variantClasses = {
    primary: primaryClasses,
    secondary: secondaryClasses,
    gold: goldClasses
  };

  const combinedClassName = `${baseClasses} ${variantClasses[variant] || ''} ${className}`;

  return (
    <span className={combinedClassName} style={{ fontVariant: 'small-caps', ...style }}>
      {children}
    </span>
  );
};

GlowText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  variant: PropTypes.oneOf(['primary', 'secondary', 'gold'])
};

export default GlowText;
