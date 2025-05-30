import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const generatePrompt = (prompt) =>
  api.post('/generate/', { prompt });

export default api;
