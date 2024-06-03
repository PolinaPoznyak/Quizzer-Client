import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import apiService from '../services/apiService';
import ConnectQuiz from './ConnectQuiz';
import quizBG from '../assets/quizBG.jpg';

const QuizList = () => {
  const [data, setData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
    
    apiService.getQuizzes()
      .then(responseData => {
        setData(responseData);
      })
      .catch(error => {
        console.error('Error fetching quizzes:', error);
      });
  }, []);

  const handleStartQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setOpenDialog(true);
  };

  const handleConfirmStartQuiz = async () => {
    try {
      var createdQuizSession = await apiService.createQuizSession(selectedQuizId);
      console.log('Quiz session created successfully.');
      localStorage.setItem('quizSessionId', createdQuizSession.id);
      localStorage.setItem('quizSessionResultId', createdQuizSession.quizSessionResults[0].id);
      window.location.href = `/quiz/${selectedQuizId}`;
    } catch (error) {
      console.error('Error creating quiz session:', error);
    }
  };

  const handleCancelStartQuiz = () => {
    setOpenDialog(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <br/>
      <ConnectQuiz />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Explore Quizzes
        </Typography>
        <TextField
          label="Search quizzes..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <Grid container spacing={4} sx={{ marginTop: 1 }}>
          {data &&
            data
              .filter(
                (quiz) =>
                  quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((quiz) => (
                <Grid item xs={12} sm={6} key={quiz.id}>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardMedia
                      sx={{ height: 200 }}
                      image={quiz.quizPicture || quizBG }
                      title={quiz.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">{quiz.title}</Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {quiz.description}
                      </Typography>
                      <Button variant="contained" onClick={() => handleStartQuiz(quiz.id)}>
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancelStartQuiz}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you ready to start the quiz?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Starting the quiz will create a quiz session. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelStartQuiz} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmStartQuiz} color="primary" autoFocus>
            Start Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuizList;
