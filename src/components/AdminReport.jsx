import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer
} from 'recharts';
import { realtimeDb } from '../Firebase'; // Import from your Firebase config
import { ref, onValue } from 'firebase/database';

// Colors for the charts
const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];

const AdminReport = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]); // State to store monthly revenue
  const [topSellingPackage, setTopSellingPackage] = useState('');
  const [bookingsTrendData, setBookingsTrendData] = useState([]);

  // Fetch confirmed and completed bookings from Firebase
  useEffect(() => {
    const historyRef = ref(realtimeDb, 'history');
    const revenueByMonth = {};

    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsByMonth = {};
        const trendData = [];

        Object.keys(data).forEach((id) => {
          const booking = data[id];
          if (booking.status === 'confirmed' || booking.status === 'completed') {
            const bookingDate = new Date(booking.date);
            const month = bookingDate.toLocaleString('default', { month: 'long' });

            bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;

            const packagePrice =
              booking.package === 'Package A' ? 3000 :
              booking.package === 'Package B' ? 4000 :
              booking.package === 'Package C' ? 5000 : 
              booking.package === 'Package C' ? 6000 : 0;

            revenueByMonth[month] = (revenueByMonth[month] || 0) + packagePrice;

            const dateKey = bookingDate.toISOString().split('T')[0]; // YYYY-MM-DD format
            trendData.push({ date: dateKey, count: 1 });
          }
        });

        setMonthlyRevenue(
          Object.entries(revenueByMonth).map(([month, revenue]) => ({
            month,
            revenue,
          }))
        );

        setBookingsData(
          Object.entries(bookingsByMonth).map(([month, count]) => ({
            name: month,
            value: count,
          }))
        );

        const aggregatedTrend = trendData.reduce((acc, { date, count }) => {
          acc[date] = (acc[date] || 0) + count;
          return acc;
        }, {});
        setBookingsTrendData(
          Object.entries(aggregatedTrend).map(([date, count]) => ({
            date,
            count,
          }))
        );
      }
    });
  }, []);

  return (
    <Box p={4} sx={styles.container}>
      <Paper elevation={0} sx={styles.paper}>
        <Typography variant="h4" sx={styles.header}>
          Reports
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={4}>
          <Typography variant="h6" sx={styles.revenue}>
            Monthly Revenue:
          </Typography>
        </Box>

        <List>
          {monthlyRevenue.map(({ month, revenue }) => (
            <ListItem key={month}>
              <ListItemText primary={`${month}: ₱${revenue.toLocaleString()}`} />
            </ListItem>
          ))}
        </List>

        <Divider sx={styles.divider} />

        <Box display="flex" justifyContent="center" mt={4}>
          {/* Enlarged Pie Chart */}
          <Box sx={styles.chartBox}>
            <Typography variant="h6" gutterBottom>
              Confirmed Bookings by Month
            </Typography>
            <ResponsiveContainer width="100%" height={400}> {/* Adjusted height */}
              <PieChart>
                <Pie
                  data={bookingsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150} // Increased the outer radius
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box mt={4} sx={styles.fullWidthChart}>
          <Typography variant="h6" gutterBottom>
            Bookings Trend Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingsTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#50E3C2" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

const styles = {
  container: {
    backgroundColor: '',
    height: '100vh',
  },
  paper: {
    padding: '30px',
    borderRadius: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
  },
  header: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  revenue: {
    color: 'black',
    fontWeight: '500',
  },
  divider: {
    margin: '20px 0',
  },
  chartBox: {
    width: '100%',
    height: 400, // Adjusted chart box height
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
  },
  fullWidthChart: {
    width: '100%',
    height: 350,
    backgroundColor: 'whites',
    padding: '20px',
    borderRadius: '10px',
  },
};

export default AdminReport;
