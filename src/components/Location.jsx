import React from 'react';
import backgroundImage from '../assets/locationbg.png'; // Replace with your actual image path

const LocationSection = () => {
  const sectionStyle = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    background: `url(${backgroundImage}) no-repeat center center/cover`, // Adding background image
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center',

  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#F5F7F8',
  };

  const mapContainerStyle = {
    width: '100%',
    height: '450px',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const iframeStyle = {
    border: 0,
    width: '100%',
    height: '100%',
  };

  const addressStyle = {
    fontSize: '18px',
    marginTop: '20px',
    color: '#F5F7F8 ',
  };

  return (
    <div style={sectionStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>YOU CAN FIND US HERE!</h1>
        <div style={mapContainerStyle}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.0512078161834!2d124.01411972523729!3d10.720301658246867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a84da1d621e1f7%3A0x50742b50777a19f0!2sMA.KY&#39;s!5e0!3m2!1sen!2sph!4v1694778280172!5m2!1sen!2sph"
            style={iframeStyle}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
        <p style={addressStyle}>
          MA.KY's, Flores, Catmon, Cebu REGION 7, VISAYAS REGION 7, VISAYAS, 6006 Cebu
        </p>
        <p style={addressStyle}>10AM - 8PM</p>
      </div>
    </div>
  );
};

export default LocationSection;
