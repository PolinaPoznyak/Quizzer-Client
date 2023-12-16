import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import apiService from '../services/apiService';

const buttonStyle = {
  width: '150px',
  margin: '10px',
};

const buttonEditStyle = {
  width: '100px',
  margin: '5px',
};

const UserQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const userId = localStorage.getItem('authUserId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }

    const fetchUserQuizzes = async () => {
      try {
        if (userId) {
          const userQuizzes = await apiService.getQuizzesByUserId(userId);
          setQuizzes(userQuizzes);
        }
      } catch (error) {
        console.error('Error fetching user quizzes:', error);
      }
    };

    fetchUserQuizzes();
  }, [userId]);

  const handleDeleteQuiz = async () => {
    try {
      await apiService.deleteQuiz(quizToDelete.id);
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizToDelete.id));
      setSuccessMessage('Quiz deleted successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDeleteConfirmationOpen = (quiz) => {
    setQuizToDelete(quiz);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setQuizToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <div>
      <Navbar />
      <h2>My Quizzes</h2>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.description}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/editquiz/${quiz.id}`} variant="outlined" style={buttonEditStyle}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteConfirmationOpen(quiz)} variant="outlined" style={buttonEditStyle}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button component={Link} to="/addquiz" variant="contained" style={buttonStyle}>
        Add Quiz
      </Button>
      <br />
      <Link to="/profile">
        <Button variant="outlined" style={buttonStyle}>
          Back to Profile
        </Button>
      </Link>
{/* Delete Confirmation Dialog */}
<Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
        <DialogTitle>Delete Quiz</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the quiz "{quizToDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteQuiz} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserQuizzes;
