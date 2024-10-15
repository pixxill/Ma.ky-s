import React, { useState, useEffect } from 'react';
import { ref as databaseRef, get } from 'firebase/database';
import { realtimeDb } from '../../Firebase';
import backgroundImage from '../../assets/menu.jpeg';

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState({});
  const [bestSellers, setBestSellers] = useState([]);
  const [activeCategory, setActiveCategory] = useState(''); // State to store the selected category

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuCategories = await fetchCategoriesFromDatabase();
        const menuData = {};
        const allBestSellers = [];

        for (const category of menuCategories) {
          const items = await fetchItemsFromDatabase(`Menu/${category}`);
          menuData[category] = items;

          const bestSellersFromCategory = items.filter(item => item.isBestSeller);

          bestSellersFromCategory.forEach((bestSeller) => {
            if (!allBestSellers.find(item => item.title === bestSeller.title)) {
              allBestSellers.push(bestSeller);
            }
          });
        }

        setMenuItems(menuData);
        setBestSellers(allBestSellers);
        setActiveCategory(menuCategories[0]); // Set default active category to the first one
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const fetchCategoriesFromDatabase = async () => {
    const dbRef = databaseRef(realtimeDb, 'Menu');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    }
    return [];
  };

  const fetchItemsFromDatabase = async (path) => {
    const dbRef = databaseRef(realtimeDb, path);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data);
    }
    return [];
  };

  // CSS-in-JS styles
  const sectionStyle = {
    position: 'relative',
    padding: '60px 20px',
    color: '#fff',
    fontFamily: "'Montserrat', sans-serif",
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.85)',
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
    fontSize: '52px',
    fontWeight: '700',
    marginBottom: '50px',
    color: '#FFDE59',
    textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
  };

  const categoryButtonStyle = (category) => ({
    cursor: 'pointer',
    fontSize: '22px',
    fontWeight: '600',
    padding: '10px 20px',
    margin: '10px',
    color: activeCategory === category ? 'white' : '#EDE8DC',
    backgroundColor: activeCategory === category ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
    border: 'none',
    transition: 'background-color 0.3s ease',
  });

  const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '0 20px',
  };

  const polaroidCardStyle = {
    backgroundColor: '#fff', // White background for the Polaroid effect
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    width: '90%',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    cursor: 'pointer',
    color: '#333', // Text color for readability
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const polaroidImageStyle = {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '5px solid white', // White border around the image
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    objectFit: 'cover',
  };

  const polaroidTextStyle = {
    backgroundColor: '#fff',
    padding: '10px',
    textAlign: 'center',
    width: '100%',
    fontWeight: '600', // Make font weight consistent for polaroid cards
    fontSize: '16px',
    color: '#333',
  };

  const titleStyle = {
    fontSize: '18px', // Consistent font size for titles
    fontWeight: '600', // Consistent font weight
    color: '#333',
    marginTop: '10px',
  };

  const descriptionStyle = {
    fontSize: '14px', // Consistent font size for descriptions
    color: '#555', // Slightly darker gray for consistency
  };

  return (
    <div style={sectionStyle}>
      <div style={backgroundOverlayStyle}></div>
      <h1 style={mainHeadingStyle}>Explore Our Menu</h1>

      {/* Always display Best Sellers with Polaroid Style */}
      {bestSellers.length > 0 && (
        <div>
          <h2 style={mainHeadingStyle}>Our Best Sellers</h2>
          <div style={cardGridStyle}>
            {bestSellers.map((item, index) => (
              <div
                key={index}
                style={polaroidCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <img src={item.imageUrl} alt={item.title} style={polaroidImageStyle} />
                <div style={polaroidTextStyle}>
                  <div style={titleStyle}>{item.title}</div>
                  <div style={descriptionStyle}>{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Buttons */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        {Object.keys(menuItems).map((category) => (
          <button
            key={category}
            style={categoryButtonStyle(category)}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Display items for the selected category */}
      {activeCategory && menuItems[activeCategory] && (
        <div>
          <div style={cardGridStyle}>
            {menuItems[activeCategory].map((item, index) => (
              <div
                key={index}
                style={polaroidCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <img src={item.imageUrl} alt={item.title} style={polaroidImageStyle} />
                <div style={polaroidTextStyle}>
                  <div style={titleStyle}>{item.title}</div>
                  <div style={descriptionStyle}>{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSection;
