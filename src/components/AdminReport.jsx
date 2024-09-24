// src/components/AdminReport.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const AdminReport = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Typography variant="body1">
        This is where the admin reports will be displayed.
      </Typography>
    </Box>
  );
};

export default AdminReport;