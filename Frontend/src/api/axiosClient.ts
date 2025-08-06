import axios from 'axios';

const axiosClient = axios.create({
    baseURL: (window as any).DEVFORGE_API_URL || import.meta.env.VITE_API_URL || '',
    headers: {
        'content-type': 'application/json',
    }
});

// Request interceptor for adding auth token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling token refresh
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${(window as any).DEVFORGE_API_URL || import.meta.env.VITE_API_URL || ''}/api/auth/refresh`, {
                        refreshToken
                    });
                    
                    const { accessToken } = response.data as { accessToken: string };
                    localStorage.setItem('accessToken', accessToken);
                    
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return axiosClient(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient; 