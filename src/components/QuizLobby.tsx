import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import apiService from '../services/apiService';

interface Participant {
  id: string;
  username: string;
  profilePicture: string | null;
}

const QuizLobby = () => {
  const [quizSessionInfo, setQuizSessionInfo] = useState<any>({});
  const [quizId, setQuizId] = useState<string | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const quizSessionId = searchParams.get('quizSessionId');
  const quizCode = searchParams.get('quizCode');
  const userId = searchParams.get('userId');
  const quizOwner = searchParams.get('quizOwner') === 'true';

  const [connection, setConnection] = useState<HubConnection>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);

  const navigate = useNavigate();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5045/quiz", {
        withCredentials: true
      })
      .build();
    newConnection.start().then(() => {
      if (quizCode && userId) {
        newConnection.invoke('ConnectToQuizSession', parseInt(quizCode), userId);
      }
    });

    setConnection(newConnection);
  }, [quizCode, userId]);

  useEffect(() => {
    fetchQuizSessionInfo();
  }, [quizCode]);

  useEffect(() => {
    if (connection) {
      connection.on("Notify", async data => {
        const participantsData = await apiService.getQuizSessionParticipants(quizSessionId);
        setParticipants(participantsData);
      });

      connection.on("QuizStarted", () => {
        if (!quizOwner) {
          navigate(`/multiplayer/${quizId}`);
        } else {
          setIsQuizStarted(true);
          setCurrentQuestionIndex(1);
        }
      });
    }
  }, [connection, quizId, navigate, quizOwner]);

  useEffect(() => {
    if (isQuizStarted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 1) {
            if (currentQuestionIndex === numberOfQuestions) {
              clearInterval(timer);
              navigate(`/multiplayer-results/${quizSessionId}`);
              return 0;
            } else {
              setCurrentQuestionIndex(prevIndex => prevIndex + 1);
              return 25;
            }
          } else {
            return prev - 1;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isQuizStarted, currentQuestionIndex, numberOfQuestions, navigate, quizSessionId]);

  const fetchQuizSessionInfo = async () => {
    try {
      const data = await apiService.getQuizSessionByCode(quizCode);
      setQuizSessionInfo(data);
      localStorage.setItem('quizSessionId', data.id);
      setQuizId(data.quizId);
      const numQuestions = await apiService.getNumberOfQuestionsByQuizId(data.quizId);
      setNumberOfQuestions(numQuestions);
    } catch (error) {
      console.error("Failed to fetch quiz session info:", error);
    }
  };

  const isHost = participants.some(participant => participant.id === userId && quizOwner);

  const handleStartQuiz = () => {
    if (connection) {
      connection.invoke("StartQuizSession", quizSessionId);
      setIsQuizStarted(true);
    }
  };

  const StyledCard = styled(Card)({
    maxWidth: 300,
    margin: 'auto',
    padding: 20,
    textAlign: 'center',
    borderRadius: 16,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  });

  const StyledAvatar = styled(Avatar)({
    width: 64,
    height: 64,
    margin: '0 auto 10px',
  });

  const StyledButton = styled(Button)({
    marginTop: 20,
    backgroundColor: '#6C63FF',
    '&:hover': {
      backgroundColor: '#574bdb',
    },
  });

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Quiz Code: {quizCode}
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {participants.map(participant => (
          <Grid item key={participant.id}>
            <StyledCard>
              <StyledAvatar alt={participant.username} src={participant.profilePicture || '/default-avatar.png'} />
              <Typography variant="h6">{participant.username}</Typography>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      {isHost && !isQuizStarted && (
        <StyledButton variant="contained" onClick={handleStartQuiz}>
          Start
        </StyledButton>
      )}
      {isHost && isQuizStarted && (
        <StyledCard style={{ marginTop: '15px' }}>
          <CardContent>
            <Typography variant="h6">Users play question #{currentQuestionIndex}. Wait until they finish it💪</Typography>
            <Typography variant="h4">{`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}</Typography>
          </CardContent>
        </StyledCard>
      )}
    </div>
  );
}

export default QuizLobby;
