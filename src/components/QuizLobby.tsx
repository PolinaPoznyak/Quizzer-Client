import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Grid, Button } from '@mui/material';
import apiService from '../services/apiService';

interface ConnectToQuizRequest {
  userId: string;
  connectionCode: number;
}

interface Participant {
    id: string;
    username: string;
    profilePicture: string | null;
}

const QuizLobby = () => {
  const [quizSessionInfo, setQuizSessionInfo] = useState<any>({});
  const [quizId, setQuizId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const quizSessionId = searchParams.get('quizSessionId');
  const quizCode = searchParams.get('quizCode');
  const userId = searchParams.get('userId');
  const quizOwner = searchParams.get('quizOwner');

  const [connection, setConnection] = useState<HubConnection>();
  const [participants, setParticipants] = useState<Participant[]>([]);

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
        navigate(`/quiz/${quizId}`);
      });
    }
  }, [connection, quizId]);

  const isHost = participants.some(participant => participant.id === userId && quizOwner === 'true');

  const handleStartQuiz = () => {
    if (connection) {
        connection.invoke("StartQuizSession", quizSessionId);
    }
  };

  const fetchQuizSessionInfo = async () => {
    try {
      const data = await apiService.getQuizSessionByCode(quizCode);
      setQuizSessionInfo(data);
      setQuizId(data.quizId);
    } catch (error) {
      console.error("Failed to fetch quiz session info:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
    <Typography variant="h4" gutterBottom>
      Quiz Code: {quizCode}
    </Typography>
    <Grid container spacing={2} justifyContent="center">
      {participants.map(participant => (
        <Grid item key={participant.id}>
          <Card>
            <CardContent>
              <Avatar alt={participant.username} src={participant.profilePicture || '/default-avatar.png'} />
              <Typography variant="h6">{participant.username}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    {isHost && (
      <Button variant="contained" onClick={handleStartQuiz}>
        Start
      </Button>
    )}
  </div>
  );
}

export default QuizLobby;
