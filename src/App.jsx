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
import AdminLogin from './components/AdminLogin'; // Import the new AdminLogin component
import AdminDashboard from './components/header/AdminDashboard';
import AdminMenu from './components/AdminMenu'
import '@fontsource/roboto';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
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
        } />
        <Route path="/admin" element={<AdminLogin />} /> {/* Admin login route */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/menu" element={<AdminMenu />} />
      </Routes>
    </Router>
  );
};

export default App;
