// src/components/AdminDashboard.jsx

import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the Admin Dashboard! Here you can manage bookings, view reports, and perform other administrative tasks.</p>
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
};

export default AdminDashboard;
