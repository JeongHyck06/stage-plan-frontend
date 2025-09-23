import api from '../api';
import { Performance, SearchFilters } from '@/types';

export interface CreatePerformanceRequest {
    title: string;
    content: string;
    genre: string;
    bandName: string;
    venue: string;
    performanceDate: string;
    startTime: string;
    endTime: string;
}

export interface UpdatePerformanceRequest {
    title?: string;
    content?: string;
    genre?: string;
    bandName?: string;
    venue?: string;
    performanceDate?: string;
    startTime?: string;
    endTime?: string;
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
        const response = await api.post(
            '/api/performances',
            data
        );
        return response.data;
    },

    updatePerformance: async (
        id: number,
        data: UpdatePerformanceRequest
    ): Promise<Performance> => {
        const response = await api.put(
            `/api/performances/${id}`,
            data
        );
        return response.data;
    },

    deletePerformance: async (
        id: number
    ): Promise<void> => {
        await api.delete(`/api/performances/${id}`);
    },
};
