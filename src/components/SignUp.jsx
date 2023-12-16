import React, { useState } from 'react';
import { Card, Box, Button, CardContent, TextField, Typography, Alert, Snackbar } from '@mui/material';
import Center from './Center';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' }); // State for MuiAlert
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  
    if (name === 'password') {
      setValues((prevValues) => ({
        ...prevValues,
        confirmPassword: '',
      }));
    }
  };  

  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const signUp = async (e) => {
    e.preventDefault();

    if (validate()) {
      if (!values.confirmPassword) {
        showAlert('Password not confirmed. Please confirm your password.', 'error');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5045/api/user/register', {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: true
        });

        const token = response.data.token;

        localStorage.setItem('token', token);

        console.log('Registration successful:', response.data);
        showAlert('Registration successful!', 'success');
        navigate('/login');
      } catch (error) {
        console.error('Error during registration:', error);
        showAlert('Error during registration. Please try again.', 'error');
      }
    }
  };

  const validate = () => {
    let temp = {};
    temp.email = /\S+@\S+\.\S+/.test(values.email) ? '' : 'Email is not valid.';
    temp.username = values.username !== '' ? '' : 'Username is required.';
    temp.password = values.password !== '' ? '' : 'Password is required.';
    temp.confirmPassword =
      values.confirmPassword === values.password ? '' : 'Passwords do not match.';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };

  const closeAlert = () => {
    setAlert({ open: false, message: '', severity: 'success' });
  };

  return (
    <Center>
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ my: 3 }}>
            Sign Up
          </Typography>

          <Box
            sx={{
              '& .MuiTextField-root': {
                m: 1,
                width: '90%'
              }
            }}
          >
            <form noValidate autoComplete="off" onSubmit={signUp}>
              <TextField
                label="Username"
                name="username"
                value={values.username}
                onChange={handleInputChange}
                variant="outlined"
                {...(errors.username && { error: true, helperText: errors.username })}
              />
              <TextField
                label="Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                variant="outlined"
                {...(errors.email && { error: true, helperText: errors.email })}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleInputChange}
                variant="outlined"
                {...(errors.password && { error: true, helperText: errors.password })}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleInputChange}
                variant="outlined"
                {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword })}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: '90%' }}
              >
                Sign Up
              </Button>
            </form>
          </Box>

          {/* Additional section for already registered users */}
          <Typography variant="body2" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link to="/login">Log in here</Link>
          </Typography>
        </CardContent>
      </Card>

      {/* MuiAlert and Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Center>
  );
}
