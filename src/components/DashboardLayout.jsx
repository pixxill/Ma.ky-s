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
          padding: 0, // Remove padding to fit content precisely
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          overflow: 'auto'
        }}
      >
        <Outlet /> {/* This will render the child components like AdminDashboard, AdminMenu, etc. */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;