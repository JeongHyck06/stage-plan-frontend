import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (authData: AuthResponse) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true, // 초기 로딩 상태를 true로 설정
            setAuth: (authData: AuthResponse) => {
                set({
                    user: authData.user,
                    token: authData.accessToken,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },
            setLoading: (loading: boolean) =>
                set({ isLoading: loading }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                // persist에서 복원된 후 로딩 상태를 false로 설정
                if (state) {
                    state.isLoading = false;
                }
            },
        }
    )
);
