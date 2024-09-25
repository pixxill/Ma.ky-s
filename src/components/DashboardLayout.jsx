import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar /> {/* Sidebar on the left */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', // Ensure vertical layout for content
          justifyContent: 'flex-start', // Start at the top
          alignItems: 'stretch', // Stretch to fill available space
          overflowY: 'auto', // Handle vertical scrolling
          overflowX: 'hidden', // Hide horizontal scrolling
          padding: 2, // Consistent padding for content area
          backgroundColor: '#f0f2f5' // Optional: background color for content area
        }}
      >
        <Outlet /> {/* This will render the child components like AdminDashboard, AdminMenu, etc. */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
