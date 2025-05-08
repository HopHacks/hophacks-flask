const HomeSection = ({ id, children, darkerBg = false, bgOpacity = 0.5 }) => {
  const backgroundStyle = darkerBg ? {
    background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,${bgOpacity}) 30%, rgba(0,0,0,${bgOpacity}) 70%, rgba(0,0,0,0) 100%)`
  } : {};

  return (
    <section
      className="min-h-dvh w-full flex items-center justify-center"
      id={id}
      style={backgroundStyle}
    >
      {children}
    </section>
  );
};

export default HomeSection;
