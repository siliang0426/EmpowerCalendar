import React from 'react';
import '../css/WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      {/* Header */}
      <header>
        <img src="logo.png" alt="App Logo" className="logo" />
        <nav>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about-us">About Us</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero">
        <h1>Welcome to [App Name]</h1>
        <p>Helping first-generation low-income students balance work and study schedules effectively.</p>
        <button>Get Started</button>
      </section>

      {/* Features Section */}
      <section id="features">
        <h2>Key Features</h2>
        <div className="feature">
          <h3>Schedule Management</h3>
          <p>Manage your classes and work schedules effortlessly.</p>
        </div>
        <div className="feature">
          <h3>Job Finder</h3>
          <p>Find jobs that fit your tight schedule.</p>
        </div>
        <div className="feature">
          <h3>Study Planner</h3>
          <p>Get optimized study schedules around your work and exams.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li>Connect Google Calendar</li>
          <li>Enter Your Schedule</li>
          <li>Find Jobs</li>
          <li>Get Study Suggestions</li>
        </ol>
      </section>

      {/* About Us Section */}
      <section id="about-us">
        <h2>About Us</h2>
        <p>Our mission is to help first-generation low-income students succeed by balancing work and study schedules.</p>
        <div className="team-member">
          <h3>John Doe</h3>
          <p>CEO & Founder</p>
        </div>
        <div className="team-member">
          <h3>Jane Smith</h3>
          <p>CTO</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>Contact us: email@example.com</p>
        <div>
          <a href="#privacy-policy">Privacy Policy</a>
          <a href="#terms-of-service">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
