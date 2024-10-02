import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { realtimeDb } from '../Firebase';
import { Button, Typography, Box, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Link } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

    // Image preview state for receipt_url
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

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

    // Open image preview modal for receipt_url
    const openImagePreview = (url) => {
        setImageUrl(url);
        setImagePreviewOpen(true);
    };

    // Close image preview modal
    const closeImagePreview = () => {
        setImagePreviewOpen(false);
        setImageUrl('');
    };

    // Handle Confirm Action
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
        const bookingRef = ref(realtimeDb, `bookings/${bookingId}`);
        remove(bookingRef)
            .then(() => {
                alert('Booking deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting booking:', error);
                alert('Failed to delete booking. Please try again.');
            });
    };

    // Filter and sort bookings based on debounced search query and date
    const filteredBookings = bookings
        .filter((booking) =>
            booking.first_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.last_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.email_address.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.contact_number.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.package.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            formatDate(booking.date).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
        .sort((a, b) => {
            return new Date(a.date) - new Date(b.date); // Sort by date in ascending order
        });

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: '20px auto', width: '90%', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Admin Bookings
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
                                            onClick={() => openImagePreview(booking.receipt_url)}
                                        >
                                            Proof of Payment
                                        </Button>
                                    ) : (
                                        'No Receipt'
                                    )}
                                </TableCell>
                                <TableCell>{booking.payment_method || 'Not Specified'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => openModal('confirm', booking)} disabled={booking.status === 'confirmed'}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => openModal('cancel', booking)} disabled={booking.status === 'canceled'}>
                                        <EditIcon color="error" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(booking.id)}>
                                        <DeleteIcon color="error" />
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
                <DialogTitle>Proof of Payment</DialogTitle>
                <DialogContent>
                    <Box
                        component="img"
                        src={imageUrl}
                        alt="Proof of Payment"
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
