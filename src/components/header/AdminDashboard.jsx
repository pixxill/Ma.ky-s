import React, { useState } from 'react';
import { FiBarChart2, FiClipboard, FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Mock Booking Data
  const bookingData = {
    contact_number: "123",
    date: "2024-09-27",
    date_time: "September 23, 2024 at 01:52 AM",
    email_address: "ASDAS",
    first_name: "ROCA",
    last_name: "HURHUR",
    package: "4000Php",
    status: "active",
    time: "1:00 PM - 5:00 PM",
  };

  // Route to different pages when a card is clicked
  const handleCardClick = (route) => {
    navigate(route);
  };

  // Dashboard data for cards with routes
  const dashboardData = [
    { title: 'Bookings', count: 150, icon: <FiClipboard />, color: '#90caf9', route: '/admindashboard/adminbookings' },
    { title: 'Menu Items', count: 45, icon: <FiPackage />, color: '#ffe082', route: '/admindashboard/adminmenu' },
    { title: 'Packages', count: 20, icon: <FiBarChart2 />, color: '#ffab91', route: '/admindashboard/adminpackage' },
  ];

  return (
    <div style={styles.dashboardContainer}>
      <Box p={3} style={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Grid container spacing={3}>
          {dashboardData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                style={styles.dashboardCard}
                onClick={() => handleCardClick(item.route)} // Navigate when card is clicked
              >
                <Avatar style={{ ...styles.cardIcon, backgroundColor: item.color }}>
                  {item.icon}
                </Avatar>
                <CardContent>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    {item.count}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Booking Info Card */}
        <Box mt={5}>
          <Card style={{ ...styles.bookingCard, padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Latest Booking
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>First Name:</strong> {bookingData.first_name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Last Name:</strong> {bookingData.last_name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Email:</strong> {bookingData.email_address}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Date:</strong> {bookingData.date}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Time:</strong> {bookingData.time}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Package:</strong> {bookingData.package}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Box>
    </div>
  );
};

// Inline styles for AdminDashboard
const styles = {
  dashboardContainer: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#f8f8f9',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    overflowY: 'auto',
  },
  dashboardCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  bookingCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  cardIcon: {
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '15px',
    fontSize: '24px',
    color: '#ffffff',
  },
};

export default AdminDashboard;