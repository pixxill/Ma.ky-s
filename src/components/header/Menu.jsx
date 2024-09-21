import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import spanishLatte from '../../assets/spanishLatte.png';
import matchaSubreve from '../../assets/matchsubreve.png';
import icebiscoff from '../../assets/icebiscoff.png';
import breakfastImage from '../../assets/breakfast.jpg';
import cookiesImage from '../../assets/cookies.jpg';

const MenuSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState({ section: null, index: null });

  const sectionStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '30px 15px',
    color: '#000',
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
  };

  const mainHeadingStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  };

  const headingStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  };

  const menuSectionStyle = {
    marginBottom: '40px',
  };

  const sliderContainerStyle = {
    width: '80%',
    margin: '0 auto',
  };

  // Define the styles dynamically based on hover state
  const menuItemStyle = (section, index) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '12px',
    margin: '0 8px',
    boxShadow:
      hoveredIndex.section === section && hoveredIndex.index === index
        ? '0 10px 20px rgba(0, 0, 0, 0.15)'
        : '0 6px 12px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    minWidth: '200px',
    border: '1px solid #ddd',
    transform:
      hoveredIndex.section === section && hoveredIndex.index === index ? 'scale(1.04)' : 'scale(1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  });

  const imageStyle = (section, index) => ({
    width: '60%',
    height: '180px',
    borderRadius: '10px',
    marginBottom: '10px',
    objectFit: 'cover',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.08)',
    transform:
      hoveredIndex.section === section && hoveredIndex.index === index ? 'scale(1.08)' : 'scale(1)',
    transition: 'transform 0.3s ease',
  });

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#333',
  };

  const descriptionStyle = {
    fontSize: '14px',
    marginBottom: '6px',
    color: '#777',
  };

  const priceStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const menuItems = {
    coffee: [
      { img: spanishLatte, title: 'Spanish Latte', description: 'Milk with vanilla flavored', price: 'P120' },
      { img: matchaSubreve, title: 'Matcha Subreve', description: 'Milk with vanilla flavored', price: 'P120' },
      { img: icebiscoff, title: 'Ice Biscoff', description: 'Milk with vanilla flavored', price: 'P120' },
    ],
    breakfast: [
      { img: breakfastImage, title: 'Pancakes', description: 'With syrup and butter', price: 'P80' },
      { img: breakfastImage, title: 'Omelette', description: 'Cheese and vegetables', price: 'P100' },
    ],
    cookies: [
      { img: cookiesImage, title: 'Chocolate Chip', description: 'Milk with vanilla flavored', price: 'P50' },
      { img: cookiesImage, title: 'Oatmeal Raisin', description: 'Oatmeal and raisin flavor', price: 'P50' },
    ],
  };

  return (
    <div style={sectionStyle}>
      {/* Main Heading */}
      <h1 style={mainHeadingStyle}>Explore Our Menu</h1>

      {/* Coffee Section */}
      <div style={menuSectionStyle}>
        <h2 style={headingStyle}>Coffee</h2>
        <div style={sliderContainerStyle}>
          <Slider {...settings}>
            {menuItems.coffee.map((item, index) => (
              <div
                key={index}
                style={menuItemStyle('coffee', index)}
                onMouseEnter={() => setHoveredIndex({ section: 'coffee', index })}
                onMouseLeave={() => setHoveredIndex({ section: null, index: null })}
              >
                <img src={item.img} alt={item.title} style={imageStyle('coffee', index)} />
                <div style={titleStyle}>{item.title}</div>
                <div style={descriptionStyle}>{item.description}</div>
                <div style={priceStyle}>{item.price}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Breakfast Section */}
      <div style={menuSectionStyle}>
        <h2 style={headingStyle}>Breakfast</h2>
        <div style={sliderContainerStyle}>
          <Slider {...settings}>
            {menuItems.breakfast.map((item, index) => (
              <div
                key={index}
                style={menuItemStyle('breakfast', index)}
                onMouseEnter={() => setHoveredIndex({ section: 'breakfast', index })}
                onMouseLeave={() => setHoveredIndex({ section: null, index: null })}
              >
                <img src={item.img} alt={item.title} style={imageStyle('breakfast', index)} />
                <div style={titleStyle}>{item.title}</div>
                <div style={descriptionStyle}>{item.description}</div>
                <div style={priceStyle}>{item.price}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Baked Cookies Section */}
      <div style={menuSectionStyle}>
        <h2 style={headingStyle}>Baked Cookies</h2>
        <div style={sliderContainerStyle}>
          <Slider {...settings}>
            {menuItems.cookies.map((item, index) => (
              <div
                key={index}
                style={menuItemStyle('cookies', index)}
                onMouseEnter={() => setHoveredIndex({ section: 'cookies', index })}
                onMouseLeave={() => setHoveredIndex({ section: null, index: null })}
              >
                <img src={item.img} alt={item.title} style={imageStyle('cookies', index)} />
                <div style={titleStyle}>{item.title}</div>
                <div style={descriptionStyle}>{item.description}</div>
                <div style={priceStyle}>{item.price}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MenuSection;
