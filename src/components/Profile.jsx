import React, { useState, useEffect } from 'react';
import { Button, Avatar, TextField, Box, Grid, Typography, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
const authUserId = localStorage.getItem('authUserId');
import apiService from '../services/apiService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const userId = localStorage.getItem('authUserId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
    
    const fetchUserData = async () => {
      try {
        const userData = await apiService.getUserData(userId);
        setUser(userData);
        setTempUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateProfile = async () => {
    try {
      const updatedUserData = { ...user, id: userId }; 
      
      if (user.profilePicture instanceof File) {
        const formData = new FormData();
        formData.append('profilePicture', user.profilePicture);
  
        const imagePathResponse = await apiService.getUserData(formData);
        updatedUserData.profilePicture = imagePathResponse.profilePicture;
      }
  
      if (updatedUserData.profilePicture instanceof File) {
        delete updatedUserData.profilePicture;
      }
  
      const response = await apiService.updateUserData(updatedUserData);
  
      setUser(response);
      setTempUser(response);
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };  

  const handleCancel = () => {
    setUser(tempUser);
    setEditMode(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (file) {
      try {
        const base64String = await convertFileToBase64(file);
        setUser({ ...user, profilePicture: base64String });
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };
  
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        resolve(reader.result);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(file);
    });
  };
  const handleUsernameChange = (e) => {
    setUser({ ...user, username: e.target.value });
  };

  const handleFullNameChange = (e) => {
    setUser({ ...user, fullName: e.target.value });
  };

  const handleEditModeToggle = () => {
    if (editMode) {
      setUser(tempUser);
    } else {
      setTempUser(user);
    }
    setEditMode(!editMode);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (!user) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><CircularProgress /></div>;
  }

  return (
    <div>
      <Navbar />
      <h2>Profile</h2>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Avatar alt="User Avatar" src={user.profilePicture || 'url/to/default/image.jpg'} sx={{ width: 120, height: 120 }} />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          {editMode ? (
            <label htmlFor="profile-picture-input">
              <Button component="span" variant="outlined" sx={{ marginTop: 2 }}>
                Upload Image
              </Button>
            </label>
          ) : (
            <Button variant="outlined" onClick={handleEditModeToggle} sx={{ marginTop: 2 }}>
              Edit
            </Button>
          )}
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Typography variant="subtitle1">Username:</Typography>
        {editMode ? (
          <TextField
            label="Username"
            value={user.username}
            onChange={handleUsernameChange}
            variant="outlined"
            fullWidth
          />
        ) : (
          <Typography variant="body1">{user.username}</Typography>
        )}
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle1">Full Name:</Typography>
        {editMode ? (
          <TextField
            label="Full Name"
            value={user.fullName}
            onChange={handleFullNameChange}
            variant="outlined"
            fullWidth
          />
        ) : (
          <Typography variant="body1">{user.fullName}</Typography>
        )}
      </Box>
      <Box mt={2}>
        {editMode ? (
          <div>
            <Button variant="contained" onClick={handleUpdateProfile}>
              Save Changes
            </Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ marginLeft: 2 }}>
              Cancel
            </Button>
          </div>
        ) : null}
      </Box>
      <Box mt={2}>
        <Button variant="contained" component={Link} to="/userquizzes">
          View My Quizzes
        </Button>
      </Box>
    </div>
  );
};

export default Profile;
