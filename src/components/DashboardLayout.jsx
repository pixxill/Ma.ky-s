// components/DashboardLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiLogOut, FiClipboard, FiBarChart2, FiPackage } from 'react-icons/fi';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clearing auth tokens)
    alert('You have been logged out!');
    navigate('/admin');
  };

  return (
    <div style={styles.dashboardContainer}>
      <nav style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <h2 style={styles.logo}>Admin Panel</h2>
        </div>
        <ul style={styles.navList}>
          <li>
            <NavLink
              to="/admin/dashboard/bookings"
              style={({ isActive }) =>
                isActive ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem
              }
            >
              <FiClipboard style={styles.icon} /> Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/dashboard/analytics"
              style={({ isActive }) =>
                isActive ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem
              }
            >
              <FiBarChart2 style={styles.icon} /> Analytics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/dashboard/menu"
              style={({ isActive }) =>
                isActive ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem
              }
            >
              <FiPackage style={styles.icon} /> Menu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/dashboard/menu-packages"
              style={({ isActive }) =>
                isActive ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem
              }
            >
              <FiPackage style={styles.icon} /> Packages
            </NavLink>
          </li>
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <FiLogOut style={styles.icon} /> Log Out
        </button>
      </nav>
      <div style={styles.mainContent}>
        <Outlet /> {/* Renders the matched child route's element */}
      </div>
    </div>
  );
};

// Inline styles for DashboardLayout
const styles = {
  dashboardContainer: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f8f8f9', // Light background for the dashboard
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#ffffff', // Light background for the sidebar
    color: '#333333',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px 15px',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)', // Subtle sidebar shadow
    borderRadius: '0 20px 20px 0', // Rounded right corners
  },
  logoContainer: {
    padding: '0 15px',
    textAlign: 'center',
    borderBottom: '1px solid #e0e0e0', // Divider line for logo section
    paddingBottom: '15px',
    marginBottom: '20px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: '"Poppins", sans-serif', // Modern font
    color: '#ff595e', // Logo color matching design theme
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
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#666666',
    margin: '5px 0',
    borderRadius: '8px',
    transition: 'background 0.3s, color 0.3s, transform 0.2s',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.3px',
  },
  activeNavItem: {
    backgroundColor: '#f0f0f0', // Light gray for active item background
    color: '#333333', // Darker color for active item text
    transform: 'scale(1.05)', // Slight scaling effect for active items
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for active item
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
    backgroundColor: '#ffffff', // Main content area background
    borderRadius: '15px 0 0 15px',
    boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.05)', // Shadow for main content area
    margin: '20px',
    overflowY: 'auto',
    zIndex: 1, // Ensure main content is beneath the sidebar
  },
};

export default DashboardLayout;
