import React from 'react';
import { Outlet } from 'react-router-dom'; // This will render nested routes
import Sidebar from './Sidebar'; // Import Sidebar component
import { Box } from '@mui/material'; // Use Material-UI for layout

const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar on the left */}
      <Box sx={{ flexGrow: 1, padding: 3 }}> {/* Content area */}
        <Outlet /> {/* This will render the child components like AdminDashboard, AdminMenu, etc. */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
