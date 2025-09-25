'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    User,
    Music,
    Instagram,
    MapPin,
    Calendar,
    ArrowLeft,
    ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { userApi } from '@/lib/api/user';
import { User as UserType } from '@/types';

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = parseInt(params.userId as string);
    const [profile, setProfile] = useState<UserType | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            loadUserProfile();
        }
    }, [userId]);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);
            const profileData =
                await userApi.getUserProfile(userId);
            setProfile(profileData);
        } catch (error) {
            console.error('프로필 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        프로필을 찾을 수 없습니다
                    </h1>
                    <Button onClick={() => router.back()}>
                        돌아가기
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-4"
            >
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    돌아가기
                </Button>
                <h1 className="text-3xl font-bold">
                    프로필
                </h1>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center space-y-4">
                                {/* Profile Image */}
                                <div className="relative">
                                    <img
                                        src={
                                            profile.profileImageUrl ||
                                            '/default-profile.png'
                                        }
                                        alt="프로필 이미지"
                                        className="w-32 h-32 rounded-full mx-auto object-cover"
                                    />
                                </div>

                                {/* Basic Info */}
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">
                                        {profile.nickname ||
                                            profile.name}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {profile.name}
                                    </p>
                                    {profile.bandName && (
                                        <div className="flex items-center justify-center space-x-1">
                                            <Music className="h-4 w-4" />
                                            <span className="text-sm">
                                                {
                                                    profile.bandName
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div className="flex justify-center space-x-4">
                                    {profile.instagramId && (
                                        <a
                                            href={`https://instagram.com/${profile.instagramId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-1 text-pink-600 hover:text-pink-700"
                                        >
                                            <Instagram className="h-5 w-5" />
                                            <span className="text-sm">
                                                @
                                                {
                                                    profile.instagramId
                                                }
                                            </span>
                                        </a>
                                    )}
                                </div>

                                {/* Favorite Genres */}
                                {profile.favoriteGenres && (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sm">
                                            관심 장르
                                        </h3>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {profile.favoriteGenres
                                                .split(',')
                                                .map(
                                                    (
                                                        genre,
                                                        index
                                                    ) => (
                                                        <Badge
                                                            key={
                                                                index
                                                            }
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {genre.trim()}
                                                        </Badge>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Profile Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Bio */}
                    {profile.bio && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    자기소개
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {profile.bio}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                프로필 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">
                                        닉네임
                                    </label>
                                    <p className="text-muted-foreground">
                                        {profile.nickname ||
                                            '닉네임이 없습니다.'}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        인스타그램 ID
                                    </label>
                                    <p className="text-muted-foreground">
                                        {profile.instagramId
                                            ? `@${profile.instagramId}`
                                            : '인스타그램 ID가 없습니다.'}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        소속 밴드
                                    </label>
                                    <p className="text-muted-foreground">
                                        {profile.bandName ||
                                            '소속 밴드가 없습니다.'}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        관심 장르
                                    </label>
                                    <p className="text-muted-foreground">
                                        {profile.favoriteGenres ||
                                            '관심 장르가 없습니다.'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    프로필 이미지 URL
                                </label>
                                <div>
                                    {profile.profileImageUrl ? (
                                        <a
                                            href={
                                                profile.profileImageUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            <span className="truncate">
                                                {
                                                    profile.profileImageUrl
                                                }
                                            </span>
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            프로필 이미지가
                                            없습니다.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    대표 공연 영상 URL
                                </label>
                                <div>
                                    {profile.representativeVideoUrl ? (
                                        <a
                                            href={
                                                profile.representativeVideoUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            <span className="truncate">
                                                {
                                                    profile.representativeVideoUrl
                                                }
                                            </span>
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <p className="text-muted-foreground">
                                            대표 공연 영상이
                                            없습니다.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
