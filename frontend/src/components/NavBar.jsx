import React from 'react';
import {Link} from 'react-router-dom';
import '../css/WelcomePage.css';
import logo from '../css/image/FigJam_basics.png';

const NavBar = () => {
    return (
      <div className="welcome-page">
        {/* Header */}
        <nav>
          <Link to="/" >
          <img src={logo} alt="App Logo" className="logo" />
          </Link>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <Link to="/auth/sign-up" className="btn">Get Started</Link>
        </nav>
        </div>
    )
}
export default NavBar