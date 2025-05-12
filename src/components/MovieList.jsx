import React from 'react';
import MovieCard from './MovieCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';

const MovieList = ({ 
  movies, 
  onLike, 
  onShowModal, 
  isLikeView, 
  likedMoviesCount,
  onClearLiked 
}) => {
  return (
    <div className="movie-list-container">
      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map(movie => (
            <div key={movie.id}>
              <MovieCard
                movie={movie}
                onLike={onLike}
                onShowModal={onShowModal}
              />

              {/* Rating + Like icons */}
              <div className="movie-icons">
                <div className="rating-display">
                  <StarIcon className="star" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div onClick={() => onLike(movie.id)}>
                  {movie.isLiked ? (
                    <FavoriteIcon className="liked" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={isLikeView ? 'no-liked-text' : 'hidden'}>
            You haven't liked any movies yet ❤️
          </p>
        )}
      </div>
      
      {isLikeView && likedMoviesCount > 0 && (
        <button 
          className="clear-liked" 
          onClick={onClearLiked}
        >
          Clear All Liked
        </button>
      )}
    </div>
  );
};

export default MovieList;
