import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import apiService from '../services/apiService';

const buttonStyle = {
  width: '150px',
  margin: '10px',
};

const textFieldStyle = {
  width: '500px',
};

const inputLabelStyle = {
  width: '150px',
};

const inputLabelSelectStyle = {
  width: '100px',
};

const uploadButtonStyle = {
  width: '250px',
  margin: '25px',
  display: 'inline-block',
  foreground: '#6100C1',
};

const hiddenInputStyle = {
  display: 'none',
};

const imageStyle = {
  display: 'block',
  marginTop: '10px',
  maxWidth: '300px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px #272727',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const CreateQuiz = () => {
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
    quizPicture: '',
    isMultiplayer: false,
  });

  const [questions, setQuestions] = useState([]);
  const [createdQuiz, setCreatedQuiz] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleQuizDetailsChange = (event) => {
    setQuizDetails({
      ...quizDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleIsMultiplayerToggle = (event) => {
    setQuizDetails({
      ...quizDetails,
      isMultiplayer: event.target.checked,
    });
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        questionType: '',
        questionPicture: '',
        answers: [],
      },
    ]);
  };

  const handleQuestionChange = (event, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex][event.target.name] = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (event, questionIndex, answerIndex) => {
    const updatedQuestions = questions.slice();
    const updatedAnswers = updatedQuestions[questionIndex].answers.slice();

    updatedAnswers[answerIndex] = Object.assign({}, updatedAnswers[answerIndex], {
      [event.target.name]: event.target.value,
    });

    updatedQuestions[questionIndex] = Object.assign({}, updatedQuestions[questionIndex], {
      answers: updatedAnswers,
    });

    setQuestions(updatedQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const updatedQuestions = questions.slice();
    const updatedAnswers = updatedQuestions[questionIndex].answers.slice();

    updatedAnswers.push({
      answerText: '',
      isCorrect: false,
    });

    updatedQuestions[questionIndex] = Object.assign({}, updatedQuestions[questionIndex], {
      answers: updatedAnswers,
    });

    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(questionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    const updatedAnswers = updatedQuestions[questionIndex].answers.slice();
    updatedAnswers.splice(answerIndex, 1);
    updatedQuestions[questionIndex].answers = updatedAnswers;
    setQuestions(updatedQuestions);
  };

  const handleNextStep = async () => {
    try {
      let createdQuizResponse;

      if (createdQuiz === null) {
        // Step 1: Create the quiz
        createdQuizResponse = await apiService.createQuiz({
          title: quizDetails.title,
          description: quizDetails.description,
          quizPicture: quizDetails.quizPicture,
          isMultiplayer: quizDetails.isMultiplayer,
        });

        if (createdQuizResponse && createdQuizResponse.id) {
          setCreatedQuiz(createdQuizResponse);
        } else {
          // Handle error if quiz creation fails
          return;
        }
      }

      // Step 2: Add questions to the quiz
      await Promise.all(
        questions.map(async (question) => {
          const createdQuestionResponse = await apiService.createQuestion({
            text: question.text,
            questionType: question.questionType,
            questionPicture: question.questionPicture,
            quizId: createdQuizResponse.id,
          });

          // Handle error if question creation fails
          if (!createdQuestionResponse || !createdQuestionResponse.id) {
            console.error('Error creating question:', createdQuestionResponse);
          }

          // Step 3: Add answers to the question
          await Promise.all(
            question.answers.map(async (answer) => {
              await apiService.createQuizAnswer({
                answerText: answer.answerText,
                isCorrect: answer.isCorrect,
                questionId: createdQuestionResponse.id,
              });
            })
          );
        })
      );

      setSuccessMessage('Quiz created successfully!');
      setSnackbarOpen(true);

      setTimeout(() => {
        window.location.href = '/userquizzes';
      }, 2000);
    } catch (error) {
      console.error('Error during quiz creation:', error);
    }
  };

  const handleFileChange = (event, questionIndex = null) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (questionIndex === null) {
          setQuizDetails({
            ...quizDetails,
            quizPicture: e.target.result,
          });
        } else {
          const updatedQuestions = [...questions];
          updatedQuestions[questionIndex].questionPicture = e.target.result;
          setQuestions(updatedQuestions);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Create Your Quiz!</h2>
      <h3>1. Just write title and description</h3>
      {/* Quiz Details Form */}
      <TextField
        name="title"
        label="Title"
        value={quizDetails.title}
        onChange={handleQuizDetailsChange}
        style={textFieldStyle}
        margin="normal"
        variant="outlined"
      />
      <br />
      <TextField
        name="description"
        label="Description"
        value={quizDetails.description}
        onChange={handleQuizDetailsChange}
        style={textFieldStyle}
        margin="normal"
      />
      <br />
      <FormControlLabel
        control={
          <Switch
            checked={quizDetails.isMultiplayer}
            onChange={handleIsMultiplayerToggle}
            name="isMultiplayer"
            color="primary"
          />
        }
        label="Is Multiplayer"
      />
      {quizDetails.quizPicture && (
        <img
          src={quizDetails.quizPicture}
          alt="Quiz"
          style={imageStyle}
        />
      )}
      <input
        accept="image/*"
        style={hiddenInputStyle}
        id="upload-photo"
        type="file"
        onChange={(e) => handleFileChange(e)}
      />
      <label htmlFor="upload-photo">
        <Button variant="contained" component="span" style={uploadButtonStyle} >
          Upload Quiz Picture
        </Button>
      </label>
      <br />
      <hr style={{ margin: '20px 0' }} />
      <h3>2. Add questions and answers on them</h3>

      {/* Display questions and answers */}
      {questions.map((question, questionIndex) => (
        <div key={questionIndex}>
          {question.questionPicture && (
            <img
              src={question.questionPicture}
              alt="Question"
              style={imageStyle}
            />
          )}
          <input
            accept="image/*"
            style={hiddenInputStyle}
            id={`upload-question-photo-${questionIndex}`}
            type="file"
            onChange={(e) => handleFileChange(e, questionIndex)}
          />
          <label htmlFor={`upload-question-photo-${questionIndex}`}>
            <Button variant="contained" component="span" style={uploadButtonStyle}>
              Upload Question Picture
            </Button>
          </label>
          <br></br>
          <TextField
            name="text"
            label="Question Text"
            value={question.text}
            onChange={(event) => handleQuestionChange(event, questionIndex)}
            style={textFieldStyle}
            margin="normal"
          />
          <FormControl 
          style={{ marginLeft: '19px' }}
          margin="normal">
            <InputLabel id={`question-type-label-${questionIndex}`}>
              Question Type
            </InputLabel>
            <Select
              labelId={`question-type-label-${questionIndex}`}
              name="questionType"
              value={question.questionType}
              onChange={(event) => handleQuestionChange(event, questionIndex)}
              style={inputLabelStyle}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="singleChoice">Single Choice</MenuItem>
              <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
              {/* Add other question types as needed */}
            </Select>
          </FormControl>
          {/* Button to delete the current question */}
          <Button
            onClick={() => handleDeleteQuestion(questionIndex)}
            variant="outlined"
            style={{ width: '50px', height: '50px', margin: '19px' }}
          >
            ✖
          </Button>
          <br />
          <h3>Answers:</h3>
          {/* Display answers for the current question */}
          {question.answers.map((answer, answerIndex) => (
            <div key={answerIndex}>
              <TextField
                name="answerText"
                label="Answer Text"
                value={answer.answerText}
                onChange={(event) =>
                  handleAnswerChange(event, questionIndex, answerIndex)
                }
                style={textFieldStyle}
                margin="normal"
              />
              <FormControl 
              style={{ marginLeft: '19px' }}
              margin="normal">
                <InputLabel
                  id={`is-correct-label-${questionIndex}-${answerIndex}`}
                >
                  Is Correct
                </InputLabel>
                <Select
                  style={inputLabelSelectStyle}
                  labelId={`is-correct-label-${questionIndex}-${answerIndex}`}
                  name="isCorrect"
                  value={answer.isCorrect}
                  onChange={(event) =>
                    handleAnswerChange(event, questionIndex, answerIndex)
                  }
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
              
              {/* Button to delete the current answer */}
              <Button
                onClick={() => handleDeleteAnswer(questionIndex, answerIndex)}
                variant="outlined"
                style={{ width: '50px', height: '50px', margin: '19px' }}
              >
                ❌
              </Button>
            </div>
          ))}

          {/* Button to add answer for the current question */}
          <Button
            onClick={() => handleAddAnswer(questionIndex)}
            variant="outlined"
            style={buttonStyle}
          >
            Add Answer
          </Button>

          <hr style={{ margin: '20px 0' }} /> {/* Horizontal line as a separator */}
        </div>
      ))}
      {/* Button to add question */}
      <Button onClick={handleAddQuestion} variant="outlined" style={buttonStyle}>
        Add New Question
      </Button>
      {/* Button to move to the next step */}
      <br />
      <Button onClick={handleNextStep} variant="outlined" style={buttonStyle}>
        Create Quiz
      </Button>
      <br />
      {/* Link to go back to the user quizzes page */}
      <Link to="/userquizzes">
        <Button variant="contained" style={buttonStyle}>
          Back to My Quizzes
        </Button>
      </Link>

      {/* Snackbar to display success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default CreateQuiz;
