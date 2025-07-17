import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import EastIcon from '@mui/icons-material/ArrowForward';

import './AlumniCard.css';

export const AlumniCard = ({ name, position, image, github, linkedin, year }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card">
      <div ref={cardRef} className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="card-front">
          <div className="card-image-container">
            <img
              src={image === 'default' ? '/images/hophacks-grayscale.png' : image}
              alt="card-image"
              className="card-image"
            />
          </div>
          <div className="card-nameplate">
            <div className="card-header">
              <h2 className="card-name">{name}</h2>
              <div className="card-icons">
                {linkedin && (
                  <a
                    className="linkedin-icon"
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="linkden-icon-img"
                      src="https://hophacks-organizers.s3.us-east-1.amazonaws.com/linkedin.png"
                      width="20"
                      height="20"
                    />
                  </a>
                )}
                {github && (
                  <a
                    className="github-icon"
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="linkden-icon-img"
                      src="https://hophacks-organizers.s3.us-east-1.amazonaws.com/github.png"
                      width="20"
                      height="20"
                    />
                  </a>
                )}
              </div>
            </div>
            <div className="card-footer">
              <p className="team-text">
                {position
                  ? year !== 0
                    ? `${position}, ${year}`
                    : position
                  : year !== 0
                    ? year
                    : ''}
              </p>
              <button
                className="flip-button"
                onClick={handleCardFlip}
                onTouchStart={handleCardFlip}
              >
                <EastIcon className="east-icon" />
              </button>
            </div>
          </div>
        </div>
        <div className="alumni-card-back">
          <button
            className="flip-button-back"
            onClick={handleCardFlip}
            onTouchStart={handleCardFlip}
          >
            <EastIcon className="east-icon-back" />
          </button>
        </div>
      </div>
    </div>
  );
};

AlumniCard.propTypes = {
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  linkedin: PropTypes.string.isRequired
};
