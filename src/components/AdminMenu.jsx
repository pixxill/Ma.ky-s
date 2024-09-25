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
import SearchIcon from '@mui/icons-material/Search';

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
  const [editItemId, setEditItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

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
        setErrorMessage('Failed to fetch menu items.');
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

    if (!title || !description || !price || (!image && !editItemId)) {
      // Image check only for new items
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
        if (editItemId && menuItems[category][editItemId]?.imageUrl) {
          const oldImageRef = storageReference(storage, menuItems[category][editItemId].imageUrl);
          await deleteObject(oldImageRef);
        }
      }

      const menuItemData = {
        title,
        description,
        price,
        imageUrl: imageUrl || menuItems[category][editItemId]?.imageUrl, // Use existing image URL if not updated
      };

      if (editItemId) {
        const editMenuItemRef = dbReference(db, `Menu/${category}/${editItemId}`);
        await update(editMenuItemRef, menuItemData);
      } else {
        const newMenuItemRef = dbReference(db, `Menu/${category}/${Date.now()}`);
        await set(newMenuItemRef, menuItemData);
      }

      // Reset form and fetch updated menu items
      resetForm();
      await fetchUpdatedMenuItems();
      alert('Menu item saved successfully!');
    } catch (error) {
      console.error('Error saving menu item:', error);
      setErrorMessage('Failed to save menu item. Please try again.');
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setImage(null);
    setCategory('Coffee');
    setEditItemId(null);
    setErrorMessage('');
  };

  const fetchUpdatedMenuItems = async () => {
    try {
      const menuRef = dbReference(db, 'Menu');
      const snapshot = await get(menuRef);
      if (snapshot.exists()) {
        setMenuItems(snapshot.val());
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleDelete = async (category, itemId) => {
    try {
      // Delete the item from the database
      const itemRef = dbReference(db, `Menu/${category}/${itemId}`);
      await remove(itemRef);

      // Delete the image from storage if it exists
      const imageUrl = menuItems[category][itemId]?.imageUrl;
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
    resetForm();
    setOpen(false);
  };

  // Filter menu items based on search query
  const filteredMenuItems = Object.keys(menuItems).reduce((acc, category) => {
    const filteredItems = Object.entries(menuItems[category])
      .filter(([id, item]) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .reduce((obj, [id, item]) => {
        obj[id] = item;
        return obj;
      }, {});
    
    if (Object.keys(filteredItems).length) {
      acc[category] = filteredItems;
    }

    return acc;
  }, {});

  return (
    <Container maxWidth="md" sx={{ marginTop: '30px' }}>
      {/* Add Product Button */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpen}
          sx={{ textTransform: 'none', bgcolor: '#000', color: '#fff' }}
        >
          Add Product
        </Button>
        {/* Search Field */}
        <Box display="flex" alignItems="center">
          <SearchIcon sx={{ color: '#888', mr: 1 }} />
          <TextField
            label="Search..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}
          />
        </Box>
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
            <IconButton onClick={handleClose} aria-label="close" sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom 
            sx={{ 
              color: '#fff', 
              fontFamily: 'Roboto, sans-serif', 
              mb: 2,
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
                  sx={{ 
                    bgcolor: '#333', 
                    borderRadius: '4px', 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#fff' },
                    },
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
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
                  sx={{ 
                    bgcolor: '#333', 
                    borderRadius: '4px', 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#fff' },
                    },
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
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
                  sx={{ 
                    bgcolor: '#333', 
                    borderRadius: '4px', 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#fff' },
                    },
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl 
                  variant="outlined" 
                  fullWidth 
                  sx={{ 
                    bgcolor: '#333', 
                    borderRadius: '4px',
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiSelect-select': { color: '#fff' },
                  }}
                >
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                    required
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
                  sx={{ 
                    bgcolor: '#444', 
                    color: '#fff', 
                    borderRadius: '4px', 
                    py: 1.5,
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
                  sx={{ mt: 1, color: '#bbb' }}
                >
                  Selected Image: {image.name}
                </Typography>
              )}
              {errorMessage && (
                <Grid item xs={12}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#ff5252', 
                      fontWeight: 'bold',
                      mt: 1
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
                  sx={{ 
                    py: 1.5, 
                    borderRadius: '4px', 
                    bgcolor: isLoading ? '#555' : '#000',
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

      {/* Display Filtered Menu Items by Category */}
      {Object.keys(filteredMenuItems).map((category) => (
        <Box key={category} mb={4}>
          <Typography variant="h5" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold', textTransform: 'capitalize' }}>
            {category}
          </Typography>
          <Grid container spacing={4}>
            {Object.entries(filteredMenuItems[category]).map(([id, item]) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card sx={{ 
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
                  border: '1px solid #000', // Stroke around the card
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)', // Slightly enlarge on hover
                  }
                }}>
                  <CardMedia component="img" alt={item.title} height="140" image={item.imageUrl} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>${item.price}</Typography>
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEdit(category, id)}
                          sx={{
                            bgcolor: '#000',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: '#333',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDelete(category, id)}
                          sx={{
                            bgcolor: '#000',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: '#333',
                            },
                          }}
                        >
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