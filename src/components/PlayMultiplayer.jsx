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
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/system';
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
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

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

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, isAnswered]);

  const fetchAnswers = async (questionId) => {
    try {
      const answersData = await apiService.getQuestionAnswers(questionId);
      setAnswers(answersData);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const handleRecordAnswer = async () => {
    const answerData = {
      quizSessionResultId,
      questionId: quiz.questions[currentQuestionIndex].id,
      quizAnswerId: selectedAnswerId || null,
      isCorrect: 0,
    };

    await apiService.recordAnswer(answerData);
    setIsAnswered(true);

    // Wait 15 seconds before showing the correct/incorrect answer
    setTimeout(() => {
      setShowCorrectAnswer(true);
    }, 15000);

    // Wait 10 more seconds before moving to the next question
    setTimeout(() => {
      setShowCorrectAnswer(false);
      setIsAnswered(false);
      setTimeLeft(15);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswerId(null);
    }, 25000); // 15 seconds + 10 seconds
  };

  const handleTimeout = () => {
    handleRecordAnswer();
  };

  const handleEndQuiz = async () => {
    if (selectedAnswerId) {
      const answerData = {
        quizSessionResultId,
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

  const StyledPaper = styled(Paper)({
    padding: '16px',
    margin: '16px 0',
    borderRadius: '16px',
  });

  const StyledButton = styled(Button)({
    marginTop: '20px',
    backgroundColor: '#6C63FF',
    '&:hover': {
      backgroundColor: '#574bdb',
    },
  });

  const StyledLinearProgress = styled(LinearProgress)({
    height: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
  });

  const getProgressColor = () => {
    if (timeLeft > 10) return 'green';
    if (timeLeft > 5) return 'orange';
    return 'red';
  };

  if (!quiz) {
    return <div><CircularProgress /></div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        {quiz.title}
      </Typography>
      {showScore ? (
        <div>
          <Snackbar open={showAlert} autoHideDuration={3000} onClose={() => setShowAlert(false)}>
            <Alert severity="success">
              Score Updated.
            </Alert>
          </Snackbar>
          <StyledPaper elevation={3}>
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
                  <StyledPaper key={userAnswer.id} elevation={3}>
                    <Typography variant="body1">
                      {userAnswer.question.text}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: isUserAnswerCorrect ? 'green' : 'red' }}
                    >
                      Your Answer: {correctQuizAnswer.answerText}
                    </Typography>
                  </StyledPaper>
                );
              })}
            <Link to="/quizzes">
              <StyledButton variant="contained">Return to Quizzes</StyledButton>
            </Link>
          </StyledPaper>
        </div>
      ) : (
        <div>
          <StyledLinearProgress
            variant="determinate"
            value={(timeLeft / 15) * 100}
            style={{ backgroundColor: getProgressColor() }}
          />
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
                  disabled={isAnswered}
                  style={{
                    backgroundColor:
                      showCorrectAnswer && answer.isCorrect
                        ? '#8bc34a' // green background for correct answer
                        : selectedAnswerId === answer.id && !answer.isCorrect && showCorrectAnswer
                        ? '#f44336' // red background for incorrect answer
                        : 'transparent',
                    borderRadius: '8px',
                    padding: '8px',
                    margin: '4px 0',
                  }}
                />
              ))}
          </RadioGroup>
          <Box mt={2}>
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <StyledButton variant="contained" onClick={handleRecordAnswer} disabled={!selectedAnswerId || isAnswered}>
                Record my answer
              </StyledButton>
            ) : (
              <StyledButton variant="contained" onClick={handleEndQuiz} disabled={isAnswered}>
                End Quiz
              </StyledButton>
            )}
          </Box>
        </div>
      )}
    </div>
  );
};

export default PlayMultiplayer;
