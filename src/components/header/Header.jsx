import React, { useState } from 'react';
import { Link } from 'react-scroll'; // Import Link from react-scroll
import logo from '../../assets/logo.jpg';
import './Header.css';
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

const Header = ({ onBookNowClick }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    first_name: '',
    last_name: '',
    contact_number: '',
    email_address: '',
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState({});

  const handleClickOpen = () => {
    setCalendarOpen(true);
  };

  const handleClose = () => {
    setCalendarOpen(false);
    setFormOpen(false);
    setConfirmationOpen(false);
    setSuccessOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleDateSelection = (date) => {
    setBookingData({ ...bookingData, date: date.format('YYYY-MM-DD') });
    setCalendarOpen(false);
    setFormOpen(true);
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!bookingData.first_name.trim()) validationErrors.first_name = "First Name is required.";
    if (!bookingData.last_name.trim()) validationErrors.last_name = "Last Name is required.";
    if (!bookingData.contact_number.trim()) validationErrors.contact_number = "Contact Number is required.";
    if (!bookingData.email_address.trim()) validationErrors.email_address = "Email Address is required.";
    if (!bookingData.date) validationErrors.date = "Date is required.";
    if (!bookingData.time) validationErrors.time = "Time Slot is required.";
    return validationErrors;
  };

  const handleFormNext = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setFormOpen(false);
      setConfirmationOpen(true);
    } else {
      setErrors(formErrors);
    }
  };

  const handleConfirmNext = () => {
    // Submit booking data here (or call the backend service)
    setConfirmationOpen(false);
    setSuccessOpen(true);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__logo">
          <Link to="home" smooth={true} duration={500} className="header__logo-link">
            <img src={logo} alt="Logo" className="header__logo-img" />
          </Link>
        </div>
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="home" smooth={true} duration={500} className="header__nav-link">Home</Link>
            </li>
            <li className="header__nav-item">
              <Link to="about" smooth={true} duration={500} className="header__nav-link">About</Link>
            </li>
            <li className="header__nav-item">
              <Link to="Menu" smooth={true} duration={500} className="header__nav-link">Menu</Link>
            </li>
            <li className="header__nav-item">
              <Link to="Contact" smooth={true} duration={500} className="header__nav-link">Contact</Link>
            </li>
            <li className="header__nav-item">
              <Link to="Location" smooth={true} duration={500} className="header__nav-link">Location</Link>
            </li>
            {/* Book Now Button */}
            <li className="header__nav-item">
              <button className="header__nav-button" onClick={handleClickOpen}>
                Book Now
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Calendar Modal */}
      <Dialog open={calendarOpen} onClose={handleClose}>
        <DialogTitle>Select Booking Date</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar onChange={handleDateSelection} />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Form Modal */}
      <Dialog open={formOpen} onClose={handleClose}>
        <DialogTitle>Fill Out Your Details</DialogTitle>
        <DialogContent>
          <TextField label="First Name" fullWidth variant="outlined" name="first_name" value={bookingData.first_name} onChange={handleInputChange} error={!!errors.first_name} helperText={errors.first_name} />
          <TextField label="Last Name" fullWidth variant="outlined" name="last_name" value={bookingData.last_name} onChange={handleInputChange} error={!!errors.last_name} helperText={errors.last_name} />
          <TextField label="Contact Number" fullWidth variant="outlined" name="contact_number" value={bookingData.contact_number} onChange={handleInputChange} error={!!errors.contact_number} helperText={errors.contact_number} />
          <TextField label="Email Address" fullWidth variant="outlined" name="email_address" value={bookingData.email_address} onChange={handleInputChange} error={!!errors.email_address} helperText={errors.email_address} />
          <TextField label="Date" type="date" fullWidth variant="outlined" name="date" value={bookingData.date} onChange={handleInputChange} error={!!errors.date} helperText={errors.date} disabled />
          <FormControl fullWidth margin="dense" error={!!errors.time}>
            <InputLabel>Time Slot</InputLabel>
            <Select name="time" value={bookingData.time} onChange={handleInputChange} variant="outlined">
              <MenuItem value="Morning">Morning</MenuItem>
              <MenuItem value="Afternoon">Afternoon</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFormNext}>Next</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Confirmation Modal */}
      <Dialog open={confirmationOpen} onClose={handleClose}>
        <DialogTitle>Confirm Your Booking</DialogTitle>
        <DialogContent>
          <Typography>First Name: {bookingData.first_name}</Typography>
          <Typography>Last Name: {bookingData.last_name}</Typography>
          <Typography>Contact Number: {bookingData.contact_number}</Typography>
          <Typography>Email Address: {bookingData.email_address}</Typography>
          <Typography>Date: {bookingData.date}</Typography>
          <Typography>Time Slot: {bookingData.time}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmNext}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onClose={handleClose}>
        <DialogTitle>Booking Confirmed!</DialogTitle>
        <DialogContent>
          <Typography>Your booking has been successfully completed!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

export default Header;
