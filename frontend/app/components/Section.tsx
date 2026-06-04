// DEBUG: set to true to show black borders between sections
const DEBUG_SECTIONS = true;

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  borderless?: boolean;
}

export default function Section({
  id,
  children,
  className = "",
  borderless = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full min-h-screen bg-bg ${DEBUG_SECTIONS && !borderless ? "border border-black" : ""} ${className}`}
    >
      {children}
    </section>
  );
}
