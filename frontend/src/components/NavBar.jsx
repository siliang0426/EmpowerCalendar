import React from 'react';
import '../css/WelcomePage.css';
import logo from '../css/image/FigJam basics.png';

const NavBar = () => {
    return (
      <div className="welcome-page">
        {/* Header */}
        <nav>
          <img src={logo} alt="App Logo" className="logo" />
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button class="btn">Get Started</button>
        </nav>
        </div>
    )
}
export default NavBar