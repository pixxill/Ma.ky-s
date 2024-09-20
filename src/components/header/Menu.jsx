import React from 'react';
import Slider from 'react-slick'; // Import the Slider component
import 'slick-carousel/slick/slick.css'; // Import slick carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick carousel theme CSS
import backgroundImage from '../../assets/menu.jpg'; // Replace with your actual image path
import spanishLatte from '../../assets/spanishLatte.png'; // Placeholder image for Spanish Latte
import matchaSubreve from '../../assets/matchsubreve.png'; // Placeholder image for Matcha Subreve
import icebiscoff from '../../assets/icebiscoff.png';

const MenuSection = () => {
  const sectionStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    padding: '20px',
  };

  const menuItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '300px', // Increased max width for larger images
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    margin: '0 10px', // Margin for each card
  };

  const imageStyle = {
    width: '250px', // Increased width
    height: '250px', // Increased height
    borderRadius: '50%',
    marginBottom: '10px',
  };

  const priceStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '10px',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
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
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section style={sectionStyle}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>MENU</h1>
      
      <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Coffee</h3>

      <Slider {...settings} style={{ width: '80%' }}>
        {/* Menu Item 1 */}
        <div style={menuItemStyle}>
          <img src={spanishLatte} alt="Spanish Latte" style={imageStyle} />
          <h4 style={titleStyle}>Spanish Latte</h4>
          <div style={priceStyle}>P120</div>
        </div>

        {/* Menu Item 2 */}
        <div style={menuItemStyle}>
          <img src={matchaSubreve} alt="Matcha Subreve" style={imageStyle} />
          <h4 style={titleStyle}>Matcha Subreve</h4>
          <div style={priceStyle}>P120</div>
        </div>

        {/* Add more menu items here */}
        <div style={menuItemStyle}>
          <img src={icebiscoff} alt="Ice Biscoff" style={imageStyle} />
          <h4 style={titleStyle}>Ice Biscoff</h4>
          <div style={priceStyle}>P120</div>
        </div>


      </Slider>
    </section>
  );
};

export default MenuSection;
