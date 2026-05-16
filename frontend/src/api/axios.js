import axios from 'axios';

const API = axios.create({
  // Update this to your CURRENT Public IP
  baseURL: 'http://44.223.1.165:5050/api', 
});

export default API;

// import axios from 'axios';

// // Detect if running on localhost or the public server
// const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// const API = axios.create({
//   // Local: talks to port 5000 | AWS: talks to Nginx proxy on port 80
//   baseURL: isLocal ? 'http://localhost:5000/api' : '/api',
// });

// export default API;