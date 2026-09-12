import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
