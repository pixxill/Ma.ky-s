import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiClipboard, FiPackage, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../../Firebase'; // Adjust based on your file structure
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components for the Line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookingCount, setBookingCount] = useState(0);
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState({});

  // All months for the x-axis of the line chart
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const bookingsRef = ref(realtimeDb, 'bookings/');
    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setBookingCount(Object.keys(data).length);
      } else {
        setBookingCount(0);
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

    return () => {
      unsubscribeBookings();
      unsubscribeMenu();
      unsubscribeHistory();
    };
  }, []);

  const handleCardClick = (route) => {
    navigate(route);
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
        backgroundColor: 'rgba(66, 165, 245, 0.3)',
        fill: true,
        lineTension: 0.3, // Smooth curve for the line
      },
    ],
  };

  return (
    <Box sx={styles.dashboardContainer}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
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
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
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

      {/* Line Chart for Completed Bookings */}
      <Box sx={{ mt: 5, width: '100%', maxWidth: 800 }}> {/* Adjust width and maxWidth as needed */}
        <Typography variant="h5" gutterBottom>
          Completed Bookings per Month
        </Typography>
        <Box sx={{ height: 400 }}> {/* Fixed height for the chart container */}
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
              },
            }}
          />
        </Box>
      </Box>
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
    backgroundColor: '#f8f8f9',
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
  },
  cardIcon: {
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    color: '#fff',
    marginBottom: '10px',
  },
};

export default AdminDashboard;
