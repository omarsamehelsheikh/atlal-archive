import axios from 'axios';

const API = axios.create({
  // Update this to your CURRENT Public IP
  baseURL: 'http://44.223.1.165:5050/api', 
});

export default API;