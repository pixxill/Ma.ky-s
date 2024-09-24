// components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring'; // Importing react-spring for animations
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import { FaUserAlt, FaLock } from 'react-icons/fa'; // Importing icons

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Animation hook for form elements
  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 200,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
      setError('');
      navigate('/AdminDashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPane}>
        <h2 style={styles.welcomeHeader}>WELCOME BACK ADMIN!</h2>
        <p style={styles.welcomeText}>
         
        </p>
      </div>
      <animated.div style={{ ...styles.rightPane, ...formAnimation }}>
        <h2 style={styles.loginHeader}>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <FaUserAlt style={styles.icon} />
            <input
              type="email"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button
            type="submit"
            style={{ ...styles.button, ...styles.buttonHover }}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Login
          </button>
          <div style={styles.extra}>
            <p>Forgot Password? <a href="#" style={styles.signUpLink}>Click Here.</a></p>
          </div>
        </form>
      </animated.div>
    </div>
  );
};

// Styling with animations and diagonal split background
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f4f4f9',
    fontFamily: '"Roboto", sans-serif',
  },
  leftPane: {
    flex: 1,
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)',
    padding: '20px',
  },
  rightPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  welcomeHeader: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  welcomeText: {
    fontSize: '16px',
    maxWidth: '300px',
    textAlign: 'center',
  },
  loginHeader: {
    fontSize: '30px',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#bdc3c7',
  },
  input: {
    width: '100%',
    padding: '15px 15px 15px 45px',
    border: '1px solid #bdc3c7',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    color: '#333333',
    boxSizing: 'border-box',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    margin: '0',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: '10px',
    borderRadius: '8px',
  },
  button: {
    padding: '15px',
    backgroundColor: '#333',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    fontSize: '18px',
    fontWeight: '600',
  },
  buttonHover: {
    backgroundColor: '#000',
  },
  extra: {
    textAlign: 'center',
    marginTop: '10px',
    color: '#333',
  },
  signUpLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default AdminLogin;
