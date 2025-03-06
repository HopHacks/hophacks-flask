import { useState, useEffect } from 'react';
import '../../stylesheets/navigation.css';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('cover');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      const sections = ['cover', 'about', 'prizes', 'tracks', 'faq'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">HopHacks</div>
        <div className="nav-links">
          {['cover', 'about', 'prizes', 'faq'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`nav-link ${activeSection === section ? 'active' : ''}`}
            >
              {section === 'cover' ? 'HOME' : section.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
