// DEBUG: set to true to show black borders between sections
const DEBUG_SECTIONS = true;

interface SectionProps {
  id: string;
  children: React.ReactNode;
}

export default function Section({ id, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full min-h-screen bg-bg ${DEBUG_SECTIONS ? "border border-black" : ""}`}
    >
      {children}
    </section>
  );
}
