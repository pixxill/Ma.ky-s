import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, Select, MenuItem, Grid } from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer
} from 'recharts';
import { realtimeDb } from '../Firebase'; // Import from your Firebase config
import { ref, onValue } from 'firebase/database';

// Colors for the charts
const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];

// Define all months
const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AdminReport = () => {
  const [bookingsData, setBookingsData] = useState([]); // Data for all months for the pie chart
  const [monthlyRevenue, setMonthlyRevenue] = useState([]); // State to store monthly revenue
  const [packageBookingData, setPackageBookingData] = useState({}); // Data for bookings by package
  const [packageSalesData, setPackageSalesData] = useState({}); // Data for sales by package
  const [selectedMonth, setSelectedMonth] = useState('All'); // State to store selected month

  // Fetch confirmed and completed bookings from Firebase
  useEffect(() => {
    const historyRef = ref(realtimeDb, 'history');
    const revenueByMonth = {};
    const bookingsByPackage = {}; // To store bookings by package
    const salesByPackage = {}; // To store sales by package

    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsByMonth = {};
        const monthlyBookingsByPackage = {};
        const monthlySalesByPackage = {};
        
        Object.keys(data).forEach((id) => {
          const booking = data[id];
          if (booking.status === 'confirmed' || booking.status === 'completed') {
            const bookingDate = new Date(booking.date);
            const month = bookingDate.toLocaleString('default', { month: 'long' });

            // Bookings by month for pie chart
            bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;

            // Bookings by package for bar chart
            if (!monthlyBookingsByPackage[month]) {
              monthlyBookingsByPackage[month] = {};
            }
            monthlyBookingsByPackage[month][booking.package] = (monthlyBookingsByPackage[month][booking.package] || 0) + 1;

            const packagePrice =
              booking.package === 'Package A' ? 3000 :
              booking.package === 'Package B' ? 4000 :
              booking.package === 'Package C' ? 5000 : 
              booking.package === 'Package D' ? 6000 : 0;

            // Sales by package for bar chart
            if (!monthlySalesByPackage[month]) {
              monthlySalesByPackage[month] = {};
            }
            monthlySalesByPackage[month][booking.package] = (monthlySalesByPackage[month][booking.package] || 0) + packagePrice;

            revenueByMonth[month] = (revenueByMonth[month] || 0) + packagePrice;
          }
        });

        // Ensure all months are represented in the monthlyRevenue
        const allMonthsRevenue = ALL_MONTHS.map((month) => ({
          month,
          revenue: revenueByMonth[month] || 0, // Default to 0 if no revenue
        }));

        setMonthlyRevenue(allMonthsRevenue);

        // Save the monthly bookings and sales by package data
        setPackageBookingData(monthlyBookingsByPackage);
        setPackageSalesData(monthlySalesByPackage);

        // Update bookingsData for the pie chart
        setBookingsData(
          ALL_MONTHS.map((month) => ({
            name: month,
            value: bookingsByMonth[month] || 0, // Default to 0 if no bookings
          }))
        );
      }
    });
  }, []);

  // Handle month selection change
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Filter only the monthlyRevenue by selectedMonth (not the pie chart data)
  const filteredMonthlyRevenue = selectedMonth === 'All'
    ? monthlyRevenue
    : monthlyRevenue.filter((entry) => entry.month === selectedMonth);

  // Calculate the total revenue for the filtered months
  const totalRevenue = filteredMonthlyRevenue.reduce((sum, entry) => sum + entry.revenue, 0);

  // Aggregate data for "All" months for bar charts
  const aggregatePackageData = (monthlyData) => {
    const aggregateData = {};
    Object.values(monthlyData).forEach((monthData) => {
      Object.entries(monthData).forEach(([packageName, value]) => {
        aggregateData[packageName] = (aggregateData[packageName] || 0) + value;
      });
    });
    return aggregateData;
  };

  // Get the filtered data for bookings and sales by package based on selectedMonth
  const filteredPackageBookingData = selectedMonth === 'All'
    ? Object.entries(aggregatePackageData(packageBookingData)).map(([packageName, count]) => ({
        package: packageName,
        count,
      }))
    : Object.entries(packageBookingData[selectedMonth] || {}).map(([packageName, count]) => ({
        package: packageName,
        count,
      }));

  const filteredPackageSalesData = selectedMonth === 'All'
    ? Object.entries(aggregatePackageData(packageSalesData)).map(([packageName, sales]) => ({
        package: packageName,
        sales,
      }))
    : Object.entries(packageSalesData[selectedMonth] || {}).map(([packageName, sales]) => ({
        package: packageName,
        sales,
      }));

  return (
    <Box p={4} sx={styles.container}>
      <Grid container spacing={4}>
        {/* Left Side Card: Total Sales (All) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={styles.leftCard}>
            <Typography variant="h5" gutterBottom>
              Total Sales (All)
            </Typography>
            <Typography variant="h6" sx={styles.salesText}>
              ₱{monthlyRevenue.reduce((sum, entry) => sum + entry.revenue, 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Right Side Card: Filtered Sales by Month */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={styles.rightCard}>
            <Typography variant="h5" gutterBottom>
              Total Sales for {selectedMonth === 'All' ? 'All Months' : selectedMonth}
            </Typography>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              displayEmpty
              sx={styles.select}
            >
              <MenuItem value="All">All</MenuItem>
              {ALL_MONTHS.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="h6" sx={{ marginTop: '10px', ...styles.salesText }}>
              ₱{totalRevenue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={styles.divider} />

      <Box display="flex" justifyContent="center" mt={4}>
        {/* Pie Chart for Confirmed Bookings by Month */}
        <Box sx={styles.chartBox}>
          <Typography variant="h6" gutterBottom>
            Confirmed Bookings by Month
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingsData} // Always show all months' data
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
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

      <Box display="flex" justifyContent="center" mt={4}>
        {/* Bar Chart for Bookings by Package */}
        <Box sx={styles.chartBox}>
          <Typography variant="h6" gutterBottom>
            Bookings by Package ({selectedMonth})
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredPackageBookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="package" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mt={4}>
        {/* Bar Chart for Sales by Package */}
        <Box sx={styles.chartBox}>
          <Typography variant="h6" gutterBottom>
            Sales by Package ({selectedMonth})
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredPackageSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="package" />
              <YAxis tickFormatter={(value) => `₱${value.toLocaleString()}`} />
              <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
              <Bar dataKey="sales" fill="#50E3C2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    backgroundColor: '',
    height: '100vh',
  },
  leftCard: {
    padding: '30px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    height: '180px', // Set a consistent height
  },
  rightCard: {
    padding: '30px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    height: '180px', // Set a consistent height
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
    height: 400,
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
  },
  select: {
    minWidth: '150px',
  },
  salesText: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
  },
};

export default AdminReport;
