import React from 'react';
import contactBackground from '../assets/contactbg.png'; // Replace with your actual background image path
import facebookIcon from '../assets/facebook.jpg'; // Replace with your actual icon path
import instagramIcon from '../assets/instagram.jpg'; // Replace with your actual icon path

const ContactSection = () => {
  const sectionStyle = {
    backgroundImage: `url(${contactBackground})`,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)', // Adds a blur effect for a more elegant look
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
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    borderBottom: '2px solid #a8774e', // Elegant underline effect
    display: 'inline-block',
    paddingBottom: '5px',
  };

  const detailStyle = {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#d1d1d1', // Lighter color for details
  };

  const iconContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  };

  const iconWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease', // Smooth scaling effect on hover
    '&:hover': {
      transform: 'scale(1.1)',
    },
  };

  const iconStyle = {
    width: '40px', // Increased size for better visibility
    height: '40px',
    marginRight: '10px',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease', // Smooth scaling effect on hover
  };

  const socialMediaNameStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
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
            <div style={iconWrapperStyle} onClick={() => window.open('https://www.facebook.com/MAKYS2020', '_blank')}>
              <img src={facebookIcon} alt="Facebook" style={iconStyle} />
              <span style={socialMediaNameStyle}>MA.KY'S</span>
            </div>
            <div style={iconWrapperStyle} onClick={() => window.open('https://www.instagram.com/_ma.kys/', '_blank')}>
              <img src={instagramIcon} alt="Instagram" style={iconStyle} />
              <span style={socialMediaNameStyle}>MA.KY'S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
