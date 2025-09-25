import api from '../api';
import { Performance, SearchFilters } from '@/types';

export interface CreatePerformanceRequest {
    title: string;
    content: string;
    location: string;
    performanceDate: string;
    genre: string;
    bandName: string;
    ticketPrice?: number;
    maxAudience?: number;
}

export interface UpdatePerformanceRequest {
    title?: string;
    content?: string;
    location?: string;
    performanceDate?: string;
    genre?: string;
    bandName?: string;
    ticketPrice?: number;
    maxAudience?: number;
}

export const performanceApi = {
    getAllPerformances: async (): Promise<
        Performance[]
    > => {
        const response = await api.get('/api/performances');
        return response.data;
    },

    searchPerformances: async (
        filters: SearchFilters
    ): Promise<Performance[]> => {
        const params = new URLSearchParams();
        if (filters.keyword)
            params.append('keyword', filters.keyword);
        if (filters.genre)
            params.append('genre', filters.genre);
        if (filters.bandName)
            params.append('bandName', filters.bandName);

        const response = await api.get(
            `/api/performances/search?${params.toString()}`
        );
        return response.data;
    },

    getPerformancesByDateRange: async (
        startDate: string,
        endDate: string
    ): Promise<Performance[]> => {
        const response = await api.get(
            '/api/performances/calendar',
            {
                params: { startDate, endDate },
            }
        );
        return response.data;
    },

    getMyPerformances: async (): Promise<Performance[]> => {
        const response = await api.get(
            '/api/performances/my'
        );
        return response.data;
    },

    createPerformance: async (
        data: CreatePerformanceRequest
    ): Promise<Performance> => {
        // 백엔드 스펙에 맞게 데이터 변환
        const formattedData = {
            ...data,
            performanceDate: `${data.performanceDate}T00:00:00`, // LocalDateTime 형식으로 변환
        };

        console.log(
            'Creating performance with data:',
            formattedData
        );

        try {
            const response = await api.post(
                '/api/performances',
                formattedData
            );
            console.log(
                'Performance created successfully:',
                response.data
            );
            return response.data;
        } catch (error) {
            console.error(
                'Failed to create performance:',
                error
            );
            console.error('Request data:', formattedData);
            if (error.response) {
                console.error(
                    'Response status:',
                    error.response.status
                );
                console.error(
                    'Response data:',
                    error.response.data
                );
            }
            throw error;
        }
    },

    updatePerformance: async (
        id: number,
        data: UpdatePerformanceRequest
    ): Promise<Performance> => {
        // 백엔드 스펙에 맞게 데이터 변환
        const formattedData = {
            ...data,
            ...(data.performanceDate && {
                performanceDate: `${data.performanceDate}T00:00:00`,
            }),
        };

        const response = await api.put(
            `/api/performances/${id}`,
            formattedData
        );
        return response.data;
    },

    deletePerformance: async (
        id: number
    ): Promise<void> => {
        await api.delete(`/api/performances/${id}`);
    },
};
