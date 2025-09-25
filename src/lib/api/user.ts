import api from '../api';
import {
    User,
    UpdateProfileRequest,
    AuthResponse,
} from '@/types';

export const userApi = {
    getProfile: async (): Promise<User> => {
        const response = await api.get(
            '/api/users/profile'
        );
        return response.data;
    },

    updateProfile: async (
        data: UpdateProfileRequest
    ): Promise<User> => {
        const response = await api.put(
            '/api/users/profile',
            data
        );
        return response.data;
    },

    getUserProfile: async (
        userId: number
    ): Promise<User> => {
        const response = await api.get(
            `/api/users/${userId}`
        );
        return response.data;
    },

    refreshToken: async (): Promise<AuthResponse> => {
        const response = await api.post(
            '/api/users/refresh-token'
        );
        return response.data;
    },
};
