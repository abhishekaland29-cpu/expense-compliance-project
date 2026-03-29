import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// This fetches the country list we tested earlier
export const fetchCountries = () => API.get('/utils/countries');

// This sends the signup data to your MySQL database
export const signupAdmin = (adminData) => API.post('/auth/signup', adminData);

export default API;