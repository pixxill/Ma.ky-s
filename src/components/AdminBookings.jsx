import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { realtimeDb } from '../Firebase';
import { Button, Typography, Box, Paper, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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

        // Cleanup the timeout if the value changes or component unmounts
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounced search query

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "confirm" or "cancel"
    const [selectedBooking, setSelectedBooking] = useState(null);

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

    // Open modal and set action
    const openModal = (action, booking) => {
        setModalAction(action);
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setSelectedBooking(null);
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

            {/* Custom Card Layout for Bookings */}
            <Grid container spacing={3}>
                {filteredBookings.map((booking) => (
                    <Grid item xs={12} sm={6} md={4} key={booking.id}>
                        <Card sx={styles.bookingCard}>
                            <CardContent>
                                <Typography variant="h6" sx={styles.bookingTitle}>
                                    Booking ID: {booking.id}
                                </Typography>
                                <Typography variant="body1" sx={styles.bookingInfo}>
                                    {booking.first_name} {booking.last_name}
                                </Typography>
                                <Typography variant="body2" sx={styles.bookingInfo}>
                                    Email: {booking.email_address}
                                </Typography>
                                <Typography variant="body2" sx={styles.bookingInfo}>
                                    Contact: {booking.contact_number}
                                </Typography>
                                <Typography variant="body2" sx={styles.bookingInfo}>
                                    Package: {booking.package}
                                </Typography>
                                <Typography variant="body2" sx={styles.bookingInfo}>
                                    Date: {formatDate(booking.date)}
                                </Typography>
                                <Typography variant="body2" sx={styles.bookingInfo}>
                                    Time: {booking.time}
                                </Typography>
                                <Box display="flex" justifyContent="center" mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={() => openModal('confirm', booking)}
                                        sx={styles.confirmButton}
                                        disabled={booking.status === 'confirmed'}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => openModal('cancel', booking)}
                                        sx={styles.cancelButton}
                                        disabled={booking.status === 'canceled'}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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
                    <Button 
                        onClick={closeModal} 
                        sx={styles.dialogButton}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={modalAction === 'confirm' ? handleConfirm : handleCancel} 
                        sx={styles.dialogButton}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

// Styling
const styles = {
    bookingCard: {
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff', // Light background color for cards
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
        },
    },
    bookingTitle: {
        fontWeight: 'bold',
        color: '#333',
    },
    bookingInfo: {
        marginBottom: '8px',
        color: '#555',
    },
    confirmButton: {
        marginRight: '10px',
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#45a047',
        },
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#e53935',
        },
    },
    dialogButton: {
        backgroundColor: '#000',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#333',
        },
    },
};

export default AdminBookings;
