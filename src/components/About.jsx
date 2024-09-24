import React from 'react';
import contentImage from '../assets/background.jpg'; // Replace with your actual image path
import backgroundImage from '../assets/aboutbg.jpeg'; // Replace with your actual background image path

const CoffeeHouseSection = () => {
  const sectionStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh', // Changed height to min-height for better content flexibility
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif", // Use a more elegant font family
    padding: '40px 20px',
    opacity: 0.9,
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight transparent background for contrast
    borderRadius: '16px',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)', // More pronounced shadow for a lifted effect
    maxWidth: '1100px',
    width: '100%',
    padding: '40px',
  };

  const imageStyle = {
    width: '400px',
    height: 'auto',
    borderRadius: '12px',
    marginRight: '40px',
    objectFit: 'cover',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', // Shadow effect on the image
  };

  const textStyle = {
    maxWidth: '600px',
    color: '#ddd',
  };

  const headingStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#EDE8DC', // Gold color for headings to match a coffee theme
    textTransform: 'uppercase',
    marginBottom: '20px',
  };

  const subHeadingStyle = {
    fontSize: '36px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '20px',
    lineHeight: '1.2',
  };

  const paragraphStyle = {
    fontSize: '18px',
    lineHeight: '1.8',
    marginBottom: '20px',
  };

  const listStyle = {
    fontSize: '16px',
    lineHeight: '1.8',
    listStyle: 'none',
    paddingLeft: '0',
    marginBottom: '30px',
  };

  const listItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const listIconStyle = {
    color: '#EDE8DC', // Gold checkmark
    fontSize: '20px',
    marginRight: '10px',
  };

  const buttonStyle = {
    padding: '12px 30px',
    backgroundColor: '#a8774e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  return (
    <div style={sectionStyle}>
      <div style={contentStyle}>
        <img
          src={contentImage} // Replace with your content image
          alt="Coffee House"
          style={imageStyle}
        />
        <div style={textStyle}>
          <h2 style={headingStyle}>About Us</h2>
          <h3 style={subHeadingStyle}>
          Discover Our Premium, Handcrafted Blends Perfectly Brewed Just for You!
          </h3>
          <p style={paragraphStyle}>
          Indulge in the finest selection of organic coffee, where every sip is a journey of rich flavors and aromas. Join us at MA.KY's, the ultimate destination for coffee lovers who crave the extraordinary. 
          </p>
          <ul style={listStyle}>
            <li style={listItemStyle}>
              <span style={listIconStyle}>✔</span> Ethically sourced beans, roasted to perfection.
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>✔</span> Enjoy a cozy ambiance and exceptional service.
            </li>
            <li style={listItemStyle}>
              <span style={listIconStyle}>✔</span> From bean to cup, quality is our commitment.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoffeeHouseSection;
