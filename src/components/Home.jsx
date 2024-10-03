import React, { useState, useEffect } from 'react';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

import GcashIcon from '../assets/gcash.png';
import TransferIcon from '../assets/transfer.png';
import packageImage1 from '../assets/package1.png';
import packageImage2 from '../assets/package2.png';
import packageImage3 from '../assets/package3.png';
import packageImage4 from '../assets/package4.png';
import packageImage5 from '../assets/package5.png';

const Home = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [packageSelectionOpen, setPackageSelectionOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [prevState, setPrevState] = useState(''); 
  const [bookingData, setBookingData] = useState({
    first_name: '',
    last_name: '',
    contact_number: '',
    email_address: '',
    package: '',
    date: '',
    time: '',
    payment_method: '',
    receipt: null,
  });
  const [errors, setErrors] = useState({});
  const [availableTimeSlots, setAvailableTimeSlots] = useState(['8:00 AM - 11:00 AM', '1:00 PM - 5:00 PM']);
  const [idImage, setIdImage] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  const handleClickOpen = () => {
    clearFormData();
    setPrevState('calendar'); 
    setCalendarOpen(true); 
  };

  const storage = getStorage();

  const uploadReceiptImage = async (file) => {
    const receiptRef = storageRef(storage, `receipts/${file.name}`);
    await uploadBytes(receiptRef, file);
    const downloadURL = await getDownloadURL(receiptRef);
    return downloadURL;
  };

  const uploadIDImage = async (file) => {
    const idImageRef = storageRef(storage, `id_images/${file.name}`);
    await uploadBytes(idImageRef, file);
    const downloadURL = await getDownloadURL(idImageRef);
    return downloadURL;
  };

  const handleClose = () => {
    setCalendarOpen(false);
    setFormOpen(false);
    setConfirmationOpen(false);
    setSuccessOpen(false);
    setPackageSelectionOpen(false);
    setErrors({});
    clearFormData();
  };

  const handleBack = () => {
    switch (prevState) {
      case 'calendar':
        setCalendarOpen(true);
        setFormOpen(false);
        setConfirmationOpen(false);
        break;
      case 'form':
        setFormOpen(true);
        setCalendarOpen(false);
        setConfirmationOpen(false);
        break;
      case 'confirmation':
        setFormOpen(true);
        setConfirmationOpen(false);
        break;
      default:
        handleClose();
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'id_image') {
      const file = files[0];
      setIdImage(file);
      setIdPreview(URL.createObjectURL(file));
    } else if (name === 'receipt') {
      const file = files[0];
      setBookingData({ ...bookingData, receipt: file });
      setReceiptPreview(URL.createObjectURL(file));
    } else {
      setBookingData({ ...bookingData, [name]: value });
    }
  };

  const clearFormData = () => {
    setBookingData({
      first_name: '',
      last_name: '',
      contact_number: '',
      email_address: '',
      package: '',
      date: '',
      time: '',
      payment_method: '',
      receipt: null,
    });
    setIdImage(null);
    setIdPreview(null);
    setReceiptPreview(null);
    setErrors({});
  };

  const handleDateSelection = async (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    setBookingData({ ...bookingData, date: formattedDate });

    const response = await fetch(`https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json`);
    const bookings = await response.json();
    const bookedSlots = Object.values(bookings || {}).filter(booking => booking.date === formattedDate).map(booking => booking.time);

    setAvailableTimeSlots(['8:00 AM - 11:00 AM', '1:00 PM - 5:00 PM'].filter(slot => {
      return bookedSlots.filter(time => time === slot).length < 2;
    }));

    setCalendarOpen(false);
    setFormOpen(true);
    setPrevState('form');
  };

  const handlePackageSelectionOpen = () => {
    setPackageSelectionOpen(true);
  };

  const handlePackageSelect = (selectedPackage) => {
    setBookingData({ ...bookingData, package: selectedPackage });
    setPackageSelectionOpen(false);
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!bookingData.first_name.trim()) validationErrors.first_name = "First Name is required.";
    if (!bookingData.last_name.trim()) validationErrors.last_name = "Last Name is required.";
    if (!bookingData.contact_number.trim()) {
      validationErrors.contact_number = "Contact Number is required.";
    } else if (bookingData.contact_number.length !== 11) {
      validationErrors.contact_number = "Contact Number must be 11 digits.";
    }
    if (!bookingData.email_address.trim()) {
      validationErrors.email_address = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(bookingData.email_address)) {
      validationErrors.email_address = "Email Address is invalid.";
    }
    if (!bookingData.date) validationErrors.date = "Date is required.";
    if (!bookingData.time) validationErrors.time = "Time Slot is required.";
    if (!bookingData.package) validationErrors.package = "Package is required.";
    if (!idImage) validationErrors.id_image = "ID image is required.";

    return validationErrors;
  };

  const handleFormNext = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      const isAvailable = await checkBookingAvailability(bookingData.date, bookingData.time);
      if (isAvailable) {
        setPrevState('confirmation');
        setFormOpen(false);
        setConfirmationOpen(true);
      } else {
        alert("The selected date and time slot is no longer available. Please choose a different time.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleConfirmNext = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      if (!bookingData.payment_method) {
        setErrors({ payment_method: 'Payment method is required' });
        return;
      }
      if (!bookingData.receipt) {
        setErrors({ receipt: 'Receipt upload is required' });
        return;
      }
      const isAvailable = await checkBookingAvailability(bookingData.date, bookingData.time);
      if (isAvailable) {
        handleBooking();
      } else {
        alert("The selected date and time slot is no longer available. Please choose a different time.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  const checkBookingAvailability = async (date, time) => {
    const response = await fetch(`https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json`);
    const bookings = await response.json();
    const filteredBookings = Object.values(bookings || {}).filter(
      (booking) => booking.date === date && booking.time === time
    );
    return filteredBookings.length < 2;
  };

  const handleBooking = async () => {
    try {
      const isAvailable = await checkBookingAvailability(bookingData.date, bookingData.time);
      if (!isAvailable) {
        alert("The selected date and time slot is no longer available. Please choose a different time.");
        return;
      }

      let receiptURL = null;
      let idImageURL = null;

      if (bookingData.receipt) {
        receiptURL = await uploadReceiptImage(bookingData.receipt);
      }

      if (idImage) {
        idImageURL = await uploadIDImage(idImage);
      }

      const response = await fetch('https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json');
      const bookings = await response.json();
      const existingNumbers = bookings ? Object.keys(bookings).map((key) => parseInt(key.replace('ID_', ''))) : [];
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
        receipt_url: receiptURL,
        id_image_url: idImageURL,
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

      setSuccessOpen(true);
      clearFormData();
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  const generateUniqueId = (existingNumbers) => {
    let newId;
    do {
      newId = 'ID_' + Math.floor(Math.random() * 900 + 100);
    } while (existingNumbers.includes(newId));
    return newId;
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
      </div>

      {/* Calendar Modal */}
      <Dialog open={calendarOpen} onClose={handleClose} PaperProps={{ style: dialogStyle }}>
        <DialogTitle>
          <Typography style={titleStyle}>Select Booking Date</Typography>
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar onChange={handleDateSelection} />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleClose} style={dialogButtonStyleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Form Modal */}
      <Dialog open={formOpen} onClose={handleClose} PaperProps={{ style: dialogStyle }}>
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
            error={!!errors.first_name}
            helperText={errors.first_name}
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
            inputProps={{ maxLength: 11 }}
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
            disabled
          />
          <FormControl fullWidth margin="dense" error={!!errors.time} style={textFieldStyle}>
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
              {availableTimeSlots.map(slot => (
                <MenuItem value={slot} key={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
            {errors.time && <Typography style={{ color: 'red', marginTop: '5px' }}>{errors.time}</Typography>}
          </FormControl>
          <Button
            variant="outlined"
            style={packageButtonStyle}
            onClick={handlePackageSelectionOpen}
          >
            Select Package
          </Button>
          <Typography variant="body1" style={{ marginTop: '10px', color: errors.package ? 'red' : 'black' }}>
            {errors.package ? errors.package : `Selected Package: ${bookingData.package}`}
          </Typography>

          <Button
            variant="contained"
            component="label"
            style={{ marginTop: '20px' }}
          >
            Validate ID
            <input
              type="file"
              accept="image/*"
              name="id_image"
              onChange={handleInputChange}
              hidden
            />
          </Button>
          {errors.id_image && (
            <Typography color="error">{errors.id_image}</Typography>
          )}
          {idPreview && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Typography variant="h6">ID Image Preview:</Typography>
              <img
                src={idPreview}
                alt="ID Preview"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleBack} style={dialogButtonStyleBack}>Back</Button>
          <Button onClick={handleClose} style={dialogButtonStyleCancel}>Cancel</Button>
          <Button onClick={handleFormNext} style={dialogButtonStyleNext}>Next</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Confirmation Modal with Payment Details */}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} PaperProps={{ style: dialogStyle }}>
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

          {/* Payment Form */}
          <FormControl fullWidth margin="dense" error={!!errors.payment_method} style={textFieldStyle}>
            <InputLabel id="payment-method-label">Mode of Payment</InputLabel>
            <Select
              labelId="payment-method-label"
              label="Mode of Payment"
              name="payment_method"
              value={bookingData.payment_method}
              onChange={handleInputChange}
              variant="outlined"
              style={{ backgroundColor: '#EDE8DC', color: '#00000' }}
            >
              <MenuItem value="Gcash">
                <img src={GcashIcon} alt="Gcash" style={paymentIconStyle} />
                Gcash
              </MenuItem>
              <MenuItem value="Bank Transfer">
                <img src={TransferIcon} alt="Bank Transfer" style={paymentIconStyle} />
                Bank Transfer
              </MenuItem>
            </Select>
            {errors.payment_method && <Typography color="error">{errors.payment_method}</Typography>}
          </FormControl>

          {/* Payment Method Info Note */}
          {bookingData.payment_method === 'Gcash' && (
            <Typography variant="body1" style={{ margin: '10px 0', color: '#333' }}>
              <strong>Gcash Number: </strong>1234-567-890
            </Typography>
          )}
          {bookingData.payment_method === 'Bank Transfer' && (
            <Typography variant="body1" style={{ margin: '10px 0', color: '#333' }}>
              <strong>Bank Transfer Number: </strong>0987-654-321
            </Typography>
          )}

          {/* Receipt Upload Button */}
          <Button
            variant="contained"
            component="label"
            style={{ margin: '20px 0', backgroundColor: '#333', color: '#fff' }}
            disabled={!bookingData.payment_method}
          >
            Upload Receipt
            <input
              type="file"
              accept="image/*"
              name="receipt"
              onChange={handleInputChange}
              hidden
            />
          </Button>

          {errors.receipt && <Typography color="error">{errors.receipt}</Typography>}

          {/* Receipt Preview */}
          {receiptPreview && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <Typography variant="h6">Receipt Preview:</Typography>
              <img
                src={receiptPreview}
                alt="Receipt Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleBack} style={dialogButtonStyleBack}>Back</Button>
          <Button onClick={handleClose} style={dialogButtonStyleCancel}>Cancel</Button>
          <Button onClick={handleConfirmNext} style={dialogButtonStyleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onClose={handleClose} PaperProps={{ style: dialogStyle }}>
        <DialogTitle>
          <Typography style={titleStyle}>Booking Confirmed!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Your booking has been successfully completed!</Typography>
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleClose} style={dialogButtonStyleNext}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Package Selection Modal */}
      <Dialog open={packageSelectionOpen} onClose={() => setPackageSelectionOpen(false)} PaperProps={{ style: dialogStyle }}>
        <DialogTitle>
          <Typography style={titleStyle}>Select a Package</Typography>
        </DialogTitle>
        <DialogContent>
          <img src={packageImage1} alt="Package A" style={packageImageStyle} onClick={() => handlePackageSelect("Package A")} />
          <img src={packageImage2} alt="Package B" style={packageImageStyle} onClick={() => handlePackageSelect("Package B")} />
          <img src={packageImage3} alt="Package C" style={packageImageStyle} onClick={() => handlePackageSelect("Package C")} />
          <img src={packageImage4} alt="Package D" style={packageImageStyle} onClick={() => handlePackageSelect("Package D")} />
          <img src={packageImage5} alt="Package E" style={packageImageStyle} onClick={() => handlePackageSelect("Package E")} />
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleBack} style={dialogButtonStyleBack}>Back</Button>
          <Button onClick={() => setPackageSelectionOpen(false)} style={dialogButtonStyleCancel}>Close</Button>
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

// Button Styles
const dialogButtonStyleBack = {
  background: 'linear-gradient(90deg, #000000, #434343)', // Black gradient for Back button
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '15px',
  fontWeight: 'bold',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
};

const dialogButtonStyleCancel = {
  background: 'linear-gradient(90deg, #FF0000, #DC143C)', // Red gradient for Cancel
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '15px',
  fontWeight: 'bold',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
};

const dialogButtonStyleNext = {
  background: 'linear-gradient(90deg, #0000FF, #1E90FF)', // Blue gradient for Next
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '15px',
  fontWeight: 'bold',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
};

const dialogButtonStyleSubmit = {
  background: 'linear-gradient(90deg, #32CD32, #228B22)', // Green gradient for Submit
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '15px',
  fontWeight: 'bold',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
};

const packageButtonStyle = {
  marginTop: '10px',
  background: 'linear-gradient(90deg, #3f2b96, #6a5acd)',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const packageImageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '15px',
  marginBottom: '15px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
};

const paymentIconStyle = {
  width: '24px',
  height: '24px',
  marginRight: '10px',
};

export default Home;
