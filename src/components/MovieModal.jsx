import React from 'react';

const MovieModal = ({ movie, user, userRatings, onRate, onClose, rating, onRatingChange }) => {
  const roundedRating = Math.round(movie.vote_average);
  const totalStars = 10;

  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <i 
        key={i} 
        className={`ion-ios-star${i <= roundedRating ? '' : '-outline'} star`}
      ></i>
    );
  }

  const year = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : "N/A";

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <img 
          id="modal-image" 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt="Movie Poster" 
        />
        
        <div className="modal-details">
          {user?.isLoggedIn && (
            <div className="user-rating">
              <label htmlFor="rating-select">Your Rating:</label>
              <select
                id="rating-select"
                value={userRatings[movie.id] || ''}
                onChange={(e) => onRate(movie.id, Number(e.target.value))}
              >
                <option value="" disabled>Rate 1–10</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <h2 id="modal-title">{movie.title}</h2>
          <p id="modal-overview">{movie.overview}</p>
          <p><strong>Release Year:</strong> <span id="modal-release-year">{year}</span></p>
          <p><strong>Run Time:</strong> <span id="modal-runtime">{movie.runtime || "N/A"} min</span></p>
          <p><strong>Genres:</strong> <span id="modal-genres">
            {movie.genres?.map(g => g.name).join(", ")}
          </span></p>

          {/* Displaying the rounded rating stars */}
          <div>
            <strong>Rating:</strong> 
            <span id="modal-rating">
              <div className="rating-display">{stars}</div>
            </span>
          </div>

          {/* Rating Selection Feature */}
          {user?.isLoggedIn && (
            <div className="rating-selection">
              <label>Rate this Movie:</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <span
                    key={star}
                    className={`star ${rating >= star ? 'filled' : ''}`}
                    onClick={() => onRatingChange(star)} // Call the rating change handler
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
          )}

          {movie.production_companies?.length > 0 && (
            <div id="modal-companies" className="modal-companies">
              {movie.production_companies
                .filter(c => c.logo_path)
                .map(c => (
                  <img 
                    key={c.id}
                    src={`https://image.tmdb.org/t/p/w300${c.logo_path}`}
                    alt={c.name}
                    title={c.name}
                    className="company-logo"
                  />
                ))}
            </div>
          )}
        </div>
        
        <span className="close-button" onClick={onClose}>&times;</span>
      </div>
    </div>
  );
};

export default MovieModal;
