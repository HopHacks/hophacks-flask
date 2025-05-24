import { useState, useEffect } from 'react';

const Sparkles = () => {
    // State to store multiple sparkles
    const [sparkles, setSparkles] = useState([]);

    // Function to generate random number within range
    const random = (min, max) => Math.random() * (max - min) + min;

    // Function to create a new sparkle with random properties
    const createSparkle = () => {
        return {
            id: Math.random().toString(36).substring(2, 9),
            left: `${random(20, 80)}%`,
            top: `${random(10, 90)}%`,
            size: random(5, 15),
            opacity: random(0.4, 0.8),
            delay: random(0, 2)
        };
    };

    // Generate initial sparkles and add new ones periodically
    useEffect(() => {
        // Create initial sparkles
        const initialSparkles = Array.from({ length: 15 }, createSparkle);
        setSparkles(initialSparkles);

        // Add new sparkles every 600ms
        const interval = setInterval(() => {
            setSparkles(prevSparkles => {
                // Remove oldest sparkle if we have too many
                const filtered = prevSparkles.length >= 25
                    ? prevSparkles.slice(1)
                    : prevSparkles;

                // Add a new sparkle
                return [...filtered, createSparkle()];
            });
        }, 600);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="absolute left-[260px] top-[180px] w-[300px] h-[550px] overflow-hidden pointer-events-none z-10"
            style={{
                // Polygon shape for light ray - adjust points as needed
                clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
            }}
        >
            {/* Sparkles container */}
            <div className="absolute inset-0 overflow-hidden">
                {sparkles.map(sparkle => (
                    <div
                        key={sparkle.id}
                        className="absolute rounded-full bg-white animate-sparkle"
                        style={{
                            left: sparkle.left,
                            top: sparkle.top,
                            width: `${sparkle.size}px`,
                            height: `${sparkle.size}px`,
                            opacity: sparkle.opacity,
                            animationDelay: `${sparkle.delay}s`,
                            boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// The keyframes can be added to your global CSS file
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes sparkle {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(180deg);
      opacity: 0;
    }
  }
  .animate-sparkle {
    animation: sparkle 2s linear forwards;
  }
`;
document.head.appendChild(styleTag);

export default Sparkles;