import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend URL
    withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;
