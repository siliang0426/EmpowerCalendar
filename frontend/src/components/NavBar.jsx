import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/WelcomePage.css";
import logo from "../css/image/FigJam_basics.png";
import { useUser } from "../providers/UserProvider";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const NavBar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${backendURL}/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null); // Clear user state
        navigate("/"); // Redirect to home page
      } else {
        console.error("Server responded with an error during logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="welcome-page">
      <nav>
        <Link to="/">
          <img src={logo} alt="App Logo" className="logo" />
        </Link>

        <ul>
          <li>
            <Link to="/chat">GPT</Link>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#how-it-works">How It Works</a>
          </li>
          <li>
            <a href="#about-us">About Us</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        {user ? (
          <button onClick={handleLogout} className="btn">
            Log Out
          </button>
        ) : (
          <Link to="/auth/sign-up" className="btn">
            Get Started
          </Link>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
