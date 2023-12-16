import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import MuiAlert from '@mui/material/Alert';
import apiService from '../../services/apiService';

const QuizTable = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const authUserId = localStorage.getItem('authUserId');

  const handleDeleteQuiz = (quizId) => {
    setSelectedQuiz(quizzes.find(quiz => quiz.id === quizId));
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    const quizId = selectedQuiz.id;
    apiService.deleteQuiz(quizId)
      .then(() => {
        fetchQuizzes();
        showSnackbar('Quiz deleted successfully', 'success');
        setOpenDeleteDialog(false);
      })
      .catch(error => {
        console.error('Error deleting quiz:', error);
        showSnackbar('Error deleting quiz', 'error');
        setOpenDeleteDialog(false);
      });
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };
  
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    apiService.getQuizzes()
      .then(data => setQuizzes(data))
      .catch(error => console.error('Error fetching quizzes:', error));
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setNewTitle(quiz.title);
    setNewDescription(quiz.description || '');
    setOpenEditDialog(true);
  };

  const handleSaveChanges = () => {
    if (selectedQuiz.id) {
      const updatedQuiz = {
        ...selectedQuiz,
        title: newTitle,
        description: newDescription,
      };

      apiService.updateQuiz(updatedQuiz.id,updatedQuiz)
        .then(() => {
          fetchQuizzes();
          showSnackbar('Quiz updated successfully', 'success');
          setOpenEditDialog(false);
        })
        .catch(error => {
          console.error('Error updating quiz:', error);
          showSnackbar('Error updating quiz', 'error');
        });
    } else {
      handleAddQuiz();
    }
  };

  const handleAddQuiz = () => {
    const newQuiz = {
      id: uuidv4(),
      title: newTitle,
      description: newDescription,
      userId: authUserId,
    };

    apiService.createQuiz(newQuiz)
      .then(() => {
        fetchQuizzes();
        showSnackbar('Quiz added successfully', 'success');
        setOpenAddDialog(false);
      })
      .catch(error => {
        console.error('Error adding quiz:', error);
        showSnackbar('Error adding quiz', 'error');
      });
  };

  const handleOpenAddDialog = () => {
    setSelectedQuiz({});
    setNewTitle('');
    setNewDescription('');
    setOpenAddDialog(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  return (
    <div>
      <h3>Quiz Table</h3>
      <Button variant="contained" onClick={handleOpenAddDialog}>
        Add Quiz
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={quiz.id}>
              <TableCell>{quiz.id}</TableCell>
              <TableCell>{quiz.title}</TableCell>
              <TableCell>{quiz.description || '-'}</TableCell>
              <TableCell>{quiz.userId || '-'}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditQuiz(quiz)}>Edit</Button>
                <Button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Snackbar for Notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog for Add Quiz */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Quiz</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddQuiz} variant="contained">
            Add Quiz
          </Button>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Edit Quiz */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Quiz</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveChanges} variant="contained">
            Save Changes
          </Button>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete the quiz with ID {selectedQuiz.id}?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" variant="contained">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuizTable;
