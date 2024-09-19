import React from 'react';
import { Element } from 'react-scroll';
import Header from './components/header/header';
import Home from './components/Home';
import About from './components/About';
import Menu from './components/header/Menu'
import Contact from './components/Contact'
import Location from './components/Location'

const App = () => {
  return (
    <>
      <Header />
      <Element name="home">
        <Home />
      </Element>
      <Element name="about">
        <About />
      </Element>
      <Element name="Menu">
        <Menu />
      </Element>
      <Element name="Contact">
        <Contact />
      </Element>
      <Element name="Location">
        <Location />
      </Element>
      
      
      
      
     
    </>
  );
};

export default App;
