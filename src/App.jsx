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
import AdminDashboard from './components/header/AdminDashboard';
import AdminMenu from './components/AdminMenu';
import AdminBookings from './components/AdminBookings';
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

        {/* Admin Routes with DashboardLayout */}
        <Route path="/admindashboard" element={<DashboardLayout />}>
          <Route path="" element={<AdminDashboard />} /> {/* Default Admin Dashboard */}
          <Route path="menu" element={<AdminMenu />} /> {/* Admin Menu */}
          <Route path="adminbookings" element={<AdminBookings />} /> {/* Admin Bookings */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
