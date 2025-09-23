import api from '../api';
import { Review } from '@/types';

export interface CreateReviewRequest {
    content: string;
    rating: number;
    performanceId: number;
}

export interface UpdateReviewRequest {
    content?: string;
    rating?: number;
}

export const reviewApi = {
    createReview: async (
        data: CreateReviewRequest
    ): Promise<Review> => {
        const response = await api.post(
            '/api/reviews',
            data
        );
        return response.data;
    },

    getReviewsByPerformanceId: async (
        performanceId: number
    ): Promise<Review[]> => {
        const response = await api.get(
            `/api/reviews/performance/${performanceId}`
        );
        return response.data;
    },

    getMyReviews: async (): Promise<Review[]> => {
        const response = await api.get('/api/reviews/my');
        return response.data;
    },

    updateReview: async (
        reviewId: number,
        data: UpdateReviewRequest
    ): Promise<Review> => {
        const response = await api.put(
            `/api/reviews/${reviewId}`,
            data
        );
        return response.data;
    },

    deleteReview: async (
        reviewId: number
    ): Promise<void> => {
        await api.delete(`/api/reviews/${reviewId}`);
    },
};
