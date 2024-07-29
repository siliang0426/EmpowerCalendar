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
import toast from "react-hot-toast";
import GoogleAuthBtn from "./GoogleAuthBtn";
import { useNavigate } from "react-router-dom";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

    if (
      formData.password.length === 0 ||
      formData.confirmPassword.length === 0
    ) {
      validationErrors.password =
        "Both password and confirm password must be filled!";
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.password = "Passwords do not match!";
    }

    if (formData.first_name.length === 0) {
      validationErrors.first_name = "First name cannot be empty!";
    }

    if (formData.last_name.length === 0) {
      validationErrors.last_name = "Last name cannot be empty!";
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  const submitSignUp = async () => {
    try {
      const response = await fetch(`${backendURL}/auth/register`, {
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

    submitSignUp();
  };

  const navToSignIn = () => {
    navigate("/auth/sign-in");
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
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
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
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
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
            <GoogleAuthBtn />
            <div>
              <p className="text-center">Or</p>
              <h2
                className="text-xl font-bold underline text-center hover:cursor-pointer"
                onClick={navToSignIn}
              >
                Already Have an Account?
              </h2>
            </div>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
