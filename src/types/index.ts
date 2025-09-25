export interface User {
    id: number;
    email: string;
    name: string;
    nickname?: string;
    instagramId?: string;
    bandName?: string;
    profileImageUrl?: string;
    representativeVideoUrl?: string;
    favoriteGenres?: string;
    bio?: string;
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}

export interface Performance {
    id: number;
    title: string;
    content: string;
    location: string;
    performanceDate: string;
    genre: string;
    bandName: string;
    ticketPrice?: number;
    maxAudience?: number;
    status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
    artistName: string;
    artistId: number;
    artistNickname?: string;
    artistProfileImageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: number;
    content: string;
    rating: number;
    performanceId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user?: User;
}

export interface SearchFilters {
    keyword?: string;
    genre?: string;
    bandName?: string;
}

export interface CalendarEvent {
    id: number;
    title: string;
    date: Date;
    time: string;
    venue: string;
    genre: string;
    bandName: string;
    performance: Performance;
}

export interface UpdateProfileRequest {
    nickname?: string;
    instagramId?: string;
    bandName?: string;
    profileImageUrl?: string;
    representativeVideoUrl?: string;
    favoriteGenres?: string;
    bio?: string;
}
