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
import DashboardLayout from './components/DashboardLayout'; // Dashboard layout component
import AdminDashboard from './components/header/AdminDashboard';
import UploadMenuItem from './components/AdminMenu';
import AdminBookings from './components/AdminBookings';
import AdminReport from './components/AdminReport';
import AdminPackage from './components/AdminPackage';
import AdminHistory from './components/AdminHistory'; // Import AdminHistory component
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
        <Route path="/admindashboard" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} /> {/* Default Admin Dashboard */}
          <Route path="adminmenu" element={<UploadMenuItem />} />
          <Route path="adminbookings" element={<AdminBookings />} />
          <Route path="adminhistory" element={<AdminHistory />} /> {/* Use adminhistory to match sidebar link */}
          <Route path="adminreports" element={<AdminReport />} />
          <Route path="adminpackage" element={<AdminPackage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
