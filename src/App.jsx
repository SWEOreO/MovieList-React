import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginRegisterPage from './components/LoginRegisterPage.jsx';
import Header from './components/Header';
import MovieList from './components/MovieList';
import SearchFilter from './components/SearchFilter';
import Pagination from './components/Pagination';
import BackToTop from './components/BackToTop';
import MovieModal from './components/MovieModal';
import MyAccountPage from './components/MyAccountPage.jsx';
import './App.css';

const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZWEzNTM4NTk3NGFkY2RkOWFlOTRhNDAwOWQwN2VhNyIsIm5iZiI6MTc0NTM2ODIwNC4xNzI5OTk5LCJzdWIiOiI2ODA4MzQ4Y2FjMDJkNDQwN2JhYjI1ZjciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jFuUA7bOpK6YedyqEbE8AhQePkU_bsEUnTkn1awptVY';

const categoryURLs = {
  now_playing: `https://api.themoviedb.org/3/movie/now_playing`,
  popular: `https://api.themoviedb.org/3/movie/popular`,
  top_rated: `https://api.themoviedb.org/3/movie/top_rated`,
  upcoming: `https://api.themoviedb.org/3/movie/upcoming`
};

function App() {
  const [movies, setMovies] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedMovies, setLikedMovies] = useState(new Set());
  const [isLikeView, setIsLikeView] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userRatings, setUserRatings] = useState({});
  const [rating, setRating] = useState(null);


  const fetchMovieDetails = useCallback(async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: TOKEN,
          },
        }
      );
      if (!res.ok) throw new Error("Network Response Error!");
      return await res.json();
    } catch (err) {
      console.error("Error fetching movie details:", err);
      return null;
    }
  }, []);

  const fetchUserDetails = useCallback(async (sessionId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account?session_id=${sessionId}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: TOKEN,
          },
        }
      );
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout();
    }
  }, []);

  const fetchFavoriteMovies = useCallback(async () => {
    if (!user?.id) return;
    try {
      const sessionId = localStorage.getItem('tmdb_session_id');
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${user.id}/favorite/movies?session_id=${sessionId}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: TOKEN,
          },
        }
      );
      const data = await response.json();
      setFavorites(data.results);
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
    }
  }, [user?.id]);

  const fetchRatedMovies = useCallback(async () => {
    if (!user?.id) return;
    try {
      const sessionId = localStorage.getItem('tmdb_session_id');
      const response = await fetch(
        `https://api.themoviedb.org/3/account/${user.id}/rated/movies?session_id=${sessionId}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: TOKEN,
          },
        }
      );
      const data = await response.json();
      setRatedMovies(data.results);
    } catch (error) {
      console.error('Error fetching rated movies:', error);
    }
  }, [user?.id]);

  const fetchMovies = useCallback(async () => {
    if (isLikeView) return;
    try {
      const validCategory = categoryURLs[currentCategory];
      if (!validCategory) throw new Error(`Invalid category: ${currentCategory}`);

      const url = `${validCategory}?language=en-US&page=${currentPage}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: TOKEN,
        },
      });

      if (!res.ok) throw new Error("Network Response Error!");
      const data = await res.json();

      setMovies(data.results.map(movie => ({
        ...movie,
        isLiked: likedMovies.has(movie.id),
        isFavorite: favorites.some(fav => fav.id === movie.id),
        userRating: ratedMovies.find(rated => rated.id === movie.id)?.rating
      })));
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Error fetching movie list:", err);
    }
  }, [currentCategory, currentPage, isLikeView, likedMovies, favorites, ratedMovies]);

  useEffect(() => {
    const savedLikes = localStorage.getItem('likedMovies');
    if (savedLikes) setLikedMovies(new Set(JSON.parse(savedLikes)));

    const sessionId = localStorage.getItem('tmdb_session_id');
    if (sessionId) {
      fetchUserDetails(sessionId);
    }
  }, [fetchUserDetails]);

  useEffect(() => {
    if (user) {
      fetchFavoriteMovies();
      fetchRatedMovies();
    }
  }, [user, fetchFavoriteMovies, fetchRatedMovies]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleLogin = async (username, password) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem('tmdb_users') || '[]');
        const user = registeredUsers.find((u) => u.username === username && u.password === password);
        if (user) {
          setLoggedIn(true);
          setCurrentUser(user); 
          setUser({ ...user, isLoggedIn: true }); 
          setLoading(false);
          resolve(true);
          navigate('/');
        } else {
          setLoading(false);
          alert('Invalid credentials');
          resolve(false);
        }
      }, 1000);
    });
  };  

  const logout = () => {
    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem('tmdb_session_id');
    navigate('/');
  };

  const handleLikeMovie = (movieId) => {
    const newLikedMovies = new Set(likedMovies);
    if (newLikedMovies.has(movieId)) {
      newLikedMovies.delete(movieId);
    } else {
      newLikedMovies.add(movieId);
    }
    setLikedMovies(newLikedMovies);
    localStorage.setItem('likedMovies', JSON.stringify(Array.from(newLikedMovies)));
  };

  const handleShowModal = async (movieId) => {
    const details = await fetchMovieDetails(movieId);
    if (details) {
      setSelectedMovie(details);
      setShowModal(true);
    }
  };
  
  const handleRegister = async (username, password) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const registeredUsers = JSON.parse(localStorage.getItem('tmdb_users') || '[]');
        const userExists = registeredUsers.some(u => u.username === username);
        if (userExists) {
          setLoading(false);
          resolve({ success: false, message: 'Username already exists.' });
        } else {
          registeredUsers.push({ username, password });
          localStorage.setItem('tmdb_users', JSON.stringify(registeredUsers));
          setLoading(false);
          resolve({ success: true });
          navigate('/login');
        }
      }, 1000);
    });
  };

  const handleRate = (movieId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [movieId]: rating,
    }));
  };  

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header
        user={user}
        onLogout={logout}
        onHomeClick={() => {
          setIsLikeView(false);
          setCurrentPage(1);
        }}
        onLikeClick={() => {
          setIsLikeView(true);
          setCurrentPage(1);
        }}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchFilter
                currentCategory={currentCategory}
                setCurrentCategory={setCurrentCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setIsLikeView={setIsLikeView}
              />
              <MovieList
                movies={
                  isLikeView
                    ? [...likedMovies].map(id => movies.find(m => m.id === id)).filter(Boolean)
                    : movies
                }
                onLike={handleLikeMovie}
                onSelect={setSelectedMovie}
                onShowModal={handleShowModal}
                isLikeView={isLikeView} 
                likedMoviesCount={likedMovies.size} 
                onClearLiked={() => {
                  setLikedMovies(new Set());
                  localStorage.setItem('likedMovies', JSON.stringify([]));
                }}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
              <BackToTop />
              {showModal && selectedMovie && (
                <MovieModal
                  movie={selectedMovie}
                  user={user}
                  userRatings={userRatings}
                  onRate={handleRate}
                  onClose={handleCloseModal}
                  rating={rating} 
                  onRatingChange={handleRatingChange}  
              />
             
              )}
            </>
          }
        />
        <Route
          path="/login"
          element={<LoginRegisterPage mode="login" onLogin={handleLogin} loading={loading} />}
        />
        <Route
          path="/register"
          element={<LoginRegisterPage mode="register" onRegister={handleRegister} loading={loading} />}
        />
        <Route
          path="/my-account"
          element={loggedIn ? <MyAccountPage currentUser={currentUser} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
