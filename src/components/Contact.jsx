import React from 'react';
import contactBackground from '../assets/contactbg.png' // Replace with your actual background image path
import facebookIcon from '../assets/facebook.jpg'; // Replace with your actual icon path
import instagramIcon from '../assets/instagram.jpg'; // Replace with your actual icon path

const ContactSection = () => {
  const sectionStyle = {
    backgroundImage: `url(${contactBackground})`, // Background image for the contact section
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent background
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '900px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
  };

  const contactDetailsStyle = {
    flex: 1,
    marginRight: '20px',
  };

  const socialMediaStyle = {
    flex: 1,
    marginLeft: '20px',
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const detailStyle = {
    fontSize: '18px',
    marginBottom: '10px',
  };

  const iconContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const iconStyle = {
    width: '30px',
    height: '30px',
    marginBottom: '10px',
    cursor: 'pointer',
  };

  return (
    <div style={sectionStyle}>
      <div style={contentStyle}>
        <div style={contactDetailsStyle}>
          <h2 style={headingStyle}>CONTACT DETAILS</h2>
          <p style={detailStyle}>rigieresad@yahoo.com</p>
          <p style={detailStyle}>0992 572 1871</p>
        </div>
        <div style={socialMediaStyle}>
          <h2 style={headingStyle}>SOCIAL MEDIA</h2>
          <div style={iconContainerStyle}>
            <div>
              <img
                src={facebookIcon} // Replace with your Facebook icon path
                alt="Facebook"
                style={iconStyle}
                onClick={() => window.open('https://www.facebook.com', '_blank')}
              />
              <span style={detailStyle}>MA.KY'S</span>
            </div>
            <div>
              <img
                src={instagramIcon} // Replace with your Instagram icon path
                alt="Instagram"
                style={iconStyle}
                onClick={() => window.open('https://www.instagram.com', '_blank')}
              />
              <span style={detailStyle}>MA.KY'S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
