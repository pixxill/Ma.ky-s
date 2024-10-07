import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiClipboard, FiPackage, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Avatar, Snackbar, Alert, Badge, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ref, onValue, onChildAdded } from 'firebase/database';
import { realtimeDb } from '../../Firebase';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components for the Line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend, Filler);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookingCount, setBookingCount] = useState(0);
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState({});
  const [newBookings, setNewBookings] = useState([]); // Track multiple new bookings
  const [showNotification, setShowNotification] = useState(false); // Control notification visibility
  const [notificationBell, setNotificationBell] = useState(false); // Control bell color/animation

  // State to handle notification menu (dropdown)
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // All months for the x-axis of the line chart
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const bookingsRef = ref(realtimeDb, 'bookings/');

    // Fetch initial bookings count
    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setBookingCount(Object.keys(data).length);
      } else {
        setBookingCount(0);
      }
    });

    // Listen for newly added bookings
    const unsubscribeNewBooking = onChildAdded(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const newBookingData = snapshot.val();
        setNewBookings((prev) => [...prev, newBookingData]); // Add new booking to the list
        setShowNotification(true); // Show snackbar notification
        setNotificationBell(true); // Change bell color or animate
      }
    });

    const menuRef = ref(realtimeDb, 'Menu/');
    const unsubscribeMenu = onValue(menuRef, (snapshot) => {
      if (snapshot.exists()) {
        const menuData = snapshot.val();
        const totalMenuItems = Object.values(menuData).reduce((total, categoryItems) => {
          return total + Object.keys(categoryItems).length;
        }, 0);
        setMenuItemCount(totalMenuItems);
      } else {
        setMenuItemCount(0);
      }
    });

    const historyRef = ref(realtimeDb, 'history/');
    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        setHistoryCount(Object.keys(historyData).length);

        const monthlyCount = {};
        Object.values(historyData).forEach((booking) => {
          const date = booking.date || '';
          const monthIndex = new Date(date).getMonth(); // Extract the month index from date
          if (monthIndex >= 0) {
            monthlyCount[monthIndex] = (monthlyCount[monthIndex] || 0) + 1;
          }
        });
        setMonthlyData(monthlyCount);
      } else {
        setHistoryCount(0);
      }
    });

    // Cleanup listeners when the component unmounts
    return () => {
      unsubscribeBookings();
      unsubscribeMenu();
      unsubscribeHistory();
      unsubscribeNewBooking();
    };
  }, []);

  const handleCardClick = (route) => {
    navigate(route);
  };

  const handleCloseNotification = () => {
    setShowNotification(false); // Close notification after user dismisses it
  };

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the notification menu
    setNotificationBell(false); // Reset the bell animation/color
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

  const markAllAsRead = () => {
    setNewBookings([]); // Clear all new bookings
    handleCloseMenu(); // Close the menu
  };

  const dashboardData = [
    { title: 'Bookings', count: bookingCount, icon: <FiClipboard />, color: '#90caf9', route: '/admindashboard/adminbookings' },
    { title: 'History', count: historyCount, icon: <FiClock />, color: '#ffab91', route: '/admindashboard/adminhistory' },
    { title: 'Menu Items', count: menuItemCount, icon: <FiPackage />, color: '#ffe082', route: '/admindashboard/adminmenu' },
  ];

  // Prepare data for the line chart
  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Completed Bookings',
        data: allMonths.map((_, index) => monthlyData[index] || 0), // Fill data for each month
        borderColor: '#42a5f5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#42a5f5',
        pointHoverBackgroundColor: '#42a5f5',
        pointHoverBorderColor: '#ffffff',
        fill: 'start',
        lineTension: 0.3, // Smooth curve for the line
      },
    ],
  };

  // Chart options with enhanced appearance
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Remove vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#333', // Color of Y-axis labels
        },
        grid: {
          color: 'rgba(0,0,0,0.1)', // Light horizontal grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333', // Color of legend labels
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: '#42a5f5', // Tooltip background color
        titleColor: '#ffffff', // Tooltip title color
        bodyColor: '#ffffff', // Tooltip body color
        cornerRadius: 4,
      },
    },
  };

  return (
    <Box sx={styles.dashboardContainer}>
      <Box sx={styles.header}>
        <Typography variant="h4" gutterBottom sx={styles.dashboardTitle}>
          Admin Dashboard
        </Typography>
        {/* Notification Bell Icon */}
        <Tooltip title="Notifications">
          <IconButton onClick={handleBellClick} sx={{ color: notificationBell ? '#ff9800' : '#555' }}> {/* Change color when new booking */}
            <Badge badgeContent={newBookings.length} color="error">
              <NotificationsIcon fontSize="large" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Notification Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
      >
        {newBookings.length > 0 ? (
          <>
            {newBookings.map((booking, index) => (
              <MenuItem key={index} onClick={handleCloseMenu}>
                New booking: {booking.first_name} {booking.last_name}
              </MenuItem>
            ))}
            <MenuItem onClick={markAllAsRead} style={{ color: '#1976d2', fontWeight: 'bold' }}>
              Mark all as read
            </MenuItem>
          </>
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>

      <Grid container spacing={3}>
        {dashboardData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={styles.dashboardCard}
              onClick={() => handleCardClick(item.route)}
            >
              <CardContent sx={styles.cardContent}>
                <Avatar sx={{ ...styles.cardIcon, backgroundColor: item.color }}>
                  {item.icon}
                </Avatar>
                <Typography variant="h5" sx={styles.cardText}>
                  {item.count}
                </Typography>
                <Typography variant="body2" sx={styles.cardSubText}>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Line Chart for Completed Bookings */}
      <Box sx={styles.chartContainer}>
        <Typography variant="h5" gutterBottom sx={{ color: '#333' }}>
          Completed Bookings per Month
        </Typography>
        <Box sx={{ height: 400 }}> {/* Fixed height for the chart container */}
          <Line
            data={chartData}
            options={chartOptions}
          />
        </Box>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={showNotification}
        autoHideDuration={6000} // Automatically close after 6 seconds
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity="info" sx={{ width: '100%' }}>
          New booking has been added!
        </Alert>
      </Snackbar>
    </Box>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '20px',
    backgroundColor: '#f0f4f8', // Light background color
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  dashboardTitle: {
    color: '#333', // Darker text color for the title
  },
  dashboardCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    padding: '30px 20px', // Added padding for better spacing
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff', // Light background color for the cards
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    color: '#333', // Darker text for better contrast
  },
  cardIcon: {
    width: '60px', // Increased size for better visibility
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '28px', // Increased icon size
    color: 'white',
    marginBottom: '15px', // Added margin for spacing
  },
  cardText: {
    fontWeight: 'bold',
    color: '#333', // Darker text color
    fontSize: '24px', // Increased text size for better readability
  },
  cardSubText: {
    color: '#666', // Subtle color for subtext
  },
  chartContainer: {
    mt: 5,
    width: '100%',
    maxWidth: 800,
    padding: '20px',
    backgroundColor: '#ffffff', // Light background for the chart container
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
};

export default AdminDashboard;
