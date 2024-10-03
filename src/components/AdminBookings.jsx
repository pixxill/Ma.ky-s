import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { realtimeDb } from '../Firebase';
import { Button, Typography, Box, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import emailjs from 'emailjs-com';  // Import EmailJS SDK

// Utility function to format date for display purposes
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Custom hook for debouncing search input
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Modal state for confirmations (Confirm/Cancel actions)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Image preview state for receipt_url and id_image_url
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => {
        const bookingsRef = ref(realtimeDb, 'bookings/');
        onValue(bookingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const bookingsArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setBookings(bookingsArray);
            }
        });
    }, []);

    // Open modal and set action for confirmations
    const openModal = (action, booking) => {
        setModalAction(action);
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    // Close modal for confirmations
    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setSelectedBooking(null);
    };

    // Open image preview modal for both receipt_url and id_image_url
    const openImagePreview = (url, title) => {
        setImageUrl(url);
        setPreviewTitle(title);
        setImagePreviewOpen(true);
    };

    // Close image preview modal
    const closeImagePreview = () => {
        setImagePreviewOpen(false);
        setImageUrl('');
        setPreviewTitle('');
    };

    // Email sending function
    const sendConfirmationEmail = (booking) => {
        const templateParams = {
            to_name: booking.first_name,  // matches {{to_name}} in the template
            to_email: booking.email_address,  // ensure this is passed correctly
            booking_date: formatDate(booking.date),  // matches {{booking_date}}
            package: booking.package,  // matches {{package}}
            time: booking.time || "N/A",  // matches {{time}}, fallback to "N/A" if not provided
            from_name: 'MA.KY\'s',  // Optional: You can hardcode this or pass dynamically
        };

        // Replace with your EmailJS service ID, template ID, and user ID
        emailjs.send('service_mcb4fsh', 'template_jzjwu3h', templateParams, '2S7IA6JT_kWPjPxNQ')
            .then((response) => {
                console.log('Email sent successfully:', response.status, response.text);
            }, (error) => {
                console.error('Failed to send email:', error);
            });
    };

    // Handle Confirm Action and send email
    const handleConfirm = () => {
        const bookingToUpdate = selectedBooking;

        if (bookingToUpdate) {
            const historyRef = ref(realtimeDb, `history/${bookingToUpdate.id}`);
            set(historyRef, {
                ...bookingToUpdate,
                status: 'confirmed',
                movedAt: new Date().toISOString(),
            })
                .then(() => {
                    const bookingRef = ref(realtimeDb, `bookings/${bookingToUpdate.id}`);
                    return remove(bookingRef);
                })
                .then(() => {
                    alert('Booking confirmed and moved to history!');
                    closeModal();
                    
                    // Send email using EmailJS
                    sendConfirmationEmail(bookingToUpdate);
                    
                })
                .catch((error) => {
                    console.error('Error confirming booking:', error);
                    alert('Failed to confirm booking. Please try again.');
                    closeModal();
                });
        }
    };

    // Handle Cancel Action
    const handleCancel = () => {
        const bookingToUpdate = selectedBooking;

        if (bookingToUpdate) {
            const historyRef = ref(realtimeDb, `history/${bookingToUpdate.id}`);
            set(historyRef, {
                ...bookingToUpdate,
                status: 'canceled',
                movedAt: new Date().toISOString(),
            })
                .then(() => {
                    const bookingRef = ref(realtimeDb, `bookings/${bookingToUpdate.id}`);
                    return remove(bookingRef);
                })
                .then(() => {
                    alert('Booking canceled and moved to history!');
                    closeModal();
                })
                .catch((error) => {
                    console.error('Error canceling booking:', error);
                    alert('Failed to cancel booking. Please try again.');
                    closeModal();
                });
        }
    };

    // Handle Delete Action
    const handleDelete = (bookingId) => {
        const bookingToDelete = bookings.find((b) => b.id === bookingId);

        if (bookingToDelete) {
            const historyRef = ref(realtimeDb, `history/${bookingToDelete.id}`);
            set(historyRef, {
                ...bookingToDelete,
                status: 'deleted',
                movedAt: new Date().toISOString(),
            })
                .then(() => {
                    const bookingRef = ref(realtimeDb, `bookings/${bookingToDelete.id}`);
                    return remove(bookingRef);
                })
                .then(() => {
                    alert('Booking deleted and moved to history!');
                })
                .catch((error) => {
                    console.error('Error deleting booking:', error);
                    alert('Failed to delete booking. Please try again.');
                });
        }
    };

    // Filter and sort bookings based on debounced search query and date
    const filteredBookings = bookings
        .filter((booking) =>
            booking.first_name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.last_name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.email_address?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.contact_number?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.package?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            formatDate(booking.date).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
        });

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: '20px auto', width: '90%', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Recent Bookings
            </Typography>

            {/* Search Bar */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Box display="flex" alignItems="center" width="300px">
                    <SearchIcon sx={{ color: '#888', mr: 1 }} />
                    <TextField
                        label="Search..."
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        size="small"
                    />
                </Box>
            </Box>

            {/* Table Layout for Bookings */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Booking ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Package</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Proof of Payment</TableCell>
                            <TableCell>ID Image</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>{booking.first_name} {booking.last_name}</TableCell>
                                <TableCell>{booking.email_address}</TableCell>
                                <TableCell>{booking.contact_number}</TableCell>
                                <TableCell>{booking.package}</TableCell>
                                <TableCell>{formatDate(booking.date)}</TableCell>
                                <TableCell>
                                    {booking.receipt_url ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => openImagePreview(booking.receipt_url, 'Proof of Payment')}
                                        >
                                            Proof of Payment
                                        </Button>
                                    ) : (
                                        'No Receipt'
                                    )}
                                </TableCell>
                                <TableCell>
                                    {booking.id_image_url ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => openImagePreview(booking.id_image_url, 'ID Image')}
                                        >
                                            View ID
                                        </Button>
                                    ) : (
                                        'No ID'
                                    )}
                                </TableCell>
                                <TableCell>{booking.payment_method || 'Not Specified'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => openModal('confirm', booking)} disabled={booking.status === 'confirmed'}>
                                        <CheckIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => openModal('cancel', booking)} disabled={booking.status === 'canceled'}>
                                        <CancelIcon color="error" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(booking.id)}>
                                        <DeleteForeverIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmation Modal */}
            <Dialog
                open={modalOpen}
                onClose={closeModal}
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-description"
            >
                <DialogTitle id="confirmation-dialog-title">
                    Confirm {modalAction === 'confirm' ? 'Confirm' : 'Cancel'} Action
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to {modalAction} this booking?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button onClick={modalAction === 'confirm' ? handleConfirm : handleCancel}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Preview Modal */}
            <Dialog
                open={imagePreviewOpen}
                onClose={closeImagePreview}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{previewTitle}</DialogTitle>
                <DialogContent>
                    <Box
                        component="img"
                        src={imageUrl}
                        alt={previewTitle}
                        sx={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeImagePreview}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AdminBookings;