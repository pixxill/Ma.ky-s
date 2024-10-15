  import React, { useState, useEffect } from 'react';
  import { ref as dbReference, set, get, update, remove } from 'firebase/database';
  import { ref as storageReference, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Make sure uploadBytes and getDownloadURL are imported
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
    CardMedia,
    Modal,
    IconButton,
    Tooltip,
    CircularProgress,
  } from '@mui/material';
  import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import CloseIcon from '@mui/icons-material/Close';
  import SearchIcon from '@mui/icons-material/Search';
  import StarIcon from '@mui/icons-material/Star';
  import StarBorderIcon from '@mui/icons-material/StarBorder';

  const UploadMenuItem = () => {
    const [menuItems, setMenuItems] = useState({});
    const [categories, setCategories] = useState([]); // Holds list of categories
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Drinks'); // Default category
    const [newCategory, setNewCategory] = useState(''); // For adding a new category
    const [addNewCategory, setAddNewCategory] = useState(false); // Toggle between new or existing category
    const [image, setImage] = useState(null); // Image file
    const [isBestSeller, setIsBestSeller] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null); // State for image preview
    const [categoryToEdit, setCategoryToEdit] = useState(null); // Tracks the category being edited
    const [newCategoryName, setNewCategoryName] = useState(''); // For renaming the category
    const [openEditModal, setOpenEditModal] = useState(false); // For showing the edit modal
    
    const handleOpenEditModal = async (category) => {
      // Fetch the latest categories from Firebase to ensure it's not stale
      const menuRef = dbReference(db, 'Menu');
      const snapshot = await get(menuRef);
    
      if (snapshot.exists()) {
        const data = snapshot.val();
        const updatedCategories = Object.keys(data);
    
        if (updatedCategories.includes(category)) {
          setCategoryToEdit(category); // Set the category to be edited
          setNewCategoryName(category); // Pre-fill with the current category name
          setOpenEditModal(true); // Open the modal
        } else {
          setErrorMessage('This category no longer exists.');
        }
      } else {
        setErrorMessage('This category no longer exists.');
      }
    };      
    
    const handleRenameCategory = async () => {
      if (!newCategoryName.trim()) {
        setErrorMessage('Category name cannot be empty.');
        return;
      }
      if (categories.includes(newCategoryName)) {
        setErrorMessage('Category name already exists.');
        return;
      }
    
      try {
        // Copy items to new category and delete old one
        const newCategoryRef = dbReference(db, `Menu/${newCategoryName}`);
        await set(newCategoryRef, menuItems[categoryToEdit]);
    
        // Remove old category
        const oldCategoryRef = dbReference(db, `Menu/${categoryToEdit}`);
        await remove(oldCategoryRef);
    
        // Update local state
        const updatedMenuItems = { ...menuItems };
        delete updatedMenuItems[categoryToEdit];
        updatedMenuItems[newCategoryName] = menuItems[categoryToEdit];
    
        setMenuItems(updatedMenuItems);
        setCategories(categories.map((cat) => (cat === categoryToEdit ? newCategoryName : cat)));
        setOpenEditModal(false); // Close modal
        alert('Category renamed successfully!');
      } catch (error) {
        setErrorMessage('Failed to rename category.');
      }
    };

    const handleDeleteCategory = async (category) => {
      try {
        const categoryRef = dbReference(db, `Menu/${category}`);
        await remove(categoryRef); // Remove the category and all its items
    
        // Fetch the updated categories from Firebase
        const menuRef = dbReference(db, 'Menu');
        const snapshot = await get(menuRef);
    
        if (snapshot.exists()) {
          const data = snapshot.val();
          const updatedCategories = Object.keys(data);
          setMenuItems(data);
          setCategories(updatedCategories);
    
          // Automatically select another category if the current one was deleted
          if (updatedCategories.length > 0) {
            // Check if the deleted category is the currently selected one
            if (!updatedCategories.includes(category)) {
              setCategory(updatedCategories[0]); // Select the first available category
            }
          } else {
            setCategory(''); // No categories left, set to blank
          }
        } else {
          setMenuItems({});
          setCategories([]); // No categories left
          setCategory(''); // Reset the category selection
        }
    
        alert('Category deleted successfully!');
        setOpenEditModal(false); // Close the modal if open
      } catch (error) {
        setErrorMessage('Failed to delete category.');
      }
    };              

    useEffect(() => {
      const fetchMenuItems = async () => {
        try {
          const menuRef = dbReference(db, 'Menu');
          const snapshot = await get(menuRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setMenuItems(data);
            setCategories(Object.keys(data)); // Extract existing categories
          } else {
            setMenuItems({});
            setCategories([]); // No categories exist
          }
        } catch (error) {
          console.error('Error fetching menu items:', error);
          setErrorMessage('Failed to fetch menu items.');
        }
      };
    
      fetchMenuItems();
    }, []); // Fetch only on component mount
    
    // Automatically select the first available category if the current one is deleted
    useEffect(() => {
      if (categories.length > 0 && !categories.includes(category)) {
        // If the current category is not in the list of available categories, select the first available one
        setCategory(categories[0]);
      } else if (categories.length === 0) {
        // If no categories are available, reset the category
        setCategory('');
      }
    }, [categories, category]); // This runs whenever `categories` or `category` changes
     

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImage(file); // Set the image file for upload
        setImagePreview(URL.createObjectURL(file)); // Generate a preview URL for the image
      }
    };
    
    const handleSubmit = async (event) => {
      event.preventDefault();
      setErrorMessage('');
    
      if (isLoading) {
        setErrorMessage('An upload is already in progress. Please wait.');
        return;
      }
    
      if (!title || !description || (!image && !editItemId)) {
        setErrorMessage('Please fill in all fields and select an image.');
        return;
      }
    
      try {
        setIsLoading(true);
        let imageUrl = null;
    
        // Upload image to Firebase Storage
        if (image) {
          const imageRef = storageReference(storage, `menuImages/${category}/${image.name}`);
          await uploadBytes(imageRef, image); // Upload the image file
          imageUrl = await getDownloadURL(imageRef); // Get the image download URL
    
          // If we're editing an item, delete the old image if it exists
          if (editItemId && menuItems[category][editItemId]?.imageUrl) {
            const oldImageRef = storageReference(storage, menuItems[category][editItemId].imageUrl);
            await deleteObject(oldImageRef);
          }
        } else {
          // If editing and no new image is provided, keep the old image URL
          imageUrl = menuItems[category][editItemId]?.imageUrl || null;
        }
    
        let finalCategory = category;
        // Handle new category addition
        if (addNewCategory) {
          finalCategory = newCategory.trim(); // Use the new category
    
          // Add new category to Firebase if it doesn't already exist
          if (!categories.includes(finalCategory)) {
            await set(dbReference(db, `Menu/${finalCategory}`), {}); // Create a new category node in Firebase
          }
        }
    
        const menuItemData = {
          title,
          description,
          imageUrl, // Set the image URL in the database
          isBestSeller,
        };
    
        if (editItemId) {
          // Update existing item
          const editMenuItemRef = dbReference(db, `Menu/${finalCategory}/${editItemId}`);
          await update(editMenuItemRef, menuItemData);
        } else {
          // Add a new item
          const newMenuItemRef = dbReference(db, `Menu/${finalCategory}/${Date.now()}`);
          await set(newMenuItemRef, menuItemData);
        }
    
        // Refresh categories if a new category was added
        if (addNewCategory && !categories.includes(finalCategory)) {
          setCategories((prevCategories) => [...prevCategories, finalCategory]);
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
      setImage(null);
      setImagePreview(null); // Clear the image preview
      setCategory('Drinks');
      setNewCategory(''); // Clear the new category input
      setAddNewCategory(false); // Reset to existing category
      setIsBestSeller(false);
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
      setCategory(category);
      setIsBestSeller(item.isBestSeller || false);
      setEditItemId(itemId);
      setOpen(true);
    };

    const toggleBestSeller = async (category, itemId, isBestSeller) => {
      try {
        const itemRef = dbReference(db, `Menu/${category}/${itemId}`);
        await update(itemRef, { isBestSeller: !isBestSeller }); // Toggle the best seller status
        setMenuItems((prevState) => {
          const updatedItems = { ...prevState };
          updatedItems[category][itemId].isBestSeller = !isBestSeller; // Update the local state immediately
          return updatedItems;
        });
      } catch (error) {
        console.error('Error updating best seller status:', error);
      }
    };

    const formatNumberWithCommas = (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
            onClick={() => setOpen(true)}
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

        <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={modalStyles}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={() => setOpen(false)} aria-label="close" sx={{ color: '#000' }}>
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
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
  <Box sx={modalStyles}>
    <Box display="flex" justifyContent="flex-end">
      <IconButton onClick={() => setOpenEditModal(false)}>
        <CloseIcon />
      </IconButton>
    </Box>
    <Typography variant="h6" align="center" gutterBottom>
      Edit Category
    </Typography>
    <TextField
      label="New Category Name"
      value={newCategoryName}
      onChange={(e) => setNewCategoryName(e.target.value)}
      fullWidth
    />
    {errorMessage && (
      <Typography variant="body2" color="error" sx={{ mt: 2 }}>
        {errorMessage}
      </Typography>
    )}
    <Box mt={3} display="flex" justifyContent="space-between">
      <Button variant="contained" color="primary" onClick={handleRenameCategory}>
        Rename
      </Button>
      <Button variant="outlined" onClick={() => setOpenEditModal(false)}>
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>

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
                <FormControl variant="outlined" fullWidth sx={textFieldStyles}>
  <InputLabel id="category-label">Category</InputLabel>
  <Select
    labelId="category-label"
    id="category-select"
    value={category} // Ensure the selected category is valid
    onChange={(e) => setCategory(e.target.value)}
    label="Category"
    required
    disabled={categories.length === 0} // Disable if no categories are available
  >
    {categories.length === 0 ? (
      <MenuItem value="" disabled>
        No categories available
      </MenuItem>
    ) : (
      categories.map((cat) => (
        <MenuItem key={cat} value={cat}>
          {cat}
        </MenuItem>
      ))
    )}
  </Select>
</FormControl>

                  <Box mt={2}>
                    <Button
                      variant="text"
                      onClick={() => setAddNewCategory(!addNewCategory)}
                      sx={{ textTransform: 'none' }}
                    >
                      {addNewCategory ? 'Select Existing Category' : 'Add New Category'}
                    </Button>
                    {addNewCategory && (
                      <TextField
                        label="New Category"
                        variant="outlined"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        fullWidth
                        required={addNewCategory}
                        sx={{ mt: 2 }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} key={category}>
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h6">{category}</Typography>
    <Box>
      <Tooltip title="Edit Category">
        <IconButton onClick={() => handleOpenEditModal(category)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Category">
        <IconButton onClick={() => handleDeleteCategory(category)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
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

                {imagePreview && (
                  <Box mt={2} textAlign="center">
                    <Typography variant="body1" gutterBottom>
                      Image Preview:
                    </Typography>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                  </Box>
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
              {category.toUpperCase()}
            </Typography>
            <Grid container spacing={4}>
              {Object.entries(filteredMenuItems[category]).map(([id, item]) => (
                <Grid item xs={12} sm={6} md={4} key={id}>
                  <Card sx={cardStyles}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia component="img" alt={item.title} height="140" image={item.imageUrl} />
                      <Tooltip title={item.isBestSeller ? 'Remove Best Seller' : 'Mark as Best Seller'}>
                        <IconButton
                          sx={{ position: 'absolute', top: '10px', right: '10px', color: item.isBestSeller ? 'gold' : 'gray' }}
                          onClick={() => toggleBestSeller(category, id, item.isBestSeller)}
                        >
                          {item.isBestSeller ? <StarIcon fontSize="large" /> : <StarBorderIcon fontSize="large" />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{item.title}</Typography>
                      <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                    
                    
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
    width: '500px', // Set modal width
    maxHeight: '80vh', // Set maximum height for the modal (80% of the viewport height)
    overflowY: 'auto', // Enable scrolling if the content exceeds maxHeight
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