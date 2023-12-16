import React from 'react';
import { Tabs, Tab } from '@mui/material';
import QuizTable from './QuizTable';
import QuestionTable from './QuestionTable';
import AnswerTable from './AnswerTable';
import UserTable from './UserTable';
import AdminNavbar from './AdminNavbar';

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs value={selectedTab} onChange={handleChange}>
          <Tab label="Users" />
          <Tab label="Quizzes" />
          <Tab label="Questions" />
          <Tab label="Answers" />
        </Tabs>
      </div>
      {selectedTab === 0 && <UserTable />}
      {selectedTab === 1 && <QuizTable />}
      {selectedTab === 2 && <QuestionTable />}
      {selectedTab === 3 && <AnswerTable />}
    </div>
  );
};

export default AdminPanel;
