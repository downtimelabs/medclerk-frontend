import api from '../lib/axios';

export interface Rating {
    id: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface RatingStats {
    averageRating: number;
    totalReviews: number;
}

export const submitRating = async (targetUserId: string, rating: number, comment?: string): Promise<Rating> => {
    const response = await api.post('/ratings', { targetUserId, rating, comment });
    return response.data.data;
};

export const getRatingStats = async (targetId: string): Promise<RatingStats> => {
    const response = await api.get(`/ratings/${targetId}/stats`);
    return response.data.data;
};

export const getMyRating = async (targetId: string): Promise<Rating | null> => {
    const response = await api.get(`/ratings/${targetId}/my-rating`);
    return response.data.data;
};
