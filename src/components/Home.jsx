import React, { useState } from 'react';
import backgroundImage from '../assets/background.jpg';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';

// Image imports for the packages modal
import packageImage1 from '../assets/package1.png';
import packageImage2 from '../assets/package2.png';
import packageImage3 from '../assets/package3.png';
import packageImage4 from '../assets/package4.png'; // New image import
import packageImage5 from '../assets/package5.png'; // New image import

const Home = () => {
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false); 
  const [errors, setErrors] = useState({});
  const [bookingData, setBookingData] = useState({
    first_name: '',
    last_name: '',
    contact_number: '',
    email_address: '',
    package: '',
    date: '',
    time: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({}); // Clear errors on close
    setBookingData({  // Clear the form data on close
      first_name: '',
      last_name: '',
      contact_number: '',
      email_address: '',
      package: '',
      date: '',
      time: '',
    });
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  const handlePackagesOpen = () => {
    setPackagesOpen(true);
  };

  const handlePackagesClose = () => {
    setPackagesOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!bookingData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!bookingData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!bookingData.contact_number.trim()) newErrors.contact_number = 'Contact number is required';
    if (!bookingData.email_address.trim()) newErrors.email_address = 'Email address is required';
    if (!bookingData.package) newErrors.package = 'Package selection is required';
    if (!bookingData.date) newErrors.date = 'Date is required';
    if (!bookingData.time) newErrors.time = 'Time slot selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (!validateForm()) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const response = await fetch('https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json');
      
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Failed to fetch bookings. Status:', response.status, 'Details:', errorDetails);
        alert('Error fetching bookings: ' + errorDetails.message);
        throw new Error('Network response was not ok');
      }
  
      const bookings = await response.json();
  
      const existingNumbers = bookings ? Object.keys(bookings).map((key) => parseInt(key.replace('ID_', ''))) : [];
  
      // Generate a unique 3-digit ID
      const uniqueId = generateUniqueId(existingNumbers);
  
      const currentDateTime = new Date().toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
  
      const newBooking = {
        ...bookingData,
        date_time: currentDateTime,
      };
  
      const postResponse = await fetch(`https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/bookings/${uniqueId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      });
  
      if (!postResponse.ok) {
        const errorDetails = await postResponse.json();
        console.error('Failed to submit booking. Status:', postResponse.status, 'Details:', errorDetails);
        alert('Error submitting booking: ' + errorDetails.message);
        throw new Error('Network response was not ok');
      }
  
      const data = await postResponse.json();
      console.log('Booking successful:', data);
      setConfirmationOpen(true);

      // Reset the booking form after successful submission
      setBookingData({
        first_name: '',
        last_name: '',
        contact_number: '',
        email_address: '',
        package: '',
        date: '',
        time: '',
      });
  
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  
    handleClose();
  };

  const sendConfirmationEmail = (email, bookingDetails) => {
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      to_name: `${bookingDetails.first_name} ${bookingDetails.last_name}`,
      to_email: email,
      booking_date: bookingDetails.date,
      booking_time: bookingDetails.time,
      booking_package: bookingDetails.package,
    }, 'YOUR_USER_ID')
    .then((response) => {
      console.log('Email sent successfully:', response.status, response.text);
    }, (error) => {
      console.error('Failed to send email:', error);
    });
  };
  
  const generateUniqueId = (existingNumbers) => {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Generate 3-digit random number
    } while (existingNumbers.includes(parseInt(randomId))); // Ensure ID is unique
    return `ID_${randomId}`;
  };

  const homeStyle = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '50px',
    color: '#fff',
    fontFamily: "'Roboto', san-serif",
  };

  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.9,
    zIndex: -1,
  };

  const overlayStyle = {
    position: 'fixed',
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
    padding: '12px 36px',
    backgroundColor: 'transparent',
    color: '#F5EFFF',
    border: '2px solid #F5EFFF',
    borderRadius: '100px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.3s ease',
    marginTop: '100px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const buttonHoverStyle = {
    backgroundColor: '#333',
    color: '#fff',
  };

  const dialogStyle = {
    padding: '30px 40px',
    borderRadius: '20px',
    backgroundColor: '#EDE8DC',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.2)',
    color: '#333',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  };

  const titleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '28px',
    fontWeight: 800,
    textAlign: 'center',
    color: '#333',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ccc',
  };

  const textFieldStyle = {
    marginBottom: '15px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f9f9f9',
      color: '#333',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#ccc',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#aaa',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#555',
    },
  };

  const dialogActionsStyle = {
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  };

  const dialogButtonStyle = {
    background: 'linear-gradient(90deg, #5E5368, #000000)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '15px',
    fontWeight: 'bold',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      background: 'linear-gradient(90deg, #3f2b96, #6a5acd)',
    },
  };

  const packageImageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '15px',
    marginBottom: '15px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Add more shadow on hover
    },
  };

  return (
    <div style={homeStyle}>
      <div style={backgroundStyle} />
      <div style={overlayStyle} />

      <div style={contentStyle}>
        <h1 style={headingStyle}> MA.KY's!</h1>
        <h2 style={subHeadingStyle}>Discover Amazing Coffee House & Get Energy</h2>
        <button
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
            e.currentTarget.style.color = buttonHoverStyle.color;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
            e.currentTarget.style.color = buttonStyle.color;
          }}
          onClick={handleClickOpen}
        >
          Book now!
        </button>
        <button
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
            e.currentTarget.style.color = buttonHoverStyle.color;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor;
            e.currentTarget.style.color = buttonStyle.color;
          }}
          onClick={handlePackagesOpen}
        >
          Packages
        </button>
      </div>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: dialogStyle }}>
        <DialogTitle>
          <Typography style={titleStyle}>Fill Out Your Details</Typography>
        </DialogTitle>
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
            error={!!errors.first_name} // Show error if there's a validation issue
            helperText={errors.first_name} // Display error message
            style={textFieldStyle}
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
            error={!!errors.last_name}
            helperText={errors.last_name}
            style={textFieldStyle}
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
            error={!!errors.contact_number}
            helperText={errors.contact_number}
            style={textFieldStyle}
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
            error={!!errors.email_address}
            helperText={errors.email_address}
            style={textFieldStyle}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            name="date"
            value={bookingData.date}
            onChange={handleInputChange}
            error={!!errors.date}
            helperText={errors.date}
            style={textFieldStyle}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense" style={textFieldStyle} error={!!errors.time}>
            <InputLabel id="time-slot-label">Time Slot</InputLabel>
            <Select
              labelId="time-slot-label"
              label="Time Slot"
              name="time"
              value={bookingData.time}
              onChange={handleInputChange}
              variant="outlined"
              style={{ backgroundColor: '#EDE8DC', color: '#000000' }}
            >
              <MenuItem value="8:00 AM - 11:00 AM">8:00 AM - 11:00 AM</MenuItem>
              <MenuItem value="1:00 PM - 5:00 PM">1:00 PM - 5:00 PM</MenuItem>
            </Select>
            <Typography variant="caption" color="error">
              {errors.time}
            </Typography>
          </FormControl>
          <FormControl fullWidth margin="dense" style={textFieldStyle} error={!!errors.package}>
            <InputLabel id="package-label">Package</InputLabel>
            <Select
              labelId="package-label"
              label="Package"
              name="package"
              value={bookingData.package}
              onChange={handleInputChange}
              variant="outlined"
              style={{ backgroundColor: '#EDE8DC', color: '#00000' }}
            >
              <MenuItem value="3000Php">3000Php</MenuItem>
              <MenuItem value="4000Php">4000Php</MenuItem>
              <MenuItem value="VIP Package">VIP Package</MenuItem>
            </Select>
            <Typography variant="caption" color="error">
              {errors.package}
            </Typography>
          </FormControl>
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleClose} style={dialogButtonStyle}>Cancel</Button>
          <Button onClick={handleBooking} style={dialogButtonStyle}>Book Now</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onClose={handleConfirmationClose} PaperProps={{ style: dialogStyle }}>
        <DialogTitle>
          <Typography style={titleStyle}>Booking Confirmed!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Your booking has been successfully completed!</Typography>
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleConfirmationClose} style={dialogButtonStyle}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Packages Dialog */}
      <Dialog open={packagesOpen} onClose={handlePackagesClose} PaperProps={{ style: dialogStyle }}>
        <DialogTitle>
          <Typography style={titleStyle}>Our Packages</Typography>
        </DialogTitle>
        <DialogContent>
          <img src={packageImage1} alt="Basic Package" style={packageImageStyle} />
          <img src={packageImage2} alt="Premium Package" style={packageImageStyle} />
          <img src={packageImage3} alt="VIP Package" style={packageImageStyle} />
          <img src={packageImage4} alt="Exclusive Package" style={packageImageStyle} /> {/* New image added */}
          <img src={packageImage5} alt="Luxury Package" style={packageImageStyle} /> {/* New image added */}
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handlePackagesClose} style={dialogButtonStyle}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
