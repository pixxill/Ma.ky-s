import React from 'react';
import contactBackground from '../assets/contactbg.png';
import facebookIcon from '../assets/facebook.png';
import instagramIcon from '../assets/instagram.png';

const ContactSection = () => {
  const sectionStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${contactBackground})`, // Dark overlay for better text contrast
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    color: '#fff', // White text for better readability
    fontFamily: "'Poppins', sans-serif",
    padding: '20px',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Semi-transparent background
    backdropFilter: 'blur(10px)', // Blurred background effect
    padding: '50px',
    borderRadius: '20px',
    maxWidth: '900px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)', // Darker shadow for better definition
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover effects
  };

  const contactDetailsStyle = {
    flex: 1,
    padding: '20px',
    color: '#EDE8DC', // Lighter text color for better contrast
  };

  const socialMediaStyle = {
    flex: 1,
    padding: '20px',
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '20px',
    borderBottom: '3px solid #EDE8DC', // Gold underline effect
    display: 'inline-block',
    paddingBottom: '8px',
    textTransform: 'uppercase', // Uppercase for better emphasis
    letterSpacing: '1px', // Adds spacing between letters
    color: '#EDE8DC', // Golden color for headings
  };

  const detailStyle = {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#EDE8DC', // Lighter color for details
    letterSpacing: '0.5px',
    transition: 'color 0.3s ease', // Smooth color transition
  };

  const iconContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
  };

  const iconWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth scaling and shadow effect on hover
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 10px 20px rgba(255, 255, 255, 0.5)', // Brighter shadow on hover
    },
  };

  const iconStyle = {
    width: '60px', // Increased size for better visibility
    height: '60px',
    marginRight: '15px',
    borderRadius: '50%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Darker shadow for a sharper look
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
  };

  const socialMediaNameStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#EDE8DC', // Golden color for social media names
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', // Text shadow for depth
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
        <div style={contactDetailsStyle}>
          <h2 style={headingStyle}>CONTACT DETAILS</h2>
          <p
            style={detailStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFD700'; // Golden color on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ddd';
            }}
          >
            rigieresad@yahoo.com
          </p>
          <p
            style={detailStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFD700'; // Golden color on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ddd';
            }}
          >
            0992 572 1871
          </p>
        </div>
        <div style={socialMediaStyle}>
          <h2 style={headingStyle}>SOCIAL MEDIA</h2>
          <div style={iconContainerStyle}>
            <div
              style={iconWrapperStyle}
              onClick={() => window.open('https://www.facebook.com/MAKYS2020', '_blank')}
            >
              <img src={facebookIcon} alt="Facebook" style={iconStyle} />
              <span style={socialMediaNameStyle}>MA.KY'S</span>
            </div>
            <div
              style={iconWrapperStyle}
              onClick={() => window.open('https://www.instagram.com/_ma.kys/', '_blank')}
            >
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
