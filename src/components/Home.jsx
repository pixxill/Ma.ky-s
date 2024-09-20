import React, { useState } from 'react';
import backgroundImage from '../assets/background.jpg'; // Adjust the path if necessary
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'; // Import Material-UI components

const Home = () => {
  const [open, setOpen] = useState(false); // State to control the modal

  // Function to handle opening the modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setOpen(false);
  };

  const homeStyle = {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '50px',
    color: '#fff',
    fontFamily: "'Lobster', sans-serif",
  };

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.70, // Set background opacity to %
    zIndex: -1,
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for better text visibility
    zIndex: -1,
  };

  const contentStyle = {
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1,
  };

  const headingStyle = {
    fontSize: '48px',
    marginBottom: '20px',
    fontWeight: 'bold',
  };

  const subHeadingStyle = {
    fontSize: '32px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#F5F7F8',
    color: '#001524',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#838383',
  };

  return (
    <div style={homeStyle}>
      <div style={backgroundStyle} />
      <div style={overlayStyle} />
      <div style={contentStyle}>
        <h1 style={headingStyle}>Welcome to MA.KY's!</h1>
        <h2 style={subHeadingStyle}>Discover Amazing Coffee House & Get Energy</h2>
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
          onClick={handleClickOpen} // Open the modal on button click
        >
          Book now!
        </button>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Book a Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Your Email"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Number of People"
            type="number"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Preferred Date & Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }} // To ensure the label doesn't overlap the value
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleClose} color="primary">Book Now</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
