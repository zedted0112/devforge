import React from 'react';
import './App.css';
import Hero from './components/hero.jsx';
import Portfolio from './components/portfolio.jsx';
import About from './components/about.jsx';
import Contact from './components/contact.jsx';

function App() {
  return (
    <div className="App">
      <Hero />
      <Portfolio />
      <About />
      <Contact />
    </div>
  );
}

export default App;
