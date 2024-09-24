import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { FiBarChart2, FiClipboard, FiPackage, FiHome, FiLayers } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><FiHome /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/adminbookings">
          <ListItemIcon><FiClipboard /></ListItemIcon>
          <ListItemText primary="Bookings" />
        </ListItem>
        <ListItem button component={Link} to="/adminreports">
          <ListItemIcon><FiBarChart2 /></ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
        <ListItem button component={Link} to="/adminmenu">
          <ListItemIcon><FiLayers /></ListItemIcon>
          <ListItemText primary="Menu" />
        </ListItem>
        <ListItem button component={Link} to="/adminpackage">
          <ListItemIcon><FiPackage /></ListItemIcon>
          <ListItemText primary="Packages" />
        </ListItem>
      </List>
    </div>
  );
};

// Sidebar Styles
const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    height: '100vh',
    padding: '20px',
  },
};

export default Sidebar;
