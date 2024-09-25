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
  Typography,
} from '@mui/material';

// Image imports for the packages modal
import packageImage1 from '../assets/package1.png';
import packageImage2 from '../assets/package2.png';
import packageImage3 from '../assets/package3.png';
import packageImage4 from '../assets/package4.png';
import packageImage5 from '../assets/package5.png';

const Home = () => {
  const [open, setOpen] = useState(false);
  const [bookingConfirmationOpen, setBookingConfirmationOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false); 
  const [bookingData, setBookingData] = useState({
    first_name: '',
    last_name: '',
    contact_number: '',
    email_address: '',
    package: '',
    date: '',
    time: '',
  });

  // State for tracking form errors
  const [formErrors, setFormErrors] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBookingConfirmationOpen(false);
    resetBookingForm(); // Reset form data when the dialog is closed
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
    // For contact_number field, allow only numbers and restrict length to 11 digits
    if (name === 'contact_number') {
      if (/^\d{0,11}$/.test(value)) {
        setBookingData({ ...bookingData, [name]: value });
      }
    } else {
      setBookingData({ ...bookingData, [name]: value });
    }
    // Clear the error for this field when it is updated
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Function to reset the booking form
  const resetBookingForm = () => {
    setBookingData({
      first_name: '',
      last_name: '',
      contact_number: '',
      email_address: '',
      package: '',
      date: '',
      time: '',
    });
    setFormErrors({});
  };

  // Function to generate a unique 3-digit random ID
  const generateUniqueId = (existingNumbers) => {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); 
    } while (existingNumbers.includes(parseInt(randomId))); 
    return `ID_${randomId}`;
  };

  // Function to check for required fields
  const validateForm = () => {
    const errors = {};
    if (!bookingData.first_name.trim()) errors.first_name = 'First Name is required';
    if (!bookingData.last_name.trim()) errors.last_name = 'Last Name is required';
    if (!bookingData.contact_number.trim() || bookingData.contact_number.length !== 11) {
      errors.contact_number = 'Contact Number must be 11 digits';
    }
    if (!bookingData.email_address.trim()) errors.email_address = 'Email Address is required';
    if (!bookingData.package.trim()) errors.package = 'Package selection is required';
    if (!bookingData.date.trim()) errors.date = 'Date is required';
    if (!bookingData.time.trim()) errors.time = 'Time slot is required';
    return errors;
  };

  const handleBooking = async () => {
    setBookingConfirmationOpen(false); 

    try {
      const response = await fetch('https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json');
      
      if (!response.ok) {
        const errorDetails = await response.json();
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
        alert('Error submitting booking: ' + errorDetails.message);
        throw new Error('Network response was not ok');
      }
  
      const data = await postResponse.json();
      console.log('Booking successful:', data);
      setConfirmationOpen(true);

      // Send confirmation email after successful booking via an API call
      await fetch('http://localhost:5000/send-email', { // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      // Reset the booking form after successful submission
      resetBookingForm();
  
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  
    handleClose();
  };

  const handleBookingConfirmationOpen = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setBookingConfirmationOpen(true);
    }
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
            style={textFieldStyle}
            error={!!formErrors.first_name}
            helperText={formErrors.first_name}
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
            style={textFieldStyle}
            error={!!formErrors.last_name}
            helperText={formErrors.last_name}
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
            style={textFieldStyle}
            error={!!formErrors.contact_number}
            helperText={formErrors.contact_number}
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
            style={textFieldStyle}
            error={!!formErrors.email_address}
            helperText={formErrors.email_address}
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
            style={textFieldStyle}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!formErrors.date}
            helperText={formErrors.date}
          />
          <FormControl fullWidth margin="dense" style={textFieldStyle} error={!!formErrors.time}>
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
            {formErrors.time && <Typography color="error">{formErrors.time}</Typography>}
          </FormControl>
          <FormControl fullWidth margin="dense" style={textFieldStyle} error={!!formErrors.package}>
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
            {formErrors.package && <Typography color="error">{formErrors.package}</Typography>}
          </FormControl>
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleClose} style={dialogButtonStyle}>Cancel</Button>
          <Button onClick={handleBookingConfirmationOpen} style={dialogButtonStyle}>Next</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={bookingConfirmationOpen} onClose={() => setBookingConfirmationOpen(false)} PaperProps={{ style: dialogStyle }}>
        <DialogTitle>
          <Typography style={titleStyle}>Confirm Your Booking</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Please review your booking details:
          </Typography>
          <Typography variant="body1"><strong>First Name:</strong> {bookingData.first_name}</Typography>
          <Typography variant="body1"><strong>Last Name:</strong> {bookingData.last_name}</Typography>
          <Typography variant="body1"><strong>Contact Number:</strong> {bookingData.contact_number}</Typography>
          <Typography variant="body1"><strong>Email Address:</strong> {bookingData.email_address}</Typography>
          <Typography variant="body1"><strong>Date:</strong> {bookingData.date}</Typography>
          <Typography variant="body1"><strong>Time Slot:</strong> {bookingData.time}</Typography>
          <Typography variant="body1"><strong>Package:</strong> {bookingData.package}</Typography>
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={() => setBookingConfirmationOpen(false)} style={dialogButtonStyle}>Back</Button>
          <Button onClick={handleBooking} style={dialogButtonStyle}>Confirm Booking</Button>
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
          <img src={packageImage4} alt="Exclusive Package" style={packageImageStyle} />
          <img src={packageImage5} alt="Luxury Package" style={packageImageStyle} />
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handlePackagesClose} style={dialogButtonStyle}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Style Definitions
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', 
  },
};

export default Home;
