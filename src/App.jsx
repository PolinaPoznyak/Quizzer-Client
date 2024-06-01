import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Main from './components/Main';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Quizzes from './components/Quizzes';
import PlayQuiz from './components/PlayQuiz';
import PlayMultiplayer from './components/PlayMultiplayer';
import UserQuizzes from './components/UserQuizzes';
import CreateQuiz from './components/CreateQuiz';
import EditQuiz from './components/EditQuiz';
import QuizLobby from './components/QuizLobby';
import AdminPanel from './components/adminpanel/AdminPanel';
import QuizTable from './components/adminpanel/QuizTable';
import QuestionTable from './components/adminpanel/QuestionTable';
import AnswerTable from './components/adminpanel/AnswerTable';
import UserTable from './components/adminpanel/UserTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:id" element={<PlayQuiz />} />
        <Route path="/quiz/:id" element={<PlayMultiplayer />} />
        <Route path="/userquizzes" element={<UserQuizzes />} />
        <Route path="/addquiz" element={<CreateQuiz />} />
        <Route path="/editquiz/:quizId" element={<EditQuiz />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/quiztable" element={<QuizTable />} />
        <Route path="/questiontable" element={<QuestionTable />} />
        <Route path="/answertable" element={<AnswerTable />} />
        <Route path="/usertable" element={<UserTable />} />
        <Route path="/quiz-lobby" element={<QuizLobby />} />
      </Routes>
    </div>
  );
}

export default App;
