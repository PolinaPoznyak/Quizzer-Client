import React, { useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Grid } from '@mui/material';
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
  const [searchParams] = useSearchParams();
  const quizSessionId = searchParams.get('quizSessionId');
  const quizCode = searchParams.get('quizCode');
  const userId = searchParams.get('userId');

  const [connection, setConnection] = useState<HubConnection>();
  const [participants, setParticipants] = useState<Participant[]>([]);

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
    if (connection) {
      connection.on("Notify", async data => {
        const participantsData = await apiService.getQuizSessionParticipants(quizSessionId);
        setParticipants(participantsData);
      });
    }
  }, [connection, quizSessionId]);

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
  </div>
  );
}

export default QuizLobby;
