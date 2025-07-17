import { useState } from 'react';
import PropTypes from 'prop-types';
import EastIcon from '@mui/icons-material/ArrowForward';
import './OrganizerCard.css';

export const OrganizerCard = ({
  name,
  position,
  image,
  github,
  linkedin,
  hometown,
  major_year,
  funfact
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="card">
      <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
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
              <p className="team-text">{position}</p>
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
        <div className="card-back">
          <h1 className="card-back-h1">About {name}</h1>
          <div className="card-back-personal">
            <div className="card-back-hometown">
              <h2 className="card-back-h2">Hometown</h2>
              <p className="card-back-p">{hometown}</p>
            </div>
            <div className="card-back-Major-Year">
              <h2 className="card-back-h2">Major/Year</h2>
              <p className="card-back-p">{major_year}</p>
            </div>
            <div className="card-back-FunFact">
              <h2 className="card-back-h2">Fun Fact/Hot Take</h2>
              <p className="card-back-p">{funfact}</p>
            </div>
          </div>
          <button className="flip-button" onClick={handleCardFlip} onTouchStart={handleCardFlip}>
            <EastIcon className="east-icon-back" />
          </button>
        </div>
      </div>
    </div>
  );
};

OrganizerCard.propTypes = {
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  github: PropTypes.string.isRequired,
  linkedin: PropTypes.string.isRequired,
  hometown: PropTypes.string.isRequired,
  major_year: PropTypes.string.isRequired,
  funfact: PropTypes.string.isRequired
};
