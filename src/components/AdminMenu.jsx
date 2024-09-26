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
  const [category, setCategory] = useState('Drinks');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [menuItems, setMenuItems] = useState({});
  const [open, setOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
      setErrorMessage('Please fill in all fields and select an image.');
      return;
    }

    try {
      setIsLoading(true);
      let imageUrl = null;

      if (image) {
        const imageRef = storageReference(storage, `menuImages/${category}/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);

        if (editItemId && menuItems[category][editItemId]?.imageUrl) {
          const oldImageRef = storageReference(storage, menuItems[category][editItemId].imageUrl);
          await deleteObject(oldImageRef);
        }
      }

      const menuItemData = {
        title,
        description,
        price,
        imageUrl: imageUrl || menuItems[category][editItemId]?.imageUrl,
      };

      if (editItemId) {
        const editMenuItemRef = dbReference(db, `Menu/${category}/${editItemId}`);
        await update(editMenuItemRef, menuItemData);
      } else {
        const newMenuItemRef = dbReference(db, `Menu/${category}/${Date.now()}`);
        await set(newMenuItemRef, menuItemData);
      }

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
    setCategory('Drinks');
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
      const itemRef = dbReference(db, `Menu/${category}/${itemId}`);
      await remove(itemRef);

      const imageUrl = menuItems[category][itemId]?.imageUrl;
      if (imageUrl) {
        const imageRef = storageReference(storage, imageUrl);
        await deleteObject(imageRef);
      }

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
    setEditItemId(itemId);
    setOpen(true);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getDisplayCategoryName = (internalCategory) => {
    const categoryMapping = {
      Breakfast: 'Foods',
      Coffee: 'Drinks',
    };
    return categoryMapping[internalCategory] || internalCategory;
  };

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
    <Container maxWidth="md" sx={{ marginTop: '30px', bgcolor: '#ffffff', p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpen}
          sx={{ 
            textTransform: 'none', 
            bgcolor: '#000000', 
            color: '#fff', 
            '&:hover': { bgcolor: '#333' } 
          }}
        >
          Add Product
        </Button>
        <Box display="flex" alignItems="center">
          <SearchIcon sx={{ color: '#888', mr: 1 }} />
          <TextField
            label="Search..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ bgcolor: '#fff', borderRadius: 1 }}
          />
        </Box>
      </Box>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={modalStyles}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleClose} aria-label="close" sx={{ color: '#000' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom 
            sx={{ 
              color: '#000', 
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
                  sx={textFieldStyles}
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
                  sx={textFieldStyles}
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
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl 
                  variant="outlined" 
                  fullWidth 
                  sx={textFieldStyles}
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
                    <MenuItem value="Drinks">DRINKS</MenuItem>
                    <MenuItem value="Foods">FOODS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  component="label" 
                  fullWidth 
                  sx={{
                    bgcolor: '#000000',
                    color: '#fff',
                    borderRadius: '4px',
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: '#333' },
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
                  sx={{ mt: 1, color: '#666' }}
                >
                  Selected Image: {image.name}
                </Typography>
              )}
              {errorMessage && (
                <Grid item xs={12}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#d32f2f', 
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
                    bgcolor: isLoading ? '#ccc' : '#000000',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: isLoading ? '#ccc' : '#333' },
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

      {Object.keys(filteredMenuItems).map((category) => (
        <Box key={category} mb={4}>
          <Typography variant="h5" gutterBottom sx={categoryTitleStyles}>
            {getDisplayCategoryName(category)}
          </Typography>
          <Grid container spacing={4}>
            {Object.entries(filteredMenuItems[category]).map(([id, item]) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card sx={cardStyles}>
                  <CardMedia component="img" alt={item.title} height="140" image={item.imageUrl} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      ₱{formatNumberWithCommas(item.price)}
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEdit(category, id)}
                          sx={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '50%',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#e0e0e0',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <EditIcon sx={{ color: '#000' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDelete(category, id)}
                          sx={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '50%',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#e0e0e0',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <DeleteIcon sx={{ color: '#d32f2f' }} />
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

// Styles
const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: '#ffffff',
  color: '#000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const textFieldStyles = {
  bgcolor: '#f9f9f9',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#ccc' },
  },
  '& .MuiInputLabel-root': { color: '#000' },
  '& .MuiInputBase-input': { color: '#000' },
};

const categoryTitleStyles = {
  color: '#000',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  borderBottom: '2px solid #000',
  pb: 1,
  mb: 2,
};

const cardStyles = {
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  border: '1px solid #ddd',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  },
};

export default UploadMenuItem;
