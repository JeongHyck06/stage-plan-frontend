import api from '../api';
import { AuthResponse } from '@/types';

export interface SignUpRequest {
    email: string;
    password: string;
    name: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface EmailSendRequest {
    email: string;
}

export interface EmailVerificationRequest {
    email: string;
    verificationCode: string;
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

    sendVerificationEmail: async (
        email: string
    ): Promise<void> => {
        await api.post('/api/email/send-verification', {
            email,
        });
    },

    verifyEmail: async (
        data: EmailVerificationRequest
    ): Promise<void> => {
        await api.post('/api/email/verify', data);
    },
};
