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
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#444' }} /> {/* Divider for separation */}
      <List sx={{ mt: 2, flexGrow: 1 }}> {/* flexGrow allows the list to expand and take space */}
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
    width: '250px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    height: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Distribute space between elements
    borderRight: '1px solid #333',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)', // Subtle shadow for depth
    transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px', // Reduced margin for less space
  },
  logo: {
    width: '50px',
    height: '50px',
    marginRight: '10px',
    borderRadius: '50%', // Circular logo
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Shadow for logo
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Roboto, sans-serif', // Updated font for better look
    fontSize: '1.2rem',
  },
  listItem: {
    marginBottom: '5px', // Adjusted spacing between items
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#333', // Hover effect
      transform: 'scale(1.05)', // Slightly grow on hover
    },
    '& .MuiListItemIcon-root': {
      transition: 'color 0.3s', // Icon color transition
    },
  },
  icon: {
    color: '#999', // Subtle icon color
    minWidth: '40px',
    '&:hover': {
      color: '#fff', // Change icon color on hover
    },
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Roboto, sans-serif',
  },
  logoutContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
  },
  logoutButton: {
    bgcolor: '#333',
    color: '#fff',
    width: '100%',
    '&:hover': {
      bgcolor: '#555', // Darker background on hover
    },
  },
};

export default Sidebar;
