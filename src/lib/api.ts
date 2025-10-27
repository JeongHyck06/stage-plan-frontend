import axios from 'axios';

// 로컬 개발용 API URL 설정
const getApiBaseUrl = () => {
    // 로컬 개발 환경에서는 항상 localhost:8080 사용
    console.log(
        'Using local API URL: http://localhost:8080'
    );
    return 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (typeof window === 'undefined') {
        return config;
    }

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
                try {
                    const payload = JSON.parse(
                        atob(token.split('.')[1])
                    );
                    const currentTime = Math.floor(
                        Date.now() / 1000
                    );

                    if (
                        payload.exp &&
                        payload.exp < currentTime
                    ) {
                        console.warn(
                            'API Request interceptor - Token expired, removing auth storage'
                        );
                        localStorage.removeItem(
                            'auth-storage'
                        );
                        if (
                            window.location.pathname !==
                            '/auth/login'
                        ) {
                            window.location.href =
                                '/auth/login';
                        }
                        return Promise.reject(
                            new Error('Token expired')
                        );
                    }
                } catch (error) {
                    console.error(
                        'API Request interceptor - Token validation error:',
                        error
                    );
                    localStorage.removeItem('auth-storage');
                    if (
                        window.location.pathname !==
                        '/auth/login'
                    ) {
                        window.location.href =
                            '/auth/login';
                    }
                    return Promise.reject(
                        new Error('Invalid token')
                    );
                }

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

        if (
            error.response?.status === 401 ||
            error.response?.status === 403 ||
            error.response?.status === 500
        ) {
            // 이메일 인증 관련 엔드포인트는 리다이렉트에서 제외
            const isEmailVerificationEndpoint =
                error.config?.url?.includes('/api/email/');
            const isAuthEndpoint =
                error.config?.url?.includes('/api/auth/');

            if (
                !isEmailVerificationEndpoint &&
                !isAuthEndpoint
            ) {
                // JWT 토큰 만료 또는 인증 실패 시 로그아웃 처리
                console.warn(
                    'API Response interceptor - Authentication failed, redirecting to login'
                );
                // Zustand persist에서 auth 데이터 제거
                localStorage.removeItem('auth-storage');
                // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
                if (
                    window.location.pathname !==
                    '/auth/login'
                ) {
                    window.location.href = '/auth/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
