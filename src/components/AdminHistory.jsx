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
        <Paper elevation={3} sx={{ padding: 3, margin: '20px auto', width: '90%', backgroundColor: '#f5f5f5' }}>
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

            {/* Custom Card Layout for History */}
            <Grid container spacing={3}>
                {filteredHistory.map((booking) => (
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
                                <Typography variant="body2" sx={styles.bookingInfo}>
                                    Status: {booking.status}
                                </Typography>
                                <Box display="flex" justifyContent="center" mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={() => openModal('undo', booking.id)}
                                        sx={styles.undoButton}
                                    >
                                        Undo
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => openModal('delete', booking.id)}
                                        sx={styles.deleteButton}
                                    >
                                        Delete
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
                        sx={styles.dialogButton}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmAction} 
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
    undoButton: {
        marginRight: '10px',
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#45a047',
        },
    },
    deleteButton: {
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

export default AdminHistory;
