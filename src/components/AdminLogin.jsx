// components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Admin Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

// Formal design styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    padding: '20px',
  },
  formContainer: {
    maxWidth: '400px',
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    border: '1px solid #e0e0e0',
  },
  header: {
    marginBottom: '30px',
    fontSize: '28px',
    color: '#333333',
    fontWeight: '600',
    fontFamily: '"Roboto", sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333333',
    fontFamily: '"Roboto", sans-serif',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #cccccc',
    borderRadius: '6px',
    backgroundColor: '#f9f9f9',
    color: '#333333',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    fontSize: '16px',
    fontFamily: '"Roboto", sans-serif',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  error: {
    color: '#ff4d4f',
    fontSize: '14px',
    margin: '0',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '6px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: '"Roboto", sans-serif',
    boxShadow: '0 4px 6px rgba(0, 123, 255, 0.1)',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    boxShadow: '0 6px 12px rgba(0, 123, 255, 0.2)',
  },
};

export default AdminLogin;
