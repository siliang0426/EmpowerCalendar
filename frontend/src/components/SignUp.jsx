// src/SignUp.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!validateEmail(formData.email)) {
      validationErrors.email = "Email must be a valid Gmail address";
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.password = "Passwords do not match";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    // Submit the form
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
            Sign Up
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: "center", mb: 3 }}
          >
            Please use your Gmail account (@gmail.com)
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
              helperText={errors.password && "Passwords do not match"}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password && "Passwords do not match"}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.5 }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
