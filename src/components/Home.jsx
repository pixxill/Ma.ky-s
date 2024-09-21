import React, { useState } from 'react';
import backgroundImage from '../assets/background.jpg';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const Home = () => {
  const [open, setOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    first_name: '',
    last_name: '',
    contact_number: '',
    email_address: '',
    package: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleBooking = () => {
    const currentDateTime = new Date().toLocaleString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newBooking = {
      [`ID_${Math.floor(1000 + Math.random() * 9000)}`]: {
        ...bookingData,
        date_time: currentDateTime,
      }
    };

    console.log(newBooking);

    handleClose();
  };

  const homeStyle = {
    position: 'relative',
    minHeight: '100vh', // Ensures the Home component takes up the full height of the viewport
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '50px',
    color: '#fff',
    fontFamily: "'Lobster', sans-serif",
  };

  const backgroundStyle = {
    position: 'fixed', // Ensures the background stays fixed even when scrolling
    top: 0,
    left: 0,
    width: '100vw', // Covers the entire viewport width
    height: '100vh', // Covers the entire viewport height
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat', // Prevents the image from repeating
    opacity: 0.9,
    zIndex: -1,
  };

  const overlayStyle = {
    position: 'fixed', // Ensures the overlay stays fixed even when scrolling
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: -1,
  };

  const contentStyle = {
    maxWidth: '550px',
    textAlign: 'left',
    zIndex: 1,
  };

  const headingStyle = {
    fontSize: '54px',
    marginBottom: '20px',
    fontWeight: 'bold',
    lineHeight: '1.1',
  };

  const subHeadingStyle = {
    fontSize: '48px',
    marginBottom: '25px',
    lineHeight: '1.3',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#FFFFFF',
    color: '#000',
    border: '1px solid #fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '15px',
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
          onClick={handleClickOpen}
        >
          Book now!
        </button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Book a Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            name="first_name"
            value={bookingData.first_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            name="last_name"
            value={bookingData.last_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Contact Number"
            type="text"
            fullWidth
            variant="outlined"
            name="contact_number"
            value={bookingData.contact_number}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            name="email_address"
            value={bookingData.email_address}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="package-label">Package</InputLabel>
            <Select
              labelId="package-label"
              label="Package"
              name="package"
              value={bookingData.package}
              onChange={handleInputChange}
              variant="outlined"
            >
              <MenuItem value="Basic Package">Basic Package</MenuItem>
              <MenuItem value="Premium Package">Premium Package</MenuItem>
              <MenuItem value="Deluxe Package">Deluxe Package</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleBooking} color="primary">Book Now</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
