// components/DashboardLayout.jsx
import React, { useState } from 'react';
import { FiLogOut, FiBarChart2, FiClipboard, FiPackage } from 'react-icons/fi';
import UploadMenuItem from './../AdminMenu'; // Import your UploadMenuItem component

const DashboardLayout = () => {
  const [selectedComponent, setSelectedComponent] = useState('bookings');

  const handleLogout = () => {
    alert('You have been logged out!');
    // You can add your logout logic here if necessary
  };

  // Components to render
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'bookings':
        return <div>Bookings Component</div>; // Replace with your actual bookings component
      case 'analytics':
        return <div>Analytics Component</div>; // Replace with your actual analytics component
      case 'menu':
        return <UploadMenuItem />; // Render the UploadMenuItem component when "Menu" is selected
      case 'packages':
        return <div>Packages Component</div>; // Replace with your actual packages component
      default:
        return <div>Select an option from the menu</div>;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <h2 style={styles.logo}>Admin Panel</h2>
        </div>
        <ul style={styles.navList}>
          <li>
            <button
              onClick={() => setSelectedComponent('bookings')}
              style={selectedComponent === 'bookings' ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}
            >
              <FiClipboard style={styles.icon} /> Bookings
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedComponent('analytics')}
              style={selectedComponent === 'analytics' ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}
            >
              <FiBarChart2 style={styles.icon} /> Analytics
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedComponent('menu')}
              style={selectedComponent === 'menu' ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}
            >
              <FiPackage style={styles.icon} /> Menu
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedComponent('packages')}
              style={selectedComponent === 'packages' ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem}
            >
              <FiPackage style={styles.icon} /> Packages
            </button>
          </li>
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <FiLogOut style={styles.icon} /> Log Out
        </button>
      </nav>
      <div style={styles.mainContent}>
        {renderComponent()} {/* Render the selected component here */}
      </div>
    </div>
  );
};

// Inline styles for DashboardLayout
const styles = {
  dashboardContainer: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#e0e0e0',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#3a3f44',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px 10px',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '0 10px 10px 0',
  },
  logoContainer: {
    padding: '0 10px',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '15px',
    marginBottom: '15px',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '600',
    fontFamily: '"Poppins", sans-serif',
    color: '#ffffff',
    letterSpacing: '0.5px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    flexGrow: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    textDecoration: 'none',
    color: '#c0c0c0',
    margin: '5px 0',
    borderRadius: '8px',
    transition: 'background 0.3s, color 0.3s, transform 0.2s',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.3px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  activeNavItem: {
    backgroundColor: '#4b5056',
    color: '#ffffff',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 15px',
    backgroundColor: '#e74c3c',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    borderRadius: '8px',
    margin: '15px 10px',
    transition: 'background-color 0.3s, transform 0.2s',
    fontSize: '14px',
    fontWeight: '600',
  },
  icon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  mainContent: {
    flexGrow: 1,
    padding: '30px',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px 0 0 15px',
    boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.05)',
    margin: '20px',
    overflowY: 'auto',
    zIndex: 1,
  },
};

export default DashboardLayout;
