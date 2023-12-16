import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import MuiAlert from '@mui/material/Alert';
import apiService from '../../services/apiService';

const QuestionTable = () => {
  const [questions, setQuestions] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [newText, setNewText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('');
  const [newQuizId, setNewQuizId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteQuestion = (questionId) => {
    setSelectedQuestion(questions.find(question => question.id === questionId));
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    const questionId = selectedQuestion.id;
    apiService.deleteQuestion(questionId)
      .then(() => {
        fetchQuestions();
        showSnackbar('Question deleted successfully', 'success');
        setOpenDeleteDialog(false);
      })
      .catch(error => {
        console.error('Error deleting question:', error);
        showSnackbar('Error deleting question', 'error');
        setOpenDeleteDialog(false);
      });
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };
  
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    apiService.getQuestions()
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setNewText(question.text);
    setNewQuestionType(question.questionType || '');
    setNewQuizId(question.quizId || '');
    setOpenEditDialog(true);
  };

  const handleSaveChanges = () => {
    if (selectedQuestion.id) {
      const updatedQuestion = {
        ...selectedQuestion,
        text: newText,
        questionType: newQuestionType,
      };

      apiService.updateQuestion(updatedQuestion.id, updatedQuestion)
        .then(() => {
          fetchQuestions();
          showSnackbar('Question updated successfully', 'success');
          setOpenEditDialog(false);
        })
        .catch(error => {
          console.error('Error updating question:', error);
          showSnackbar('Error updating question', 'error');
        });
    } else {
      handleAddQuestion();
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      text: newText,
      questionType: newQuestionType,
      quizId: newQuizId,
    };

    apiService.createQuestion(newQuestion)
      .then(() => {
        fetchQuestions();
        showSnackbar('Question added successfully', 'success');
        setOpenAddDialog(false);
      })
      .catch(error => {
        console.error('Error adding question:', error);
        showSnackbar('Error adding question', 'error');
      });
  };

  const handleOpenAddDialog = () => {
    setSelectedQuestion({});
    setNewText('');
    setNewQuestionType('');
    setNewQuizId('');
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
      <h3>Question Table</h3>
      <Button variant="contained" onClick={handleOpenAddDialog}>
        Add Question
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Quiz ID</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Question Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.id}</TableCell>
              <TableCell>{question.quizId || '-'}</TableCell>
              <TableCell>{question.text}</TableCell>
              <TableCell>{question.questionType || '-'}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditQuestion(question)}>Edit</Button>
                <Button onClick={() => handleDeleteQuestion(question.id)}>Delete</Button>
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

      {/* Dialog for Add Question */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Question</DialogTitle>
        <DialogContent>
          <TextField
          label="Quiz ID"
          value={newQuizId}
          onChange={(e) => setNewQuizId(e.target.value)}
          fullWidth
          margin="normal"
          />
          <TextField
          label="Text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          fullWidth
          margin="normal"
          />
          <TextField
            label="Question Type"
            value={newQuestionType}
            onChange={(e) => setNewQuestionType(e.target.value)}
            fullWidth
            margin="normal"
          />
          </DialogContent>
          <DialogActions>
          <Button onClick={handleAddQuestion} variant="contained">
            Add Question
          </Button>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Edit Question */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Question Type"
            value={newQuestionType}
            onChange={(e) => setNewQuestionType(e.target.value)}
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
          <p>Are you sure you want to delete the question with ID {selectedQuestion.id}?</p>
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

export default QuestionTable;
