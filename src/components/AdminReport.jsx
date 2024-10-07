import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer
} from 'recharts';
import { realtimeDb } from '../Firebase'; // Import from your Firebase config
import { ref, onValue } from 'firebase/database';

// Colors for the charts
const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];

const AdminReport = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [packageSalesData, setPackageSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topSellingPackage, setTopSellingPackage] = useState('');
  const [bookingsTrendData, setBookingsTrendData] = useState([]);

  // Fetch confirmed and completed bookings from Firebase
  useEffect(() => {
    const historyRef = ref(realtimeDb, 'history');
    const packageSales = { 'Package A': 0, 'Package B': 0, 'Package C': 0 };
    let totalRevenue = 0;
    const bookingsByMonth = {};
    const confirmedOrCompletedBookings = [];

    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const trendData = [];

        Object.keys(data).forEach((id) => {
          const booking = data[id];
          if (booking.status === 'confirmed' || booking.status === 'completed') {
            // Extract the month from the booking date
            const bookingDate = new Date(booking.date);
            const month = bookingDate.toLocaleString('default', { month: 'long' });

            bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;

            // Calculate sales for each package
            if (booking.package && packageSales[booking.package] !== undefined) {
              if (booking.package === 'Package A') packageSales[booking.package] += 3000;
              if (booking.package === 'Package B') packageSales[booking.package] += 4000;
              if (booking.package === 'Package C') packageSales[booking.package] += 5000;

              // Increment total revenue
              totalRevenue += booking.package === 'Package A' ? 3000
                : booking.package === 'Package B' ? 4000 : 5000;
            }

            // Track booking trends over time
            const dateKey = bookingDate.toISOString().split('T')[0]; // Use date in YYYY-MM-DD format
            trendData.push({ date: dateKey, count: 1 });
          }
        });

        // Update state with the data for the charts
        setBookingsData(Object.entries(bookingsByMonth).map(([month, count]) => ({
          name: month,
          value: count,
        })));

        setPackageSalesData(Object.entries(packageSales).map(([pkg, sales]) => ({
          name: pkg,
          sales,
        })));

        setTotalRevenue(totalRevenue);

        // Set top-selling package
        const topPackage = Object.keys(packageSales).reduce((a, b) => (packageSales[a] > packageSales[b] ? a : b));
        setTopSellingPackage(topPackage);

        // Set trend data
        const aggregatedTrend = trendData.reduce((acc, { date, count }) => {
          acc[date] = (acc[date] || 0) + count;
          return acc;
        }, {});
        setBookingsTrendData(Object.entries(aggregatedTrend).map(([date, count]) => ({
          date,
          count,
        })));
      }
    });
  }, []);

  return (
    <Box p={4} sx={styles.container}>
      <Paper elevation={0} sx={styles.paper}>
        <Typography variant="h4" sx={styles.header}>
          Reports
        </Typography>

        {/* Total Revenue and Top Selling Package */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={4}>
          <Typography variant="h6" sx={styles.revenue}>
            Total Revenue: ₱{totalRevenue.toLocaleString()}
          </Typography>
          <Typography variant="h6" sx={styles.topPackage}>
            Top-Selling Package: {topSellingPackage}
          </Typography>
        </Box>

        <Divider sx={styles.divider} />

        <Box display="flex" justifyContent="space-between" mt={4}>
          {/* Pie Chart: Confirmed Bookings per Month */}
          <Box sx={styles.chartBox}>
            <Typography variant="h6" gutterBottom>
              Confirmed Bookings by Month
            </Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={bookingsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
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

          {/* Bar Chart: Sales per Package */}
          <Box sx={styles.chartBox}>
            <Typography variant="h6" gutterBottom>
              Package Sales
            </Typography>
            <ResponsiveContainer>
              <BarChart data={packageSalesData} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4A90E2" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Line Chart: Bookings Trend Over Time */}
        <Box mt={4} sx={styles.fullWidthChart}>
          <Typography variant="h6" gutterBottom>
            Bookings Trend Over Time
          </Typography>
          <ResponsiveContainer>
            <LineChart data={bookingsTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
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

// Minimalist and Modern Style
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
  topPackage: {
    color: 'black',
    fontWeight: '500',
  },
  divider: {
    margin: '20px 0',
  },
  chartBox: {
    width: '100%',
    height: 350,
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
