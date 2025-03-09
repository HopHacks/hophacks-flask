import React, { useEffect, useRef, useState } from 'react';

function nameToURL(name) {
  return `https://hophacks-recap.s3.us-east-1.amazonaws.com${name}`;
}

function ImagesFromPastYears() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Sample images for the carousel, each with a unique description
  const images = [
    {
      src: nameToURL('/Project2024_1.JPG'),
      description: 'One of our winners stepping up for the prize.'
    },
    {
      src: nameToURL('/Project2024_2.JPG'),
      description: 'Participants conversing with representatives from MLH.'
    },
    {
      src: nameToURL('/Project2024_3.JPG'),
      description: 'Participants conversing with representatives from MLH.'
    },
    {
      src: nameToURL('/Project2024_4.JPG'),
      description: 'Close-up on some of the awesome giveaways.'
    },
    {
      src: nameToURL('/Project2024_5.JPG'),
      description: 'Participants go on an adventure together.'
    },
    {
      src: nameToURL('/Project2024_6.JPG'),
      description: 'Participants listening intently to one of the many workshops held at Hophacks.'
    },
    {
      src: nameToURL('/Project2024_7.JPG'),
      description: 'Participants giving the judges demos of their work.'
    },
    {
      src: nameToURL('/Project2024_8.JPG'),
      description: 'Everyone gather to listen to presentations from the sponsors.'
    },
    {
      src: nameToURL('/Project2024_9.JPG'),
      description: 'Participants giving the judges demos of their work.'
    }
  ];

  const carouselRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const isPaused = useRef(false); // Track pause state
  const resumeTimeoutRef = useRef(null); // Track resume timeout

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollStep = 1;
    const scrollInterval = 30;

    const startAutoScroll = () => {
      autoScrollIntervalRef.current = setInterval(() => {
        if (isPaused.current) return; // Pause when flag is set

        carousel.scrollLeft += scrollStep;
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }, scrollInterval);
    };

    // Clone images for infinite scroll
    const cloneImages = () => {
      const clonedImages = carousel.cloneNode(true);
      carousel.appendChild(clonedImages);
    };

    // Event handlers
    const handleMouseEnter = () => {
      isPaused.current = true;
    };
    const handleMouseLeave = () => {
      isPaused.current = false;
    };

    const handleInteraction = () => {
      isPaused.current = true;
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isPaused.current = false;
      }, 3000);
    };

    cloneImages();
    startAutoScroll();
    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    carousel.addEventListener('wheel', handleInteraction);
    carousel.addEventListener('touchstart', handleInteraction);
    carousel.addEventListener('mousedown', handleInteraction);

    return () => {
      clearInterval(autoScrollIntervalRef.current);
      clearTimeout(resumeTimeoutRef.current);
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
      carousel.removeEventListener('wheel', handleInteraction);
      carousel.removeEventListener('touchstart', handleInteraction);
      carousel.removeEventListener('mousedown', handleInteraction);
    };
  }, []);

  // Helper function to render the image container with hover effect
  function renderImage(image, index, offset = 0) {
    const imageIndex = index + offset;
    const isHovered = hoveredIndex === imageIndex;

    return (
      <div
        key={imageIndex}
        style={styles.imageContainer}
        onMouseEnter={() => setHoveredIndex(imageIndex)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <img
          src={image.src}
          alt={`Memory ${imageIndex + 1}`}
          style={{
            ...styles.image,
            // Dimming effect on hover
            filter: isHovered ? 'brightness(50%)' : 'brightness(100%)'
          }}
          draggable={false}
        />
        {/* Show description overlay only if hovered */}
        {isHovered && (
          <div style={styles.overlay}>
            <span>{image.description}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.backgroundContainer}>
      <h2 style={styles.header}>Our Favorite Memories from 2024</h2>
      <div ref={carouselRef} style={styles.carousel} tabIndex={0}>
        {/* Original images */}
        {images.map((image, index) => renderImage(image, index))}

        {/* Duplicate images for seamless scrolling */}
        {images.map((image, index) => renderImage(image, index, images.length))}
      </div>
    </div>
  );
}

// Styles for the component
const styles = {
  backgroundContainer: {
    backgroundColor: '#2C529A',
    borderRadius: '16px',
    padding: '10px',
    maxWidth: '90%',
    margin: 'auto',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  container: {
    marginTop: '40px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center'
  },
  header: {
    color: '#ffffff',
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center'
  },
  carousel: {
    display: 'flex',
    overflowX: 'scroll', // Allow scrollbar but hide it visually
    gap: '16px',
    padding: '10px',
    scrollBehavior: 'smooth',
    cursor: 'grab', // Indicate draggable area
    scrollbarWidth: 'none'
  },
  imageContainer: {
    position: 'relative', // Needed for absolutely positioned overlay
    flex: '0 0 auto',
    width: '400px',
    height: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'filter 0.3s ease'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '18px',
    backgroundColor: 'rgba(0,0,0,0.5)'
    // You can also add a transition for fade in/out if desired
  }
};

// Additional CSS for hiding the scrollbar
const globalStyles = document.createElement('style');
globalStyles.innerHTML = `
    ::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, and Edge */
    }
`;
document.head.appendChild(globalStyles);

export default ImagesFromPastYears;
