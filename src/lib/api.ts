import axios from 'axios';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8080';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    // Zustand persist에서 토큰 가져오기
    const authStorage =
        localStorage.getItem('auth-storage');
    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            const token = parsed.state?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error(
                'Failed to parse auth storage:',
                error
            );
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Zustand persist에서 auth 데이터 제거
            localStorage.removeItem('auth-storage');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default api;
