import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import Navbar from './Navbar';
import LearningBroSVG from '../assets/Learning.svg';

const Main = () => {
  return (
    <Container>
      <Navbar />
      <Box mt={5} textAlign="center">
        <Typography variant="h2" gutterBottom>
          What is a quizzer?
        </Typography>
        <Typography variant="h4" style={{ flex: 1 }}>
          Quizzer - platform for entertainment and interactive learning
        </Typography>
      </Box>

      <Box mt={5} display="flex" justifyContent="center" alignItems="center">
        <img src={LearningBroSVG} alt="Learning Bro" width="45%" height="40%" />

        <Paper
          elevation={5}
          sx={{
            width: '50%',
            height: '50%',
            marginLeft: '20px',
            boxShadow: '0px 0px 20px rgba(64, 123, 255, 0.5)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h6" style={{ margin: '50px' }}>
            You can take others' quizzes, but what's equally interesting is that you can create your own quizzes,
            both for fun and for study. And your friends will be able to take your quizzes with you.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Main;
