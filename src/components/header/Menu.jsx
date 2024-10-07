import React, { useState, useEffect } from 'react';
import { ref as databaseRef, get } from 'firebase/database';
import { realtimeDb } from '../../Firebase';
import backgroundImage from '../../assets/menu.jpeg';

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState({});
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuCategories = await fetchCategoriesFromDatabase();
        const menuData = {};

        // Fetch items for each category dynamically
        for (const category of menuCategories) {
          const items = await fetchItemsFromDatabase(`Menu/${category}`);
          menuData[category] = items;

          // Collect best sellers from each category
          const bestSellersFromCategory = items.filter(item => item.isBestSeller);
          setBestSellers(prevBestSellers => [...prevBestSellers, ...bestSellersFromCategory]);
        }

        setMenuItems(menuData);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  // Function to fetch all categories from Firebase
  const fetchCategoriesFromDatabase = async () => {
    const dbRef = databaseRef(realtimeDb, 'Menu');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()); // Return category names
    }
    return [];
  };

  // Function to fetch menu items for a given category
  const fetchItemsFromDatabase = async (path) => {
    const dbRef = databaseRef(realtimeDb, path);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data);
    }
    return [];
  };

  const sectionStyle = {
    position: 'relative',
    padding: '60px 20px',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.8)', // Darkened background
  };

  const backgroundOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: -1,
  };

  const mainHeadingStyle = {
    textAlign: 'center',
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '40px',
    color: 'white',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#EDE8DC',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
    padding: '15px',
    borderRadius: '12px',
  };

  // Style for grid layout
  const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
    gap: '20px', // Space between cards
    padding: '20px',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    textAlign: 'center',
  };

  const bestSellerStyle = {
    ...cardStyle,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Special color for bestsellers
    boxShadow: '0 8px 16px rgba(255, 0, 0, 0.2)', // Red shadow
  };

  const imageContainerStyle = {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    marginBottom: '15px',
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#FFD700',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
  };

  const descriptionStyle = {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#ddd',
  };

  return (
    <div style={sectionStyle}>
      <div style={backgroundOverlayStyle}></div>
      <h1 style={mainHeadingStyle}>Explore Our Menu</h1>

      {bestSellers.length > 0 && (
        <div>
          <h2 style={headingStyle}>⭐ Best Sellers</h2>
          <div style={cardGridStyle}>
            {bestSellers.map((item, index) => (
              <div
                key={index}
                style={bestSellerStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'; // Hover effect on the card
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={imageContainerStyle}>
                  <img src={item.imageUrl} alt={item.title} style={imageStyle} />
                </div>
                <div style={titleStyle}>{item.title}</div>
                <div style={descriptionStyle}>{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(menuItems).map((category) => (
        <div key={category}>
          <h2 style={headingStyle}>🍽️ {category}</h2>
          <div style={cardGridStyle}>
            {menuItems[category].map((item, index) => (
              <div
                key={index}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={imageContainerStyle}>
                  <img src={item.imageUrl} alt={item.title} style={imageStyle} />
                </div>
                <div style={titleStyle}>{item.title}</div>
                <div style={descriptionStyle}>{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuSection;
