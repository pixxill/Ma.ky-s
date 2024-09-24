import React from 'react';
import { Box, Typography, Link } from '@mui/material';

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
        justifyContent: 'space-between',
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
      <Box sx={{ flex: '1 1 50px', margin: '20px' }}>
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
    </Box>
  );
};

export default Footer;
