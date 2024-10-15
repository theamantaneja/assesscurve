import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://assesscurve.onrender.com' // Your backend URL
});

export default instance;