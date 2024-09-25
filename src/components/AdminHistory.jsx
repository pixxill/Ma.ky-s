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

// Utility function to parse and validate date
const parseDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? null : date; // Return null if invalid date
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

const AdminHistory = () => {
    const [history, setHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounced search query

    // State for handling modals
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "undo" or "delete"
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    useEffect(() => {
        // Fetch history data from the database
        const historyRef = ref(realtimeDb, 'history/');
        onValue(historyRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const historyArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setHistory(historyArray);
            }
        });
    }, []);

    // Open confirmation modal
    const openModal = (action, bookingId) => {
        setModalAction(action);
        setSelectedBookingId(bookingId);
        setModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalOpen(false);
        setModalAction(null);
        setSelectedBookingId(null);
    };

    // Undo: Move booking back to the bookings node
    const handleUndo = (id) => {
        const bookingToUndo = history.find((booking) => booking.id === id);

        if (bookingToUndo) {
            const bookingsRef = ref(realtimeDb, `bookings/${id}`);
            set(bookingsRef, {
                ...bookingToUndo,
                status: 'pending', // Revert status to original or pending
            })
                .then(() => {
                    const historyRef = ref(realtimeDb, `history/${id}`);
                    return remove(historyRef);
                })
                .then(() => {
                    alert('Booking moved back to bookings!');
                })
                .catch((error) => {
                    console.error('Error undoing booking:', error);
                    alert('Failed to undo booking. Please try again.');
                })
                .finally(() => closeModal());
        }
    };

    // Delete: Remove booking from the history node permanently
    const handleDelete = (id) => {
        const historyRef = ref(realtimeDb, `history/${id}`);

        // Remove the booking from the history node
        remove(historyRef)
            .then(() => {
                alert('Booking deleted from history!');
            })
            .catch((error) => {
                console.error('Error deleting booking:', error);
                alert('Failed to delete booking. Please try again.');
            })
            .finally(() => closeModal());
    };

    // Confirm and execute the action
    const confirmAction = () => {
        if (modalAction === 'undo') {
            handleUndo(selectedBookingId);
        } else if (modalAction === 'delete') {
            handleDelete(selectedBookingId);
        }
    };

    // Filter and sort history based on debounced search query and date
    const filteredHistory = history
        .filter((booking) => 
            booking.first_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.last_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.email_address.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.contact_number.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            booking.package.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            formatDate(booking.date).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
        .sort((a, b) => {
            // Parse the dates for sorting
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);

            if (!dateA) return 1; // Move invalid dates to bottom
            if (!dateB) return -1;

            return dateA - dateB; // Sort by date in ascending order
        });

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: '20px auto', width: '90%' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Booking History
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
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredHistory.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.id}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.first_name}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.last_name}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.email_address}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.contact_number}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.package}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{formatDate(booking.date)}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.time}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{booking.status}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }} align="center">
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Button
                                            variant="contained"
                                            onClick={() => openModal('undo', booking.id)}
                                            sx={{
                                                marginRight: '5px',
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#333',
                                                },
                                            }}
                                        >
                                            Undo
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => openModal('delete', booking.id)}
                                            sx={{
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#333',
                                                },
                                            }}
                                        >
                                            Delete
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
                    Confirm {modalAction === 'undo' ? 'Undo' : 'Delete'} Action
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
                        onClick={confirmAction} 
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

export default AdminHistory;
