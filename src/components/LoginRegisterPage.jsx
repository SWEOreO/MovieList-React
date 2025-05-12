import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function LoginRegisterPage({ onLogin, onRegister, loading, mode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const effectiveMode = mode || (location.pathname === '/register' ? 'register' : 'login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      if (effectiveMode === 'login') {
        const success = await onLogin(username, password);
        if (success) {
          navigate('/');
        }
      } else {
        const result = await onRegister(username, password);
        if (result.success) {
          setSuccessMessage('Registration successful. Please login.');
          navigate('/login');
        } else {
          setError(result.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{effectiveMode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: 'auto' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }} disabled={loading}>
          {loading ? (effectiveMode === 'login' ? 'Logging in...' : 'Registering...') : effectiveMode === 'login' ? 'Login' : 'Register'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
      </form>
    </div>
  );
}

export default LoginRegisterPage;
