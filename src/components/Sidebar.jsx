import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemIcon, Box, Typography, Divider, Button } from '@mui/material';
import { FiBarChart2, FiClipboard, FiPackage, FiHome, FiLayers, FiClock } from 'react-icons/fi';
import { getAuth, signOut } from 'firebase/auth';
import logo from '../assets/logo.jpg'; // Update with the actual path to your logo

const Sidebar = () => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/admin'); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <Box sx={styles.sidebar}>
      <Box sx={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <Typography variant="h6" sx={styles.logoText}>
          MA.KY's
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#e0e0e0' }} /> {/* Light divider color */}
      <List sx={{ mt: 2, flexGrow: 1 }}>
        <ListItem button component={Link} to="/admindashboard" sx={styles.listItem}>
          <ListItemIcon sx={styles.icon}><FiHome /></ListItemIcon>
          <ListItemText primary="Dashboard" sx={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminbookings" sx={styles.listItem}>
          <ListItemIcon sx={styles.icon}><FiClipboard /></ListItemIcon>
          <ListItemText primary="Bookings" sx={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminhistory" sx={styles.listItem}>
          <ListItemIcon sx={styles.icon}><FiClock /></ListItemIcon>
          <ListItemText primary="History" sx={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminreports" sx={styles.listItem}>
          <ListItemIcon sx={styles.icon}><FiBarChart2 /></ListItemIcon>
          <ListItemText primary="Reports" sx={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminmenu" sx={styles.listItem}>
          <ListItemIcon sx={styles.icon}><FiLayers /></ListItemIcon>
          <ListItemText primary="Menu" sx={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminpackage" sx={styles.listItem}>
          <ListItemIcon sx={styles.icon}><FiPackage /></ListItemIcon>
          <ListItemText primary="Packages" sx={styles.text} />
        </ListItem>
      </List>
      <Box sx={styles.logoutContainer}>
        <Button variant="contained" sx={styles.logoutButton} onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

// Sidebar Styles
const styles = {
  sidebar: {
    width: '220px',
    background: '#fff', // Minimalist white background
    color: '#333', // Darker text color
    height: '100vh',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: '1px solid #e0e0e0', // Light border
    boxShadow: '1px 0 5px rgba(0,0,0,0.05)', // Subtle shadow
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logo: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
    borderRadius: '50%',
  },
  logoText: {
    color: '#333',
    fontWeight: '500', // Less bold for minimalist look
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.1rem',
  },
  listItem: {
    marginBottom: '10px', // More space between items
    borderRadius: '6px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f9f9f9', // Subtle hover effect
    },
  },
  icon: {
    color: '#666', // Neutral icon color
    minWidth: '36px',
  },
  text: {
    color: '#333', // Darker text for contrast
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.9rem', // Slightly smaller font for minimalist design
  },
  logoutContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0',
  },
  logoutButton: {
    backgroundColor: '#333', // Darker button color for contrast
    color: '#fff',
    textTransform: 'none', // Remove uppercase text
    '&:hover': {
      backgroundColor: '#555', // Slightly darker hover effect
    },
    width: '100%',
  },
};

export default Sidebar;
