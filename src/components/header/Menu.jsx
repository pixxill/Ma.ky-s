import React from 'react';
import Slider from 'react-slick'; // Import the Slider component
import 'slick-carousel/slick/slick.css'; // Import slick carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick carousel theme CSS
import backgroundImage from '../../assets/menu.jpg'; // Replace with your actual background image path
import spanishLatte from '../../assets/spanishLatte.png'; // Placeholder image for Coffee
import matchaSubreve from '../../assets/matchsubreve.png'; // Placeholder image for Coffee
import icebiscoff from '../../assets/icebiscoff.png'; // Placeholder image for Coffee
import breakfastImage from '../../assets/breakfast.jpg'; // Placeholder image for Breakfast
import cookiesImage from '../../assets/cookies.jpg'; // Placeholder image for Baked Cookies

const MenuSection = () => {
  const sectionStyle = {
    position: 'relative', // Needed for overlay positioning
    padding: '50px 20px',
    color: '#fff', // Set section text color to white
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden', // Hide overflow to ensure clean edges
  };

  const backgroundOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`, // Dark gradient overlay
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.9, // Set opacity to 0.9
    zIndex: -1, // Position behind content
  };

  const mainHeadingStyle = {
    textAlign: 'center',
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '30px',
    color: '#EDE8DC', // Golden color for the main heading
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Shadow for text
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#EDE8DC', // Golden color for section headings
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', // Shadow for text
  };

  const menuSectionStyle = {
    marginBottom: '60px', // Space between sections
  };

  const menuItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background for each card
    padding: '20px',
    borderRadius: '16px',
    margin: '0 10px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)', // Darker shadow for more depth
    textAlign: 'center',
    minWidth: '250px',
    border: '1px solid rgba(255, 255, 255, 0.2)', // Light border for better definition
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
    '&:hover': {
      transform: 'scale(1.05)', // Slight scale on hover
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)', // Enhanced shadow on hover
    },
  };

  const imageStyle = {
    width: '70%', // Full width of the card
    height: '150px', // Adjust height to make it rectangular
    borderRadius: '12px', // Slightly rounded corners for card view
    marginBottom: '15px',
    objectFit: 'cover', // Cover the container size
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Darker shadow for image
    transition: 'transform 0.3s ease', // Smooth scaling effect
    '&:hover': {
      transform: 'scale(1.05)', // Slight scale on hover
    },
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#EDE8DC', // Golden color for titles
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', // Text shadow for titles
  };

  const descriptionStyle = {
    fontSize: '16px',
    marginBottom: '8px',
    color: '#ddd', // Light gray color for descriptions
  };

  const priceStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#EDE8DC', // Golden color for price
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', // Text shadow for price
  };

  // Settings for the slider
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
      {/* Background Overlay */}
      <div style={backgroundOverlayStyle}></div>

      {/* Main Heading */}
      <h1 style={mainHeadingStyle}>Explore Our Menu</h1>

      {/* Coffee Section */}
      <div style={menuSectionStyle}>
        <h2 style={headingStyle}>Coffee</h2>
        <Slider {...settings}>
          {menuItems.coffee.map((item, index) => (
            <div key={index} style={menuItemStyle}>
              <img src={item.img} alt={item.title} style={imageStyle} />
              <div style={titleStyle}>{item.title}</div>
              <div style={descriptionStyle}>{item.description}</div>
              <div style={priceStyle}>{item.price}</div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Breakfast Section */}
      <div style={menuSectionStyle}>
        <h2 style={headingStyle}>Breakfast</h2>
        <Slider {...settings}>
          {menuItems.breakfast.map((item, index) => (
            <div key={index} style={menuItemStyle}>
              <img src={item.img} alt={item.title} style={imageStyle} />
              <div style={titleStyle}>{item.title}</div>
              <div style={descriptionStyle}>{item.description}</div>
              <div style={priceStyle}>{item.price}</div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Baked Cookies Section */}
      <div style={menuSectionStyle}>
        <h2 style={headingStyle}>Baked Cookies</h2>
        <Slider {...settings}>
          {menuItems.cookies.map((item, index) => (
            <div key={index} style={menuItemStyle}>
              <img src={item.img} alt={item.title} style={imageStyle} />
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
