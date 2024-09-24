import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ref, onValue, update } from 'firebase/database';
import { realtimeDb } from '../Firebase';
import { Button, Typography, Box, Paper } from '@mui/material';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);

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

    const handleConfirm = (id) => {
        update(ref(realtimeDb, `bookings/${id}`), { status: 'confirmed' });
    };

    const handleCancel = (id) => {
        update(ref(realtimeDb, `bookings/${id}`), { status: 'canceled' });
    };

    const columns = [
        { field: 'id', headerName: 'Booking ID', width: 150 },
        { field: 'first_name', headerName: 'First Name', width: 150 },
        { field: 'last_name', headerName: 'Last Name', width: 150 },
        { field: 'email_address', headerName: 'Email', width: 200 },
        { field: 'contact_number', headerName: 'Contact Number', width: 150 },
        { field: 'package', headerName: 'Package', width: 150 },
        { field: 'price', headerName: 'Price', width: 100 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'time', headerName: 'Time', width: 100 },
        { field: 'status', headerName: 'Status', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 250,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleConfirm(params.row.id)}
                        style={{ marginRight: '5px' }}
                        disabled={params.row.status === 'confirmed'}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleCancel(params.row.id)}
                        disabled={params.row.status === 'canceled'}
                    >
                        Cancel
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Paper elevation={3} style={{ padding: '20px', margin: '20px auto', maxWidth: '250%' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Admin Bookings
            </Typography>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={bookings}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                />
            </div>
        </Paper>
    );
};

export default AdminBookings;
