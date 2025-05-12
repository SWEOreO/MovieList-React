import React, { useState, useEffect } from 'react';

const MovieModal = ({ movie, user, userRatings, onRate, onClose }) => {
  const [selectedRating, setSelectedRating] = useState(userRatings[movie.id] || '');

  useEffect(() => {
    setSelectedRating(userRatings[movie.id] || '');
  }, [userRatings, movie.id]);

  const handleSubmit = () => {
    if (selectedRating) {
      onRate(movie.id, Number(selectedRating));
      alert(`You rated "${movie.title}" ${selectedRating} / 10`);
    }
  };

  const roundedRating = Math.round(movie.vote_average);
  const preciseRating = movie.vote_average.toFixed(2);
  const totalStars = 10;

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
          <h2 id="modal-title">{movie.title}</h2>
          <p id="modal-overview">{movie.overview}</p>
          <p><strong>Release Year:</strong> {year}</p>
          <p><strong>Run Time:</strong> {movie.runtime || "N/A"} min</p>
          <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ")}</p>

          <p><strong>TMDB Score:</strong> {preciseRating} / 10</p>

          {user?.isLoggedIn && (
            <div className="user-rating-dropdown">
              <label htmlFor={`rating-select-${movie.id}`}>Your Rating:</label>
              <select
                id={`rating-select-${movie.id}`}
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                <option value="" disabled>Rate 1–10</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <button onClick={handleSubmit} disabled={!selectedRating}>
                Submit Rating
              </button>
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
