// src/Login.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import toast from "react-hot-toast";
import GoogleAuthBtn from "./GoogleAuthBtn";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formValidationCheck = () => {
    let validationErrors = {};
    if (!validateEmail(formData.email)) {
      validationErrors.email = "Email must be a valid Gmail address";
    }
    if (formData.password.length === 0) {
      validationErrors.password = "Password cannot be blank!";
    }
    setErrors(validationErrors);
    return validationErrors;
  };

  const submitLogin = async () => {
    try {
      const response = await fetch(`${backendURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resText = await response.text();

      if (!response.ok) {
        toast.error(resText);
      } else {
        toast.success(resText);
      }
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = formValidationCheck();
    if (Object.keys(validationErrors).length !== 0) return;
    submitLogin();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 2 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}
          >
            Login
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: "center", mb: 3 }}
          >
            Welcome! Please Sign In below.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: "green",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
            >
              Sign In
            </Button>
            <GoogleAuthBtn />
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
