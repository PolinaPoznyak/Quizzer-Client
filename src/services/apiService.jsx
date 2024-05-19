import axios from 'axios';

//const API_BASE_URL = 'http://quizzer-server:5045/api';
const API_BASE_URL = 'http://localhost:5045/api';

const apiService = {
  getQuizzes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },
  
  getQuizById: async (quizId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },
  
  updateQuiz: async (quizId, updatedQuizData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/quiz`, updatedQuizData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteQuiz: async (quizId) => {
    const response = await axios.delete(`${API_BASE_URL}/quiz/${quizId}`);
    return response.data;
  },

  getQuizzesByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user quizzes:', error);
      throw error;
    }
  },

  createQuiz: async (quizData) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_BASE_URL}/quiz`, quizData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  getQuestions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  createQuestion: async (questionData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/questions`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  updateQuestion: async (questionId, questionData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/questions`, questionData);
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  deleteQuestion: async (questionId) => {
    const response = await axios.delete(`${API_BASE_URL}/questions/${questionId}`);
    return response.data;
  },

  getQuestionAnswers: async (questionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/QuizAnswer/question/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching question answers:', error);
      throw error;
    }
  },

  getAllQuestionAnswers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/QuizAnswer`);
      return response.data;
    } catch (error) {
      console.error('Error fetching question answers:', error);
      throw error;
    }
  },

  createQuizAnswer: async (answerData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quizanswer`, answerData);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz answer:', error);
      throw error;
    }
  },

  updateQuizAnswer: async (answerData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/quizanswer`, answerData);
      return response.data;
    } catch (error) {
      console.error('Error updating quiz answer:', error);
      throw error;
    }
  },

  deleteQuizAnswer: async (answerId) => {
    const response = await axios.delete(`${API_BASE_URL}/quizanswer/${answerId}`);
    return response.data;
  },

  createQuizSession: async (quizId) => {
    const token = localStorage.getItem('token');
  
    try {
    const authenticatedUserId = localStorage.getItem("authUserId");

    const response = await axios.post(
      `${API_BASE_URL}/QuizSession`,
      {
        quizId: quizId,
        startDate: new Date().toISOString(),
        quizSessionResults: [
          {
            quizSessionId: authenticatedUserId,
            score: 0,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating QuizSession:', error);
    throw error;
  }
},

  recordAnswer: async (answerData) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_BASE_URL}/resultdetails`, answerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating result details:', error);
      throw error;
    }
  },

  getUserAnswersBySessionResultId: async (quizSessionResultId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ResultDetails/result/${quizSessionResultId}`);
      return response.data;
    } catch (error) {
      console.error('Error creating result details:', error);
      throw error;
    }
  },

  updateQuizSessionResult: async (quizSessionResultId, updatedData) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/quizsessionresult`,
        JSON.stringify(updatedData),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Specify the content type
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error update QuizSessionResult:', error);
      throw error;
    }
  },

  getQuizSessionResult: async (quizSessionResultId) => {
    try {
      if (!quizSessionResultId) {
        throw new Error('Invalid quizSessionResultId');
      }
  
      const response = await axios.get(`${API_BASE_URL}/QuizSessionResult/${quizSessionResultId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quizSessionResult', error);
      throw error;
    }
  }, 

  getUser: async (quizSessionResultId) => {
    const token = localStorage.getItem('token');

    try {
      if (!quizSessionResultId) {
        throw new Error('Invalid quizSessionResultId');
      }
  
      const response = await axios.get(`${API_BASE_URL}/QuizSessionResult/${quizSessionResultId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quizSessionResult', error);
      throw error;
    }
  }, 

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  register: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error during register:', error);
      throw error;
    }
  },

  getUsers: async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`${API_BASE_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user: ', error);
      throw error;
    }
  },

  blockUser: async (userData) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/user/block`,
        JSON.stringify(userData),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error update QuizSessionResult:', error);
      throw error;
    }
  },

  editUser: async (userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  getUserData: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },

  updateUserData: async (userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },
};

export default apiService;