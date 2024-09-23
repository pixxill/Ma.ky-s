// src/components/UploadMenuItem.jsx
import React, { useState } from 'react';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
//import { db, storage } from '../Firebase';
import { realtimeDb as db, storage } from '../Firebase'; // Correct import


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
  Paper,
} from '@mui/material';

const UploadMenuItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Coffee');
  const [image, setImage] = useState(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !price || !image) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = storageRef(storage, `menuImages/${category}/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Save data to Realtime Database
      const newMenuItemRef = dbRef(db, `Menu/${category}/${Date.now()}`);
      await set(newMenuItemRef, {
        title,
        description,
        price,
        imageUrl,
      });

      // Reset form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      setCategory('Coffee');
      alert('Menu item uploaded successfully!');
    } catch (error) {
      console.error('Error uploading menu item:', error);
      alert('Failed to upload menu item.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '30px' }}>
        <Typography variant="h4" gutterBottom>
          Upload Menu Item
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap="20px">
            <TextField
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Price"
              variant="outlined"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
            />
            <FormControl variant="outlined" fullWidth>
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
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
                required
              />
            </Button>
            {image && (
              <Typography variant="body2" color="textSecondary">
                Selected Image: {image.name}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary">
              Upload Menu Item
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default UploadMenuItem;
