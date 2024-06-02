import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  CircularProgress,
  Box
} from '@mui/material';
import { styled } from '@mui/system';
import apiService from '../services/apiService';
import trophyPNG from '../assets/trophy.png';

const MultiplayerResults = () => {
  const { quizSessionId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const quizCode = localStorage.getItem('quizCode');

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participantsData = await apiService.getQuizSessionParticipants(quizSessionId);
        const quizSessionData = await apiService.getQuizSessionInfo(quizSessionId);
        const results = quizSessionData.quizSessionResults;

        const participantsWithScores = participantsData.map(participant => {
          const result = results.find(res => res.userId === participant.userId);
          return { ...participant, score: result ? result.score : 0 };
        });

        participantsWithScores.sort((a, b) => b.score - a.score);
        setParticipants(participantsWithScores);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [quizSessionId]);

  
  const StyledPaper = styled(Paper)({
    padding: '16px',
    margin: '16px 0',
    borderRadius: '16px',
  });

  const StyledAvatar = styled(Avatar)({
    width: 64,
    height: 64,
  });

  const StyledButton = styled(Button)({
    marginTop: '20px',
    backgroundColor: '#6C63FF',
    '&:hover': {
      backgroundColor: '#574bdb',
    },
  });

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          Quiz Summary
        </Typography>
        <img src={trophyPNG} alt="Trophy" width="35%" height="35%" />
        <Typography variant="h5">Congratulations!</Typography>
      </StyledPaper>
      <Typography variant="h6">Here are the results:</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Players</TableCell>
              <TableCell>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant, index) => (
              <TableRow key={participant.userId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <StyledAvatar alt={participant.username} src={participant.profilePicture || '/default-avatar.png'} />
                    <Typography variant="h6" style={{ marginLeft: '10px' }}>{participant.username}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{participant.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to="/quizzes">
        <StyledButton variant="contained">Return to Quizzes</StyledButton>
      </Link>
    </div>
  );
};

export default MultiplayerResults;
