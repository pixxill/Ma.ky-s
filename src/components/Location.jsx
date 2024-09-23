import React from 'react';
import backgroundImage from '../assets/locationbg.png'; // Replace with your actual image path

const LocationSection = () => {
  const sectionStyle = {
    height: '125vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif", // Updated font to Poppins for a modern look
    padding: '20px',
    background: `linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%), url(${backgroundImage}) no-repeat center center/cover`, // Gradient over background image
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Adds shadow to the text for better readability
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background for content
    backdropFilter: 'blur(10px)', // Adds a blur effect to the background of the content
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '1000px',
    width: '150%',
    textAlign: 'center',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)', // Adds a shadow around the content for a lifted effect
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover effects
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '25px',
    color: '#F5F7F8',
    letterSpacing: '1px',
    textTransform: 'uppercase', // Adds uppercase transformation to the text
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Additional shadow for better text contrast
    cursor: 'pointer',
    transition: 'color 0.3s ease, transform 0.3s ease', // Smooth color and transform transition
  };

  const mapContainerStyle = {
    width: '100%',
    height: '450px',
    borderRadius: '5px',
    overflow: 'hidden',
    border: '3px solid rgba(255, 255, 255, 0.5)', // Light border for map container
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)', // Adds shadow around the map container
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover effects
    marginBottom: '5px', // Margin for spacing between map and address text
  };

  const iframeStyle = {
    border: 0,
    width: '100%',
    height: '100%',
    transition: 'transform 0.3s ease', // Smooth transition for iframe hover
  };

  const addressStyle = {
    fontSize: '20px',
    marginTop: '20px',
    color: '#F5F7F8',
    fontWeight: '500', // Adds a slightly bolder font weight
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', // Adds subtle shadow for better contrast
    cursor: 'pointer',
    transition: 'color 0.3s ease, transform 0.3s ease', // Smooth transition for hover effects
  };

  return (
    <div style={sectionStyle}>
      <div
        style={contentStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5)';
        }}
      >
        <h1
          style={titleStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFD700'; // Golden color on hover
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#F5F7F8';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          YOU CAN FIND US HERE!
        </h1>
        <div
          style={mapContainerStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.4)';
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.0512078161834!2d124.01411972523729!3d10.720301658246867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a84da1d621e1f7%3A0x50742b50777a19f0!2sMA.KY&#39;s!5e0!3m2!1sen!2sph!4v1694778280172!5m2!1sen!2sph"
            style={iframeStyle}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
        <p
          style={addressStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFD700'; // Golden color on hover
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#F5F7F8';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          MA.KY's, Flores, Catmon, Cebu REGION 7, VISAYAS REGION 7, VISAYAS, 6006 Cebu
        </p>
        <p
          style={addressStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFD700'; // Golden color on hover
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#F5F7F8';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          10AM - 8PM
        </p>
      </div>
    </div>
  );
};

export default LocationSection;
