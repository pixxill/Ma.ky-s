import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Element } from 'react-scroll';
import Header from './components/header/Header';
import Home from './components/Home';
import About from './components/About';
import Menu from './components/header/Menu';
import Contact from './components/Contact';
import Location from './components/Location';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import DashboardLayout from './components/DashboardLayout'; // Dashboard with sidebar
import AdminDashboard from './components/header/AdminDashboard'; // Corrected path to AdminDashboard
import UploadMenuItem from './components/AdminMenu'; // Admin Menu component
import AdminBookings from './components/AdminBookings'; // Admin Bookings component
import AdminReport from './components/AdminReport'; // Admin Report component
import AdminPackage from './components/AdminPackage'; // Admin Package component
import Sidebar from './components/Sidebar'; // Sidebar component for navigation
import '@fontsource/roboto';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Element name="home">
                <Home />
              </Element>
              <Element name="about">
                <About />
              </Element>
              <Element name="Menu">
                <Menu />
              </Element>
              <Element name="Contact">
                <Contact />
              </Element>
              <Element name="Location">
                <Location />
              </Element>
              <Element name="Footer">
                <Footer />
              </Element>
            </>
          }
        />
        {/* Admin login route */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Routes with Sidebar and DashboardLayout */}
        <Route
          path="/admindashboard"
          element={
            <DashboardLayout>
              <Sidebar /> {/* Sidebar component */}
            </DashboardLayout>
          }
        >
          <Route path="" element={<AdminDashboard />} /> {/* Default Admin Dashboard */}
          <Route path="adminmenu" element={<UploadMenuItem />} /> {/* Admin Menu Items */}
          <Route path="adminbookings" element={<AdminBookings />} /> {/* Admin Bookings */}
          <Route path="adminreports" element={<AdminReport />} /> {/* Admin Reports */}
          <Route path="adminpackage" element={<AdminPackage />} /> {/* Admin Packages */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;