import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyAccountPage = ({ currentUser }) => { 
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div>
        <h2>My Account</h2>
        <p>Please log in to view your account.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>My Account</h2>
      <div>
        <img 
          src={`https://www.gravatar.com/avatar/${currentUser.emailHash}?d=identicon`} 
          alt="Profile" 
          style={{ borderRadius: '50%', width: '100px', height: '100px' }} 
        />
        <p><strong>Username:</strong> {currentUser.username}</p>
        {/* Add other user info like email, profile details */}
      </div>
    </div>
  );
};

export default MyAccountPage;
