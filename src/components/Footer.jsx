import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import gcashLogo from '../assets/gcash1.png'; // Replace with your path to GCash logo
import paymayaLogo from '../assets/paymaya.png'; // Replace with your path to PayMaya logo

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '40px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center', // Center the content horizontally
        alignItems: 'center',     // Center the content vertically
      }}
    >
      {/* About Section */}
      <Box sx={{ flex: '1 1 300px', margin: '10px' }}>
        <Typography variant="h6" sx={{ borderBottom: '2px solid #715c47', display: 'inline-block', paddingBottom: '10px' }}>
          MA.KY's
        </Typography>
        <Typography variant="body2" sx={{ margin: '20px 0' }}>
          We are many variations of passages available but the majority have suffered alteration in some form by injected humour words which don’t look even slightly believable.
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          091222222
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          CatmonFlores Bai!
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          <Link href="mailto:info@example.com" sx={{ color: '#fff', textDecoration: 'none' }}>
            GwapoKaayuSiXymmer@gmail.com
          </Link>
        </Typography>
      </Box>

      {/* Opening Hours Section */}
      <Box sx={{ flex: '1 1 300px', margin: '10px', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ borderBottom: '2px solid #715c47', display: 'inline-block', paddingBottom: '10px' }}>
          Opening Hours
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          Saturday: 10AM - 09PM
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          Monday: 10AM - 09PM
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          Tuesday: 10AM - 09PM
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          Wednesday: 10AM - 09PM
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          Thursday: 10AM - 09PM
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          Friday: 10AM - 09PM
        </Typography>
        <Typography variant="body2" sx={{ margin: '10px 0' }}>
          Sunday: 12PM - 09PM
        </Typography>
      </Box>

      {/* Payment Options Section */}
      <Box sx={{ flex: '1 1 300px', margin: '10px', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ borderBottom: '2px solid #715c47', display: 'inline-block', paddingBottom: '10px' }}>
          Payment Options
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <Box sx={{ margin: '0 10px' }}>
            <img src={gcashLogo} alt="GCash" style={{ width: '60px', height: 'auto' }} />
          </Box>
          <Box sx={{ margin: '0 10px' }}>
            <img src={paymayaLogo} alt="PayMaya" style={{ width: '60px', height: 'auto' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
