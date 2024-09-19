import React from 'react';
import { Link } from 'react-scroll'; // Import Link from react-scroll
import logo from '../../assets/logo.jpg';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__logo">
          <Link to="home" smooth={true} duration={500} className="header__logo-link">
            <img src={logo} alt="Logo" className="header__logo-img" />
          </Link>
        </div>
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="home" smooth={true} duration={500} className="header__nav-link">Home</Link>
            </li>
            <li className="header__nav-item">
              <Link to="about" smooth={true} duration={500} className="header__nav-link">About</Link>
            </li>
            <li className="header__nav-item">
              <Link to="Menu" smooth={true} duration={500} className="header__nav-link">Menu</Link>
            </li>
            <li className="header__nav-item">
              <Link to="Contact" smooth={true} duration={500} className="header__nav-link">Contact</Link>
            </li>
            <li className="header__nav-item">
              <Link to="Location" smooth={true} duration={500} className="header__nav-link">Location</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
