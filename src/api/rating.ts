import api from '../lib/axios';
import type { APIResponse } from '../interfaces/common';

export interface RatingStats {
    averageRating: number | null;
    totalReviews: number;
}

export interface Rating {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
}

// Submit a new rating
export async function submitRating(targetUserId: string, rating: number, comment?: string): Promise<Rating> {
    const response = await api.post<APIResponse<Rating>>('/ratings', {
        targetUserId,
        rating,
        comment
    });
    return response.data.data;
}

// Get average rating and stats for a user
export async function getRatingStats(targetUserId: string): Promise<RatingStats> {
    const response = await api.get<APIResponse<RatingStats>>(`/ratings/${targetUserId}/stats`);
    const data = response.data.data;
    // Defensive casting to prevent crashes if backend returns strings/floats incorrectly
    return {
        averageRating: data.averageRating !== null ? Number(data.averageRating) : null,
        totalReviews: Number(data.totalReviews)
    };
}

// Check if I have already rated this user
export async function getMyRating(targetUserId: string): Promise<Rating | null> {
    const response = await api.get<APIResponse<Rating | null>>(`/ratings/${targetUserId}/my-rating`);
    return response.data.data;
}
