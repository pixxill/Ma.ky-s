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
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

import GcashIcon from '../assets/gcash.png';
import TransferIcon from '../assets/transfer.png';
import packageAImage from '../assets/packageA.png'; // Assuming these images exist
import packageBImage from '../assets/packageB.png';
import packageCImage from '../assets/packageC.png';
import packageDImage from '../assets/packageD.png';

const Home = ({
  calendarOpen,
  setCalendarOpen,
  formOpen,
  setFormOpen,
  confirmationOpen,
  setConfirmationOpen,
  successOpen,
  setSuccessOpen,
  handleClose,
}) => {
  const [packagePreviewOpen, setPackagePreviewOpen] = useState(false); // State for package preview modal
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
  const [bookedDates, setBookedDates] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storage = getStorage();

  const fetchBookedDates = async () => {
    try {
      const response = await fetch('https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/history.json');
      const historyData = await response.json();

      const dateCounts = {};

      Object.values(historyData || {}).forEach(booking => {
        const bookingDate = booking.date;
        const status = booking.status;

        if (status === 'confirmed' || status === 'completed') {
          if (dateCounts[bookingDate]) {
            dateCounts[bookingDate]++;
          } else {
            dateCounts[bookingDate] = 1;
          }
        }
      });

      setBookedDates(dateCounts);
    } catch (error) {
      console.error('Error fetching booked dates from history:', error);
    }
  };

  useEffect(() => {
    fetchBookedDates();
  }, []);

  const isDateFullyBooked = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    return bookedDates[formattedDate] >= 2;
  };

  const isPastDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate < today;
  };

  const renderDayWithLabel = (day, selectedDate, DayComponentProps) => {
    const formattedDate = day.format('YYYY-MM-DD');
    const hasBooking = bookedDates[formattedDate] && bookedDates[formattedDate] > 0;

    return (
      <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
        <Typography component="div" variant="body2" {...DayComponentProps}>
          {day.date()}
        </Typography>
        {hasBooking && (
          <span style={{
            position: 'absolute',
            bottom: 4,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ff5722',
            borderRadius: '50%',
            width: '8px',
            height: '8px',
            display: 'inline-block',
          }} />
        )}
      </div>
    );
  };

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

  const handleBack = () => {
    switch (prevState) {
      case 'calendar':
        setCalendarOpen(true);
        setFormOpen(false);
        setConfirmationOpen(false);
        break;
      case 'form':
        setFormOpen(false);
        setCalendarOpen(true);
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

    try {
      const response = await fetch('https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/history.json');
      const historyData = await response.json();

      const bookedSlots = Object.values(historyData || {}).filter(booking => booking.date === formattedDate).map(booking => booking.time);

      setAvailableTimeSlots(['8:00 AM - 11:00 AM', '1:00 PM - 5:00 PM'].filter(slot => {
        return !bookedSlots.includes(slot);
      }));

    } catch (error) {
      console.error('Error fetching booked times:', error);
    }

    setCalendarOpen(false);
    setFormOpen(true);
    setPrevState('form');
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
      if (isSubmitting) return; // If form is being submitted, prevent another submission

      setIsSubmitting(true); // Lock the form for submission
      const isAvailable = await checkBookingAvailability(bookingData.date, bookingData.time);
      if (isAvailable) {
        handleBooking();
      } else {
        alert("The selected date and time slot is no longer available. Please choose a different time.");
        setIsSubmitting(false); // Unlock the form in case of error
      }
    } else {
      setErrors(formErrors);
    }
  };

  const checkBookingAvailability = async (date, time) => {
    const response = await fetch('https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json');
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
        setIsSubmitting(false); // Unlock the form in case of error
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
      setIsSubmitting(false); // Unlock the form after successful submission
    } catch (error) {
      console.error('Error submitting booking:', error);
      setIsSubmitting(false); // Unlock the form in case of error
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
        <h1 style={headingStyle}>Unlock the Venue of Your Dreams here at MA.KY's!</h1>
        <h2 style={subHeadingStyle}>Don't settle for ordinary. Your extraordinary event deserves an extraordinary venue.</h2>
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
          onClick={() => setCalendarOpen(true)}
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
            <DateCalendar
              onChange={handleDateSelection}
              shouldDisableDate={(date) => isDateFullyBooked(date) || isPastDate(date)}
              renderDay={(day, selectedDate, DayComponentProps) => renderDayWithLabel(day, selectedDate, DayComponentProps)}
              key={bookedDates}
            />
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
              {['8:00 AM - 11:00 AM', '1:00 PM - 5:00 PM'].map(slot => (
                <MenuItem value={slot} key={slot} disabled={!availableTimeSlots.includes(slot)}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
            {errors.time && <Typography style={{ color: 'red', marginTop: '5px' }}>{errors.time}</Typography>}
          </FormControl>

          <FormControl component="fieldset" margin="dense" style={textFieldStyle}>
            <Typography variant="body1" style={{ marginBottom: '10px' }}>
              Select Package:
            </Typography>
            <RadioGroup
              aria-label="package"
              name="package"
              value={bookingData.package}
              onChange={handleInputChange}
              row
            >
              <FormControlLabel value="Package A" control={<Radio />} label="Package A" />
              <FormControlLabel value="Package B" control={<Radio />} label="Package B" />
              <FormControlLabel value="Package C" control={<Radio />} label="Package C" />
              <FormControlLabel value="Package D" control={<Radio />} label="Package D" />
            </RadioGroup>
            {errors.package && <Typography color="error">{errors.package}</Typography>}
          </FormControl>

          {/* Preview Packages Button */}
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '-60px', }}
            onClick={() => setPackagePreviewOpen(true)} // Open the package preview modal
          >
            Preview Packages
          </Button>

          <Button
            variant="contained"
            component="label"
            style={{ marginTop: '100px', marginLeft: '-140px' }}
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

{/* Package Preview Modal */}
<Dialog open={packagePreviewOpen} onClose={handleClose} PaperProps={{ style: dialogStyle }}>
  <DialogTitle>
    <Typography style={titleStyle}>Package Previews</Typography>
  </DialogTitle>
  <DialogContent>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Typography variant="h6">Package A</Typography>
      <img src={packageAImage} alt="Package A" style={{ maxWidth: '100%', marginBottom: '20px' }} />
      <Typography variant="h6">Package B</Typography>
      <img src={packageBImage} alt="Package B" style={{ maxWidth: '100%', marginBottom: '20px' }} />
      <Typography variant="h6">Package C</Typography>
      <img src={packageCImage} alt="Package C" style={{ maxWidth: '100%', marginBottom: '20px' }} />
      <Typography variant="h6">Package D</Typography>
      <img src={packageDImage} alt="Package D" style={{ maxWidth: '100%', marginBottom: '20px' }} />
    </div>
  </DialogContent>
  <DialogActions style={dialogActionsStyle}>
    {/* Back Button - Go back to Fill Out Form */}
    <Button
      onClick={() => {
        setPackagePreviewOpen(false);  // Close Preview Modal
        setFormOpen(true);             // Reopen the Form Modal
      }}
      style={dialogButtonStyleBack}
    >
      Back
    </Button>

  </DialogActions>
</Dialog>


      {/* Booking Confirmation Modal */}
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

          {bookingData.payment_method && (
            <Button
              variant="contained"
              component="label"
              style={{
                margin: '20px 0',
                backgroundColor: '#333',
                color: '#fff'
              }}
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
          )}

          {errors.receipt && <Typography color="error">{errors.receipt}</Typography>}

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
          <Button onClick={handleConfirmNext} style={dialogButtonStyleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onClose={handleClose} PaperProps={{ style: dialogStyle }}>
        <DialogTitle>
          <Typography style={titleStyle}>Booking Confirmed!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Your booking has been successfully completed! 
          Please check your email for further details and confirmation of your booking.
          </Typography>
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleClose} style={dialogButtonStyleNext}>Close</Button>
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
  justifyContent: 'Flex',
  alignItems: 'center',
  textAlign: 'justify',
  padding: '0 50px',
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
  maxWidth: '750px',
  textAlign: 'left',
  zIndex: 1,
};

const headingStyle = {
  fontSize: '65px',
  marginBottom: '20px',
  fontWeight: 'bold',
  lineHeight: '1.1',
};

const subHeadingStyle = {
  fontSize: '40px',
  marginBottom: '1px',
  lineHeight: '1.3',
  fontWeight: 'Normal',
  letterSpacing: '0.5px',
};

const buttonStyle = {
  padding: '12px 36px',
  backgroundColor: 'transparent',
  color: '#F5EFFF',
  border: '2px solid #F5EFFF',
  borderRadius: '100px',
  cursor: 'pointer',
  fontSize: '30px',
  fontWeight: 'bold',
  fontFamily: "'Poppins', sans-serif",
  transition: 'all 0.3s ease',
  marginTop: '50px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const buttonHoverStyle = {
  backgroundColor: '#333',
  color: '#fff',
};

const dialogStyle = {
  padding: '30px 40px',
  borderRadius: '10px',
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
  background: 'linear-gradient(90deg, #000000, #434343)',
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
  background: 'linear-gradient(90deg, #FF0000, #DC143C)',
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
  background: 'linear-gradient(90deg, #0000FF, #1E90FF)',
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
  background: 'linear-gradient(90deg, #32CD32, #228B22)',
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

const paymentIconStyle = {
  width: '24px',
  height: '24px',
  marginRight: '10px',
};

export default Home;
