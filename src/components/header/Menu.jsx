import React from 'react';
import backgroundImage from '../../assets/menu.jpg'; // Replace with your actual image path
import spanishLatte from '../../assets/spanishLatte.png'; // Placeholder image for Spanish Latte
import matchaSubreve from '../../assets/matchsubreve.png'; // Placeholder image for Matcha Subreve

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

  const menuContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: '30px',
  };

  const menuItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '250px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const imageStyle = {
    width: '100px',
    height: '100px',
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

  return (
    <section style={sectionStyle}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>MENU</h1>
      
      <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Coffee</h3>

      <div style={menuContainerStyle}>
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
      </div>
    </section>
  );
};

export default MenuSection;
