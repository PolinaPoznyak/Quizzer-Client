import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Snackbar, Card, Box, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import apiService from '../services/apiService';

const cardStyle = {
  backgroundColor: '#6100C1',
  padding: '20px',
};

const textFieldStyle = {
  margin: '0 10px',
  height: '56px',
};

const buttonStyle = {
  margin: '0 10px',
  height: '56px',
};

const ConnectQuiz = () => {
  const [quizCode, setQuizCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const userId = localStorage.getItem('authUserId');
  const navigate = useNavigate();

  const handleQuizCodeChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setQuizCode(value);
    }
  };

  const handleConfirmConnectQuiz = async () => {
    try {
      const response = await apiService.createQuizSessionResultByQuizCode(quizCode);
      var quizSessionResultId = response.id;
      var quizSessionId = response.quizSessionId;
      localStorage.setItem('quizSessionResultId', quizSessionResultId);
      localStorage.setItem('quizSessionId', quizSessionId);
      localStorage.setItem('quizCode', quizCode);
      setSuccessMessage('Connected to quiz successfully!');
      setErrorMessage('');
      setOpenSnackbar(true);
      navigate(`/quiz-lobby?quizSessionId=${quizSessionId}&quizCode=${quizCode}&userId=${userId}`);
    } catch (error) {
      setErrorMessage('Failed to connect to quiz.');
      setSuccessMessage('');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card style={cardStyle}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6">To participate in the quiz, enter the code:</Typography>
        <TextField
          required
          id="quizCode"
          name="quizCode"
          label="Quiz Code"
          variant="outlined"
          value={quizCode}
          onChange={handleQuizCodeChange}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          style={textFieldStyle}
        />
        <Button
          onClick={handleConfirmConnectQuiz}
          variant="contained"
          color="primary"
          style={buttonStyle}
        >
          Connect
        </Button>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity={successMessage ? 'success' : 'error'} sx={{ width: '100%' }}>
          {successMessage || errorMessage}
        </MuiAlert>
      </Snackbar>
    </Card>
  );
};

export default ConnectQuiz;
