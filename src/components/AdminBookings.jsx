import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { realtimeDb } from '../Firebase';
import { Button, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
        <Paper elevation={3} sx={{ padding: 3, margin: '20px auto', width: '90%' }}>
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

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Booking ID</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>First Name</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Last Name</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Contact Number</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Package</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Time</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.id}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.first_name}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.last_name}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.email_address}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.contact_number}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.package}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{formatDate(booking.date)}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.time}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }} align="center">
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Button
                                            variant="contained"
                                            onClick={() => openModal('confirm', booking)}
                                            sx={{
                                                marginRight: '5px',
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#333',
                                                },
                                            }}
                                            disabled={booking.status === 'confirmed'}
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => openModal('cancel', booking)}
                                            sx={{
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#333',
                                                },
                                            }}
                                            disabled={booking.status === 'canceled'}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
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
                    <Button 
                        onClick={closeModal} 
                        sx={{ 
                            backgroundColor: '#000', 
                            color: '#fff', 
                            '&:hover': { backgroundColor: '#333' } 
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={modalAction === 'confirm' ? handleConfirm : handleCancel} 
                        sx={{ 
                            backgroundColor: '#000', 
                            color: '#fff', 
                            '&:hover': { backgroundColor: '#333' } 
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AdminBookings;
