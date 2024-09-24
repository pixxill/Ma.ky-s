// src/components/AdminPackage.jsx
import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, TextField, IconButton, Tooltip, CardMedia } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const AdminPackage = () => {
  // Static mock data for packages
  const packages = [
    { id: 1, name: 'Basic Package', price: '1000 Php', description: 'This is a basic package.', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Standard Package', price: '2000 Php', description: 'This is a standard package.', imageUrl: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Premium Package', price: '3000 Php', description: 'This is a premium package.', imageUrl: 'https://via.placeholder.com/150' },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Packages
      </Typography>

      {/* Section for Adding a New Package */}
      <Box mb={4} p={3} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h6" gutterBottom>
          Add New Package
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Package Name" variant="outlined" fullWidth disabled placeholder="Enter package name" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Price" variant="outlined" fullWidth disabled placeholder="Enter price" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              disabled
              placeholder="Enter package description"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<AddCircleOutlineIcon />}
              disabled
              style={{ textTransform: 'none' }}
            >
              Add Package
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<PhotoCamera />}
              disabled
              style={{ marginTop: '10px', textTransform: 'none' }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                disabled
              />
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* List of Existing Packages */}
      <Typography variant="h6" gutterBottom>
        Existing Packages
      </Typography>
      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <Card>
              <CardMedia
                component="img"
                alt={pkg.name}
                height="150"
                image={pkg.imageUrl}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {pkg.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {pkg.price}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {pkg.description}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Tooltip title="Edit">
                    <IconButton color="primary" disabled>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="secondary" disabled>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Section for Editing a Package (Static Example) */}
      <Box mt={4} p={3} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h6" gutterBottom>
          Edit Package
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Package Name"
              variant="outlined"
              fullWidth
              disabled
              placeholder="Enter new package name"
              defaultValue="Standard Package" // Example value
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              disabled
              placeholder="Enter new price"
              defaultValue="2000 Php" // Example value
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              disabled
              placeholder="Enter new package description"
              defaultValue="This is a standard package." // Example value
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<EditIcon />}
              disabled
              style={{ textTransform: 'none' }}
            >
              Update Package
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<PhotoCamera />}
              disabled
              style={{ marginTop: '10px', textTransform: 'none' }}
            >
              Change Image
              <input
                type="file"
                hidden
                accept="image/*"
                disabled
              />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminPackage;