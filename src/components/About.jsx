import React from 'react';
import contentImage from '../assets/background.jpg'; // Replace with your actual image path
import backgroundImage from '../assets/aboutbg.png'; // Replace with the content image path

const CoffeeHouseSection = () => {
  const sectionStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`, // Background image with overlay
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally and vertically
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px', // Optional padding for smaller screens
  };

  const contentStyle = {
    display: 'flex', // Flex container for text and image
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center items horizontally
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '800px',
  };

  const imageStyle = {
    width: '300px', // Image width
    height: '300px', // Image height
    borderRadius: '8px',
    marginRight: '20px', // Space between image and text
    objectFit: 'cover',
  };

  const textStyle = {
    maxWidth: '450px',
    textAlign: 'left', // Align text to the left within the container
  };

  const headingStyle = {
    fontSize: '32px',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  const subHeadingStyle = {
    fontSize: '24px',
    marginBottom: '10px',
  };

  const paragraphStyle = {
    fontSize: '16px',
    lineHeight: '1.6',
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
          <h2 style={headingStyle}>ABOUT US</h2>
          <h3 style={subHeadingStyle}>Fresh Quality And Organic Tasty Coffee House For You</h3>
          <p style={paragraphStyle}>
            These are many variations of passages of Lorem Ipsum available. 
            Get your daily dose of energy and refreshment with our carefully curated 
            selection of organic coffee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoffeeHouseSection;
