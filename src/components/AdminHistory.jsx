import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { realtimeDb } from '../Firebase';
import { Button, Typography, Box, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';

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
    const [filterStatus, setFilterStatus] = useState(''); // State for filtering by status

    // State for handling modals
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // "undo" or "delete"
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    // Image preview state for receipt_url
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

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

    // Filter and sort history based on debounced search query, filter status, and date
    const filteredHistory = history
        .filter((booking) =>
            (filterStatus === '' || booking.status === filterStatus) &&
            (
                booking.first_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                booking.last_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                booking.email_address.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                booking.contact_number.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                booking.package.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                formatDate(booking.date).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            )
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

            {/* Search Bar and Filter Buttons */}
            <Box display="flex" justifyContent="space-between" mb={2}>
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

                {/* Filter Buttons for Confirmed and Canceled */}
                <Box display="flex" alignItems="center">
                    <Button
                        variant={filterStatus === 'confirmed' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => setFilterStatus(filterStatus === 'confirmed' ? '' : 'confirmed')}
                        sx={{ marginRight: 1 }}
                    >
                        Confirmed
                    </Button>
                    <Button
                        variant={filterStatus === 'canceled' ? 'contained' : 'outlined'}
                        color="secondary"
                        onClick={() => setFilterStatus(filterStatus === 'canceled' ? '' : 'canceled')}
                    >
                        Canceled
                    </Button>
                </Box>
            </Box>

            {/* Table Layout for History */}
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
                            <TableCell>Status</TableCell>
                            <TableCell>Proof of Payment</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredHistory.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>{booking.first_name} {booking.last_name}</TableCell>
                                <TableCell>{booking.email_address}</TableCell>
                                <TableCell>{booking.contact_number}</TableCell>
                                <TableCell>{booking.package}</TableCell>
                                <TableCell>{formatDate(booking.date)}</TableCell>
                                <TableCell>{booking.status}</TableCell>
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
                                <TableCell>
                                    <IconButton onClick={() => openModal('undo', booking.id)}>
                                        <UndoIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => openModal('delete', booking.id)}>
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
                    Confirm {modalAction === 'undo' ? 'Undo' : 'Delete'} Action
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
                    <Button onClick={confirmAction}>
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

export default AdminHistory;
