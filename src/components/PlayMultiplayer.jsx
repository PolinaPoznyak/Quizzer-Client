import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import apiService from '../services/apiService';

const PlayMultiplayer = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const quizSessionResultId = localStorage.getItem('quizSessionResultId');
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
    
    const fetchQuiz = async () => {
      try {
        const quizData = await apiService.getQuizById(id);
        setQuiz(quizData);
        fetchAnswers(quizData.questions[currentQuestionIndex].id);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [id, currentQuestionIndex]);

  useEffect(() => {
    const fetchUserAnswers = async () => {
      try {
        const userAnswersData = await apiService.getUserAnswersBySessionResultId(quizSessionResultId);
        setUserAnswers(userAnswersData);
      } catch (error) {
        console.error('Error fetching user answers:', error);
      }
    };

    if (showScore && quizSessionResultId) {
      fetchUserAnswers();
    }
  }, [showScore, quizSessionResultId]);

  const fetchAnswers = async (questionId) => {
    try {
      const answersData = await apiService.getQuestionAnswers(questionId);
      setAnswers(answersData);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const handleNextQuestion = async () => {
    if (selectedAnswerId) {
      const answerData = {
        quizSessionResultId: quizSessionResultId,
        questionId: quiz.questions[currentQuestionIndex].id,
        quizAnswerId: selectedAnswerId,
        isCorrect: 0,
      };

      await apiService.recordAnswer(answerData);

      setSelectedAnswerId(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      console.warn('Please select an answer before proceeding.');
    }
  };

  const handleEndQuiz = async () => {
    if (selectedAnswerId) {
      const answerData = {
        quizSessionResultId: quizSessionResultId,
        questionId: quiz.questions[currentQuestionIndex].id,
        quizAnswerId: selectedAnswerId,
        isCorrect: 0,
      };

      await apiService.recordAnswer(answerData);
    }

    try {
      await apiService.updateQuizSessionResult(quizSessionResultId, {
        id: quizSessionResultId,
      });

      const updatedResult = await apiService.getQuizSessionResult(quizSessionResultId);
      setScore(updatedResult.score);
      setShowScore(true);
      setShowAlert(true);
    } catch (error) {
      console.error('Error updating quiz session result:', error);
    }
  };

  const handleAnswerChange = (event) => {
    setSelectedAnswerId(event.target.value);
  };

  if (!quiz) {
    return <div><CircularProgress /></div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  return (
    <div className='question-container'>
      <div>
        <Typography variant="h4">{quiz.title}</Typography>
        <br />
        {showScore ? (
          <div>
            <Snackbar open={showAlert} autoHideDuration={3000} onClose={() => setShowAlert(false)}>
              <Alert severity="success">
                Score Updated.
              </Alert>
            </Snackbar>
            <Paper elevation={3} style={{ padding: '16px', margin: '16px 0' }}>
              <Typography variant="h6">Quiz Complete!</Typography>
              <Typography variant="h6">Your Score: {score}</Typography>
              <Typography variant="h6">Question-wise Results:</Typography>
              {Array.isArray(userAnswers) &&
                userAnswers.map((userAnswer) => {
                  const isUserAnswerCorrect = userAnswer.isCorrect === 1;
                  const correctQuizAnswer = userAnswer.quizAnswer;
                  const correctAnswer = Array.isArray(correctQuizAnswer)
                    ? correctQuizAnswer.find((answer) => answer.isCorrect === true)
                    : correctQuizAnswer;

                  return (
                    <Paper
                      key={userAnswer.id}
                      elevation={3}
                      style={{ padding: '16px', margin: '16px 0' }}
                    >
                      <Typography variant="body1">
                        {userAnswer.question.text}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: isUserAnswerCorrect ? 'green' : 'red' }}
                      >
                        Your Answer: {correctQuizAnswer.answerText}
                      </Typography>
                    </Paper>
                  );
                })}
              <Link to="/quizzes">
                <Button variant="contained">Return to Quizzes</Button>
              </Link>
            </Paper>
          </div>
        ) : (
          <div>
            <Typography variant="h6">{currentQuestion.text}</Typography>
            <RadioGroup
              aria-label="answers"
              name="answers"
              value={selectedAnswerId}
              onChange={handleAnswerChange}
            >
              {answers &&
                answers.map((answer) => (
                  <FormControlLabel
                    key={answer.id}
                    value={answer.id}
                    control={<Radio />}
                    label={answer.answerText}
                  />
                ))}
            </RadioGroup>
            <Box mt={2}>
              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button variant="contained" onClick={handleNextQuestion}>
                  Next Question
                </Button>
              ) : (
                <Button variant="contained" onClick={handleEndQuiz}>
                  End Quiz
                </Button>
              )}
            </Box>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayMultiplayer;