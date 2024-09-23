// src/components/AdminHome.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/admin-dashboard'); // Navigate to the AdminDashboard page
  };

  return (
    <div style={styles.container}>
      <h2>Admin Home</h2>
      <button onClick={goToDashboard} style={styles.button}>
        Go to Admin Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f2f2f2',
    padding: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default AdminHome;
