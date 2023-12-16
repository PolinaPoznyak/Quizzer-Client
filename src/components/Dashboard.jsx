import React from 'react';
import { Button } from '@mui/material';

const Dashboard = () => {
  const handleLogout = () => {
    console.log('Logout');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
      {/* Add components for managing quizzes, questions, etc. */}
    </div>
  );
};

export default Dashboard;
