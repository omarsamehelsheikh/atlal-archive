import axios from 'axios';

const API = axios.create({
  // Use your Public IP and the external port 5050
  baseURL: 'http://54.174.102.52:5050/api', 
});

export default API;