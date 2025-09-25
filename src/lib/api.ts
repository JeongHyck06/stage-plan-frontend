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
    console.log(
        'API Request interceptor - auth storage:',
        authStorage ? 'exists' : 'not found'
    );

    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            const token = parsed.state?.token;
            console.log(
                'API Request interceptor - token:',
                token ? 'exists' : 'not found'
            );

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log(
                    'API Request interceptor - Authorization header set'
                );
            } else {
                console.warn(
                    'API Request interceptor - No token found in auth storage'
                );
            }
        } catch (error) {
            console.error(
                'Failed to parse auth storage:',
                error
            );
        }
    } else {
        console.warn(
            'API Request interceptor - No auth storage found'
        );
    }

    console.log(
        'API Request interceptor - Final headers:',
        config.headers
    );
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log(
            'API Response interceptor - Success:',
            response.status,
            response.config.url
        );
        return response;
    },
    (error) => {
        console.error(
            'API Response interceptor - Error:',
            error.response?.status,
            error.config?.url
        );
        console.error(
            'API Response interceptor - Error details:',
            error.response?.data
        );

        if (error.response?.status === 401) {
            console.warn(
                'API Response interceptor - Unauthorized, redirecting to login'
            );
            // Zustand persist에서 auth 데이터 제거
            localStorage.removeItem('auth-storage');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default api;
