// components/MenuSection.jsx
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { ref as databaseRef, get } from 'firebase/database';
import { realtimeDb } from '../../Firebase';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import backgroundImage from '../../assets/menu.jpeg';

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState({ coffee: [], breakfast: [] });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const coffeeItems = await fetchItemsFromDatabase('Menu/Coffee');
        const breakfastItems = await fetchItemsFromDatabase('Menu/Breakfast');

        setMenuItems({
          coffee: coffeeItems,
          breakfast: breakfastItems,
        });
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

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
    padding: '50px 20px',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden',
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
    opacity: 10,
    zIndex: -1,
  };

  const mainHeadingStyle = {
    textAlign: 'center',
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '30px',
    color: '#EDE8DC',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#EDE8DC',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  };

  const menuSectionStyle = {
    marginBottom: '60px',
  };

  const menuItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    padding: '15px',
    borderRadius: '12px',
    margin: '0 10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    width: '220px',
    height: '420px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const imageContainerStyle = {
    width: '100%',
    height: '250px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    marginBottom: '15px',
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
    transition: 'transform 0.3s ease',
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#EDE8DC',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
  };

  const descriptionStyle = {
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '8px',
    color: '#ddd',
  };

  const priceStyle = {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: '#EDE8DC',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '10px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '10px',
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
        },
      },
    ],
  };

  const getSliderSettings = (itemsLength) => {
    return {
      ...settings,
      slidesToShow: itemsLength < 3 ? itemsLength : 3,
      infinite: itemsLength > 1,
    };
  };

  return (
    <div style={sectionStyle}>
      <div style={backgroundOverlayStyle}></div>
      <h1 style={mainHeadingStyle}>Explore Our Menu</h1>

      <div style={menuSectionStyle}>
        <h2 style={headingStyle}>Coffee</h2>
        <Slider {...getSliderSettings(menuItems.coffee.length)}>
          {menuItems.coffee.map((item, index) => (
            <div key={index} style={menuItemStyle}>
              <div style={imageContainerStyle}>
                <img src={item.imageUrl} alt={item.title} style={imageStyle} />
              </div>
              <div style={titleStyle}>{item.title}</div>
              <div style={descriptionStyle}>{item.description}</div>
              <div style={priceStyle}>{item.price}</div>
            </div>
          ))}
        </Slider>
      </div>

      <div style={menuSectionStyle}>
        <h2 style={headingStyle}>Breakfast</h2>
        <Slider {...getSliderSettings(menuItems.breakfast.length)}>
          {menuItems.breakfast.map((item, index) => (
            <div key={index} style={menuItemStyle}>
              <div style={imageContainerStyle}>
                <img src={item.imageUrl} alt={item.title} style={imageStyle} />
              </div>
              <div style={titleStyle}>{item.title}</div>
              <div style={descriptionStyle}>{item.description}</div>
              <div style={priceStyle}>{item.price}</div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MenuSection;
