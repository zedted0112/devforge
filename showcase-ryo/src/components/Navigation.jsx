import React from 'react';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="logo">Logo</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
