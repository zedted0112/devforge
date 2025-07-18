import axios from 'axios';

const projectClient = axios.create({
    baseURL: import.meta.env.VITE_PROJECT_API_URL || 'http://localhost:3002/api',
    headers: {
        'content-type': 'application/json',
    }
});

// Add request interceptor to include auth token
projectClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default projectClient;
