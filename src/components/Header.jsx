import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/MovieDB.svg';

const Header = ({ user, onHomeClick, onLikeClick, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="title-logo">
      <div className="logo" onClick={() => { onHomeClick(); navigate('/'); }} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="MovieDB-Logo" />
      </div>
      <h1 className="movieDB-title" onClick={() => { onHomeClick(); navigate('/'); }} style={{ cursor: 'pointer' }}>
        Movie List
      </h1>
      <nav className="nav-bar">
        <menu id="home-menu" onClick={() => { onHomeClick(); navigate('/'); }}>Home</menu>
        <menu id="like-menu" onClick={() => { onLikeClick(); navigate('/'); }}>Like</menu>
        {user ? (
          <>
            <menu id="my-account-menu" onClick={() => navigate('/my-account')}>My Account</menu>
            <menu id="logout-menu" onClick={() => { onLogout(); navigate('/'); }}>Logout</menu>
          </>
        ) : (
          <>
            <menu id="login-menu" onClick={() => navigate('/login')}>Login</menu>
            <menu id="register-menu" onClick={() => navigate('/register')}>Register</menu>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
