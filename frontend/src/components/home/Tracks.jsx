import Lightbulb from './LightBulb';

const SectionHeader = ({ children, className }) => (
  <h2 className={`text-4xl font-bold mb-8 ${className}`} style={{ fontFamily: 'Montserrat' }}>
    {children}
  </h2>
);

const Tracks = () => {
  return (
    <div className="w-full min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionHeader className="text-center text-white">Tracks</SectionHeader>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center">
          <Lightbulb text="Best Use of AI+AR for Maternal Wellness" />
          <Lightbulb text="Best Use of SpacetimeDB" />
          <Lightbulb text="Best Healthcare Hack" />
          <Lightbulb text="Biosecurity Challenge" />
          <Lightbulb text="Best Application to Support Philanthropic Goals" />
          <Lightbulb text="Best Data Visualization" />
        </div>
      </div>
    </div>
  );
};

export default Tracks;
