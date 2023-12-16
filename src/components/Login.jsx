import React, { useState } from 'react';
import { Card, Box, Button, CardContent, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import Center from './Center';
import apiService from '../services/apiService';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [openBlockedDialog, setOpenBlockedDialog] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const isUserAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const decodedToken = jwtDecode(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return role === 'Admin';
  };

  const login = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await axios.post('http://localhost:5045/api/user/login', {
          username: values.username,
          email: values.email,
          password: values.password,
        });

        const token = response.data.token;

        const decodedToken = jwtDecode(token);
        const authUserId = decodedToken.unique_name;
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        localStorage.setItem('token', token);
        localStorage.setItem('authUserId', authUserId);
        localStorage.setItem('role', role);

        console.log(decodedToken);
        console.log(token);
        console.log('User ID:', authUserId);
        console.log('Role:', role);

        // Проверка статуса пользователя
        const userData = await apiService.getUserData(authUserId);
        const isDeleted = userData.isDeleted;

        if (isDeleted) {
          // Показать диалоговое окно с сообщением о заблокированном аккаунте
          setOpenBlockedDialog(true);
        } else {
          // Продолжить навигацию в зависимости от роли
          if (isUserAdmin()) {
            navigate('/adminpanel');
          } else {
            navigate('/main');
          }
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  const validate = () => {
    let temp = {};
    temp.email = /\S+@\S+\.\S+/.test(values.email) ? '' : 'Email is not valid.';
    temp.username = values.username !== '' ? '' : 'Username is required.';
    temp.password = values.password !== '' ? '' : 'Password is required.';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };

  const handleCloseBlockedDialog = () => {
    setOpenBlockedDialog(false);
  };

  return (
    <Center>
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ my: 3 }}>
            Log In
          </Typography>
          <Box
            sx={{
              '& .MuiTextField-root': {
                m: 1,
                width: '90%',
              },
            }}
          >
            <form noValidate autoComplete="off" onSubmit={login}>
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
              <Button type="submit" variant="contained" size="large" sx={{ width: '90%' }}>
                Start
              </Button>
            </form>
          </Box>

          {/* Additional section for first-time visitors */}
          <Typography variant="body2" sx={{ mt: 3 }}>
            First time here?{' '}
            <Link to="/signup">Register now!</Link>
          </Typography>
        </CardContent>
      </Card>

      {/* Dialog for Blocked Account */}
      <Dialog open={openBlockedDialog} onClose={handleCloseBlockedDialog}>
        <DialogTitle>Account Blocked</DialogTitle>
        <DialogContent>
          <Alert severity="error">Sorry, your account has been blocked.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBlockedDialog} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Center>
  );
}
