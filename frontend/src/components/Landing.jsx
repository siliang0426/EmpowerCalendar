import React from 'react';
import '../css/WelcomePage.css';
// import logo from '../css/image/FigJam basics.png';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      {/* Header
      <nav>
        <img src={logo} alt="App Logo" className="logo" />
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#about-us">About Us</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button class="btn">Get Started</button>
      </nav> */}

      {/* Hero Section */}
      <div class="content">
        <div class="col">
          <h1>Welcome to<br/> [App Name]</h1>
          <p>Helping first-generation low-income students balance work and study schedules effectively.</p>
        </div>

        <div class="col">
          <div class="card card1">
            <h3>Schedule Management</h3>
            <p>Manage your classes and work schedules effortlessly.</p>
          </div>
          <div class="card card2">
            <h3>Job Finder</h3>
            <p>Find jobs that fit your tight schedule.</p>
          </div>
          <div class="card card3">
            <h3>Study card</h3>
            <p>Get optimized study schedules around your work and exams.</p>
          </div>
        </div>
      </div>


      {/* Footer
      <footer>
        <p>Contact us: email@example.com</p>
        <div>
          <a href="#privacy-policy">Privacy Policy</a>
          <a href="#terms-of-service">Terms of Service</a>
        </div>
      </footer>*/}
    </div> 
  );
};

export default WelcomePage;
