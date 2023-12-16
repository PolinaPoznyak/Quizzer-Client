import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import apiService from '../services/apiService';
import Navbar from './Navbar';

const buttonStyle = {
  width: '150px',
  margin: '10px',
};

const buttonEditStyle = {
  width: '100px',
  margin: '5px',
};

const textFieldStyle = {
  width: '500px',
  margin: '10px',
};

const inputLabelStyle = {
  width: '150px',
};

const inputLabelSelectStyle = {
  width: '100px',
};

const EditQuiz = () => {
  const [quizDetails, setQuizDetails] = useState({
    id: '',
    title: '',
    description: '',
  });

  const [questions, setQuestions] = useState([]);
  const [editedQuestion, setEditedQuestion] = useState({
    id: '',
    text: '',
    questionType: '',
    quizId: '',
  });
  const [editedQuestionIndex, setEditedQuestionIndex] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    questionType: 'text',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { quizId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
    
    const fetchQuizDetails = async () => {
      try {
        const quiz = await apiService.getQuizById(quizId);
        setQuizDetails({
          id: quizId,
          title: quiz.title,
          description: quiz.description,
        });
        setQuestions(quiz.questions);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  const handleQuizDetailsChange = (event) => {
    setQuizDetails({
      ...quizDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewQuestionChange = (event) => {
    setNewQuestion({
      ...newQuestion,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditQuestion = (questionId, questionIndex) => {
    const questionToEdit = questions.find((question) => question.id === questionId);

    setEditedQuestion({
      id: questionToEdit.id,
      text: questionToEdit.text,
      questionType: questionToEdit.questionType,
      quizId: quizId,

    });

    setEditedQuestionIndex(questionIndex);
  };

  const handleUpdateQuestion = async () => {
    try {
      await apiService.updateQuestion(editedQuestion.id, {
        id: editedQuestion.id,
        text: editedQuestion.text,
        questionType: editedQuestion.questionType,
        quizId: quizId,
      });

      const updatedQuestions = [...questions];
      updatedQuestions[editedQuestionIndex] = {
        ...updatedQuestions[editedQuestionIndex],
        id: editedQuestion.id,
        text: editedQuestion.text,
        questionType: editedQuestion.questionType,
        quizId: quizId,
      };

      setQuestions(updatedQuestions);

      setSuccessMessage('Question updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating question:', error);
    }

    setEditedQuestion({
      id: '',
      text: '',
      questionType: '',
      quizId: '',
    });
    setEditedQuestionIndex(null);
  };

  const handleAddQuestion = async () => {
    try {
      const createdQuestion = await apiService.createQuestion({
        text: newQuestion.text,
        questionType: newQuestion.questionType,
        quizId: quizId,
      });

      setQuestions([...questions, createdQuestion]);
      setNewQuestion({
        text: '',
        questionType: 'text',
      });
      setSuccessMessage('Question added successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await apiService.deleteQuestion(questionId);
      setQuestions(questions.filter((question) => question.id !== questionId));
      setSuccessMessage('Question deleted successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleUpdateQuiz = async () => {
    try {
      await apiService.updateQuiz(quizId, {
        id: quizId,
        title: quizDetails.title,
        description: quizDetails.description,
      });

      setSuccessMessage('Quiz updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Edit Quiz</h2>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>

      <TextField
        name="title"
        label="Title"
        value={quizDetails.title}
        onChange={handleQuizDetailsChange}
        style={textFieldStyle}
        variant="outlined"
      />
      <br />
      <TextField
        name="description"
        label="Description"
        value={quizDetails.description}
        onChange={handleQuizDetailsChange}
        style={textFieldStyle}
        variant="outlined"
      />
      <br />
      {/* Update quiz */}
      <Button onClick={handleUpdateQuiz} variant="contained" style={buttonStyle}>
        Update Title & Description
      </Button>

      {/* Display questions for editing */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question Text</TableCell>
              <TableCell>Question Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question, questionIndex) => (
              <TableRow key={question.id}>
                <TableCell>{question.text}</TableCell>
                <TableCell>{question.questionType}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditQuestion(question.id, questionIndex)}
                    variant="outlined"
                    style={buttonEditStyle}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteQuestion(question.id)}
                    variant="outlined"
                    style={buttonEditStyle}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit question */}
      {editedQuestionIndex !== null && (
        <div>
          <TextField
            name="text"
            label="Question Text"
            value={editedQuestion.text}
            onChange={(event) =>
              setEditedQuestion({
                ...editedQuestion,
                [event.target.name]: event.target.value,
              })
            }
            style={{ margin: '10px' }}
            variant="outlined"
          />
          <FormControl style={{ margin: '10px', minWidth: '120px' }}>
            <InputLabel>Question Type</InputLabel>
            <Select
              name="questionType"
              value={editedQuestion.questionType}
              onChange={(event) =>
                setEditedQuestion({
                  ...editedQuestion,
                  [event.target.name]: event.target.value,
                })
              }
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="singleChoice">Single Choice</MenuItem>
              <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={handleUpdateQuestion} variant="contained" style={buttonStyle}>
            Update Question
          </Button>
        </div>
      )}

      {/* Add new question */}
      <TextField
        name="text"
        label="New Question Text"
        value={newQuestion.text}
        onChange={handleNewQuestionChange}
        style={{ margin: '10px' }}
        variant="outlined"
      />
      <FormControl style={{ margin: '10px', minWidth: '120px' }}>
        <InputLabel>Question Type</InputLabel>
        <Select
          name="questionType"
          value={newQuestion.questionType}
          onChange={handleNewQuestionChange}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="singleChoice">Single Choice</MenuItem>
          <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleAddQuestion} variant="contained" style={buttonStyle}>
        Add New Question
      </Button>
      <br />
      <Link to="/userquizzes">
        <Button variant="outlined" style={buttonStyle}>
          Back to My Quizzes
        </Button>
      </Link>
    </div>
  );
};

export default EditQuiz;
