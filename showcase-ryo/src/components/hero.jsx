import React from 'react';
import './hero.css';

function Hero() {
  return (
    <section className="section-hero gradient-background">
      <div className="container">
        <div className="hero-content">
          {/* hero-section content */}
          <h2>Hero</h2>
          <p>This is the hero section with gradient-background styling.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
