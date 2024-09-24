// src/components/UploadMenuItem.jsx
import React, { useState, useEffect } from 'react';
import { ref as dbReference, set, get, update, remove } from 'firebase/database';
import { ref as storageReference, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { realtimeDb as db, storage } from '../Firebase';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  CardMedia,
  Modal,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const UploadMenuItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Coffee');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [menuItems, setMenuItems] = useState({});
  const [open, setOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null); // To handle editing

  useEffect(() => {
    // Fetch all menu items from the database on component load
    const fetchMenuItems = async () => {
      try {
        const menuRef = dbReference(db, 'Menu');
        const snapshot = await get(menuRef);
        if (snapshot.exists()) {
          setMenuItems(snapshot.val());
        } else {
          setMenuItems({});
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (isLoading) {
      setErrorMessage('An upload is already in progress. Please wait.');
      return;
    }

    if (!title || !description || !price || (!image && !editItemId)) { // image check only for new items
      setErrorMessage('Please fill in all fields and select an image.');
      return;
    }

    try {
      setIsLoading(true);
      let imageUrl = null;

      // Handle image upload if a new image is selected
      if (image) { 
        const imageRef = storageReference(storage, `menuImages/${category}/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);

        // Delete old image if editing and a new image is uploaded
        if (editItemId && menuItems[category][editItemId].imageUrl) {
          const oldImageRef = storageReference(storage, menuItems[category][editItemId].imageUrl);
          await deleteObject(oldImageRef);
        }
      }

      const menuItemData = {
        title,
        description,
        price,
        imageUrl: imageUrl || menuItems[category][editItemId].imageUrl, // Use existing image URL if not updated
      };

      if (editItemId) {
        const editMenuItemRef = dbReference(db, `Menu/${category}/${editItemId}`);
        await update(editMenuItemRef, menuItemData);
      } else {
        const newMenuItemRef = dbReference(db, `Menu/${category}/${Date.now()}`);
        await set(newMenuItemRef, menuItemData);
      }

      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      setCategory('Coffee');
      setEditItemId(null);
      alert('Menu item saved successfully!');

      // Fetch the updated menu items to reflect the changes
      const menuRef = dbReference(db, 'Menu');
      const snapshot = await get(menuRef);
      if (snapshot.exists()) {
        setMenuItems(snapshot.val());
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      setErrorMessage('Failed to save menu item. Please try again.');
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleDelete = async (category, itemId) => {
    try {
      // Delete the item from the database
      const itemRef = dbReference(db, `Menu/${category}/${itemId}`);
      await remove(itemRef);

      // Delete the image from storage if it exists
      const imageUrl = menuItems[category][itemId].imageUrl;
      if (imageUrl) {
        const imageRef = storageReference(storage, imageUrl);
        await deleteObject(imageRef);
      }

      // Update the local state to reflect the changes
      const updatedMenuItems = { ...menuItems };
      delete updatedMenuItems[category][itemId];
      setMenuItems(updatedMenuItems);

      alert('Menu item deleted successfully!');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setErrorMessage('Failed to delete menu item. Please try again.');
    }
  };

  const handleEdit = (category, itemId) => {
    const item = menuItems[category][itemId];
    setTitle(item.title);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(category);
    setEditItemId(itemId); // Set the item ID for editing
    setOpen(true); // Open the modal
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setImage(null);
    setCategory('Coffee');
    setEditItemId(null);
    setErrorMessage('');
    setOpen(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '30px' }}>
      {/* Add Product Button */}
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpen}
          style={{ textTransform: 'none', backgroundColor: '#000', color: '#fff' }}
        >
          Add Product
        </Button>
      </Box>

      {/* Minimalistic Modal for the Form */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 500, 
          bgcolor: '#000', 
          color: '#fff',
          boxShadow: 24, 
          p: 4, 
          borderRadius: '8px',
        }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose} aria-label="close" style={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom 
            style={{ 
              color: '#fff', 
              fontFamily: 'Roboto, sans-serif', 
              marginBottom: '20px',
              fontWeight: 'bold'
            }}
          >
            {editItemId ? 'Edit' : 'Upload'} Your Menu Item
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  required
                  style={{ 
                    backgroundColor: '#333', 
                    borderRadius: '4px', 
                    borderColor: '#fff',
                    color: '#fff'
                  }}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  inputProps={{ style: { color: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  required
                  style={{ 
                    backgroundColor: '#333', 
                    borderRadius: '4px', 
                    borderColor: '#fff',
                    color: '#fff'
                  }}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  inputProps={{ style: { color: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price"
                  variant="outlined"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                  required
                  style={{ 
                    backgroundColor: '#333', 
                    borderRadius: '4px', 
                    borderColor: '#fff',
                    color: '#fff'
                  }}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  inputProps={{ style: { color: '#fff' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl 
                  variant="outlined" 
                  fullWidth 
                  style={{ 
                    backgroundColor: '#333', 
                    borderRadius: '4px',
                  }}
                >
                  <InputLabel id="category-label" style={{ color: '#fff' }}>Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                    required
                    style={{ color: '#fff' }}
                  >
                    <MenuItem value="Coffee">Coffee</MenuItem>
                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                    <MenuItem value="Baked Cookies">Baked Cookies</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  component="label" 
                  fullWidth 
                  style={{ 
                    backgroundColor: '#444', 
                    color: '#fff', 
                    borderRadius: '4px', 
                    padding: '12px 0',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {editItemId ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                </Button>
              </Grid>
              {image && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ marginTop: '10px', color: '#bbb' }}
                >
                  Selected Image: {image.name}
                </Typography>
              )}
              {errorMessage && (
                <Grid item xs={12}>
                  <Typography 
                    variant="body2" 
                    style={{ 
                      color: '#ff5252', 
                      fontWeight: 'bold',
                      marginTop: '10px'
                    }}
                  >
                    {errorMessage}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  style={{ 
                    padding: '15px', 
                    borderRadius: '4px', 
                    backgroundColor: isLoading ? '#555' : '#000',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    editItemId ? 'Update Menu Item' : 'Upload Menu Item'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      {/* Display Menu Items by Category */}
      {Object.keys(menuItems).map((category) => (
        <Box key={category} mb={4}>
          <Typography variant="h5" gutterBottom style={{ color: '#3f51b5', fontWeight: 'bold', textTransform: 'capitalize' }}>
            {category}
          </Typography>
          <Grid container spacing={4}>
            {Object.entries(menuItems[category]).map(([id, item]) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card style={{ boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                  <CardMedia component="img" alt={item.title} height="140" image={item.imageUrl} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                    <Typography variant="h6" style={{ marginTop: '10px' }}>${item.price}</Typography>
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleEdit(category, id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="secondary" onClick={() => handleDelete(category, id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default UploadMenuItem;
