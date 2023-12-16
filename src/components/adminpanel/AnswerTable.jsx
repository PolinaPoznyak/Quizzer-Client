import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, MenuItem, Select } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import apiService from '../../services/apiService';

const AnswerTable = () => {
  const [answers, setAnswers] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [newQuestionId, setNewQuestionId] = useState('');
  const [newAnswerText, setNewAnswerText] = useState('');
  const [newIsCorrect, setNewIsCorrect] = useState('false');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteAnswer = (answerId) => {
    setSelectedAnswer(answers.find(answer => answer.id === answerId));
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    const answerId = selectedAnswer.id;
    apiService.deleteQuizAnswer(answerId)
      .then(() => {
        fetchAnswers();
        showSnackbar('Answer deleted successfully', 'success');
        setOpenDeleteDialog(false);
      })
      .catch(error => {
        console.error('Error deleting answer:', error);
        showSnackbar('Error deleting answer', 'error');
        setOpenDeleteDialog(false);
      });
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = () => {
    apiService.getAllQuestionAnswers()
      .then(data => setAnswers(data))
      .catch(error => console.error('Error fetching answers:', error));
  };

const handleEditAnswer = (answer) => {
  setSelectedAnswer(answer);
  setNewQuestionId(answer.questionId);
  setNewAnswerText(answer.answerText || '');
  setNewIsCorrect(answer.isCorrect.toString());
  setOpenEditDialog(true);
};

const handleSaveChanges = () => {
  if (selectedAnswer.id) {
    const updatedAnswer = {
      ...selectedAnswer,
      questionId: newQuestionId,
      answerText: newAnswerText,
      isCorrect: newIsCorrect === 'true',
    };

    apiService.updateQuizAnswer(updatedAnswer)
      .then(() => {
        fetchAnswers();
        showSnackbar('Answer updated successfully', 'success');
        setOpenEditDialog(false);
      })
      .catch(error => {
        console.error('Error updating answer:', error);
        showSnackbar('Error updating answer', 'error');
      });
  } else {
    handleAddAnswer();
  }
};

const handleAddAnswer = () => {
  const newAnswer = {
    questionId: newQuestionId,
    answerText: newAnswerText,
    isCorrect: newIsCorrect === 'true',
  };

  apiService.createQuizAnswer(newAnswer)
    .then(() => {
      fetchAnswers();
      showSnackbar('Answer added successfully', 'success');
      setOpenAddDialog(false);
    })
    .catch(error => {
      console.error('Error adding answer:', error);
      showSnackbar('Error adding answer', 'error');
    });
};

  const handleOpenAddDialog = () => {
    setSelectedAnswer({});
    setNewQuestionId('');
    setNewAnswerText('');
    setNewIsCorrect(false);
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

  if (!answers) {
    return <div><CircularProgress /></div>;
  }

  const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  return (
    <div>
      <h3>Answer Table</h3>
      <Button variant="contained" onClick={handleOpenAddDialog}>
        Add Answer
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Question ID</TableCell>
            <TableCell>Answer Text</TableCell>
            <TableCell>Is Correct</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {answers.map((answer) => (
            <TableRow key={answer.id}>
              <TableCell>{answer.id}</TableCell>
              <TableCell>{answer.questionId}</TableCell>
              <TableCell>{answer.answerText || '-'}</TableCell>
              <TableCell>{answer.isCorrect ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditAnswer(answer)}>Edit</Button>
                <Button onClick={() => handleDeleteAnswer(answer.id)}>Delete</Button>
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

      {/* Dialog for Add Answer */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Answer</DialogTitle>
        <DialogContent>
          <TextField
            label="Question ID"
            value={newQuestionId}
            onChange={(e) => setNewQuestionId(e.target.value)}
            fullWidth
            margin="dense"
            style={{ marginBottom: '8px' }}
          />
          <TextField
            label="Answer Text"
            value={newAnswerText}
            onChange={(e) => setNewAnswerText(e.target.value)}
            fullWidth
            margin="dense"
            style={{ marginBottom: '8px' }}
          />
          <Select
            label="Is Correct"
            value={newIsCorrect}
            onChange={(e) => setNewIsCorrect(e.target.value)}
            fullWidth
            margin="dense"
            style={{ marginTop: '8px' }}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddAnswer} variant="contained">
            Add Answer
          </Button>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Edit Answer */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Answer</DialogTitle>
        <DialogContent>
          <TextField
            label="Answer Text"
            value={newAnswerText}
            onChange={(e) => setNewAnswerText(e.target.value)}
            fullWidth
            margin="dense"
            style={{ marginTop: '8px' }}
          />
          <Select
            label="Is Correct"
            inputProps={{ 'aria-label': 'Without label' }}
            value={newIsCorrect}
            onChange={(e) => setNewIsCorrect(e.target.value)}
            fullWidth
            margin="dense"
            style={{ marginTop: '8px' }}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
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
          <p>Are you sure you want to delete the answer with ID {selectedAnswer.id}?</p>
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

export default AnswerTable;
