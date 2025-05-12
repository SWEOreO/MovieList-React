import React from 'react';

const MovieCard = ({ movie, onLike, onShowModal }) => {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : './no-image-img.png';

  return (
    <div className="movie-card">
      <img src={posterPath} alt={movie.title} />
      <h4 className="movie-name" onClick={() => onShowModal(movie.id)}>
        {movie.title}
      </h4>
      <div className="movie-icons">
        <div className="rating-display">
          <i className="ion-ios-star star"></i>
        </div>
        <i
          className={`ion-ios-heart${movie.isLiked ? '' : '-outline'} like-icon ${movie.isLiked ? 'liked' : ''}`}
          onClick={() => onLike(movie.id)}
        ></i>
      </div>
    </div>
  );
};

export default MovieCard;
