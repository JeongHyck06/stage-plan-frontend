import api from '../api';
import { AuthResponse } from '@/types';

export interface SignUpRequest {
    email: string;
    password: string;
    name: string;
    role: 'USER' | 'PERFORMER';
}

export interface SignInRequest {
    email: string;
    password: string;
}

export const authApi = {
    signUp: async (
        data: SignUpRequest
    ): Promise<AuthResponse> => {
        const response = await api.post(
            '/api/auth/signup',
            data
        );
        return response.data;
    },

    signIn: async (
        data: SignInRequest
    ): Promise<AuthResponse> => {
        const response = await api.post(
            '/api/auth/signin',
            data
        );
        return response.data;
    },
};
