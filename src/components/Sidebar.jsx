import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemIcon, Box, Typography } from '@mui/material';
import { FiBarChart2, FiClipboard, FiPackage, FiHome, FiLayers } from 'react-icons/fi';
import logo from '../assets/logo.jpg'; // Make sure to replace with the actual path to your logo

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <Box style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <Typography variant="h6" style={styles.logoText}>
          Admin Panel
        </Typography>
      </Box>
      <List>
        <ListItem button component={Link} to="/admindashboard" style={styles.listItem}>
          <ListItemIcon style={styles.icon}><FiHome /></ListItemIcon>
          <ListItemText primary="Dashboard" style={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminbookings" style={styles.listItem}>
          <ListItemIcon style={styles.icon}><FiClipboard /></ListItemIcon>
          <ListItemText primary="Bookings" style={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminreports" style={styles.listItem}>
          <ListItemIcon style={styles.icon}><FiBarChart2 /></ListItemIcon>
          <ListItemText primary="Reports" style={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminmenu" style={styles.listItem}>
          <ListItemIcon style={styles.icon}><FiLayers /></ListItemIcon>
          <ListItemText primary="Menu" style={styles.text} />
        </ListItem>
        <ListItem button component={Link} to="/admindashboard/adminpackage" style={styles.listItem}>
          <ListItemIcon style={styles.icon}><FiPackage /></ListItemIcon>
          <ListItemText primary="Packages" style={styles.text} />
        </ListItem>
      </List>
    </div>
  );
};

// Sidebar Styles
const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#1a1a1a', // Dark background for modern look
    color: '#fff', // White text color
    height: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Adjust to start at the top
    borderRight: '1px solid #333', // Subtle border for separation
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px', // Space below the logo
  },
  logo: {
    width: '40px', // Logo width
    height: '40px', // Logo height
    marginRight: '10px', // Space between logo and text
  },
  logoText: {
    color: '#fff', // White text color
    fontWeight: 'bold', // Bold text
  },
  listItem: {
    marginBottom: '10px', // Spacing between items
    borderRadius: '8px', // Rounded corners for list items
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#333', // Hover effect with dark gray background
    },
  },
  icon: {
    color: '#fff', // White icons
    minWidth: '40px', // Adjust icon spacing
  },
  text: {
    color: '#fff', // White text
    fontWeight: 'bold', // Bold text for visibility
  },
};

export default Sidebar;
