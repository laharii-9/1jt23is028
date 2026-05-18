import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const changePassword = (data) => API.put('/auth/change-password', data);

// Elections
export const getElections = (params) => API.get('/elections', { params });
export const getElection = (id) => API.get(`/elections/${id}`);
export const createElection = (data) => API.post('/elections', data);
export const updateElection = (id, data) => API.put(`/elections/${id}`, data);
export const deleteElection = (id) => API.delete(`/elections/${id}`);
export const updateElectionStatus = (id, status) => API.patch(`/elections/${id}/status`, { status });
export const getElectionResults = (id) => API.get(`/elections/${id}/results`);

// Candidates
export const getCandidates = (electionId) => API.get(`/candidates/election/${electionId}`);
export const createCandidate = (data) => API.post('/candidates', data);
export const updateCandidate = (id, data) => API.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => API.delete(`/candidates/${id}`);

// Votes
export const castVote = (data) => API.post('/votes', data);
export const checkVoteStatus = (electionId) => API.get(`/votes/status/${electionId}`);
export const getVoteHistory = () => API.get('/votes/history');
export const getAllVotes = () => API.get('/votes/all');

// Users (admin)
export const getUsers = (params) => API.get('/users', { params });
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const toggleUserStatus = (id) => API.patch(`/users/${id}/toggle`);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const getStats = () => API.get('/users/stats');

export default API;
