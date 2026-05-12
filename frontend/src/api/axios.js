import axios from 'axios';

const API = axios.create({
  // This tells the browser: "Look for /api on the same domain I am currently on"
  baseURL: '/api', 
});

export default API;