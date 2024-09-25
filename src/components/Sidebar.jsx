import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemIcon, Box, Typography, Divider } from '@mui/material';
import { FiBarChart2, FiClipboard, FiPackage, FiHome, FiLayers, FiClock } from 'react-icons/fi';
import logo from '../assets/logo.jpg'; // Update with the actual path to your logo

const Sidebar = () => {
  return (
    <Box sx={styles.sidebar}>
      <Box sx={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <Typography variant="h6" sx={styles.logoText}>
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#444' }} /> {/* Divider for separation */}
      <List sx={{ mt: 2 }}>
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
    justifyContent: 'flex-start',
    borderRight: '1px solid #333',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)', // Subtle shadow for depth
    transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
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
    marginBottom: '10px',
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
};

export default Sidebar;
