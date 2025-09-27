'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Camera,
    Music,
    Instagram,
    Edit3,
    Save,
    X,
    ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';
import { userApi } from '@/lib/api/user';
import {
    User as UserType,
    UpdateProfileRequest,
} from '@/types';

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } =
        useAuthStore();
    const [profile, setProfile] = useState<UserType | null>(
        null
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] =
        useState<UpdateProfileRequest>({});

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        if (isAuthenticated) {
            // 토큰 만료 체크
            const { checkTokenExpiry } =
                useAuthStore.getState();
            if (!checkTokenExpiry()) {
                router.push('/auth/login');
                return;
            }
            loadProfile();
        }
    }, [isAuthenticated, authLoading, router]);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const profileData = await userApi.getProfile();
            setProfile(profileData);
            setFormData({
                nickname: profileData.nickname || '',
                instagramId: profileData.instagramId || '',
                bandName: profileData.bandName || '',
                profileImageUrl:
                    profileData.profileImageUrl || '',
                representativeVideoUrl:
                    profileData.representativeVideoUrl ||
                    '',
                favoriteGenres:
                    profileData.favoriteGenres || '',
                bio: profileData.bio || '',
            });
        } catch (error: unknown) {
            console.error('Failed to load profile:', error);
            toast.error(
                '프로필을 불러오는데 실패했습니다.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const updatedProfile =
                await userApi.updateProfile(formData);
            setProfile(updatedProfile);
            setIsEditing(false);
            toast.success(
                '프로필이 성공적으로 업데이트되었습니다.'
            );
        } catch (error: unknown) {
            console.error(
                'Failed to update profile:',
                error
            );
            toast.error('프로필 업데이트에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                nickname: profile.nickname || '',
                instagramId: profile.instagramId || '',
                bandName: profile.bandName || '',
                profileImageUrl:
                    profile.profileImageUrl || '',
                representativeVideoUrl:
                    profile.representativeVideoUrl || '',
                favoriteGenres:
                    profile.favoriteGenres || '',
                bio: profile.bio || '',
            });
        }
        setIsEditing(false);
    };

    const handleInputChange = (
        field: keyof UpdateProfileRequest,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    if (authLoading || isLoading) {
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
                        프로필을 불러올 수 없습니다
                    </h1>
                    <Button
                        onClick={() => router.push('/')}
                    >
                        홈으로 돌아가기
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
                className="flex items-center justify-between"
            >
                <h1 className="text-3xl font-bold">
                    프로필
                </h1>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4 mr-2" />
                                취소
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                저장
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() =>
                                setIsEditing(true)
                            }
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            편집
                        </Button>
                    )}
                </div>
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
                                    <Image
                                        src={
                                            profile.profileImageUrl ||
                                            '/default-profile.png'
                                        }
                                        alt="프로필 이미지"
                                        width={128}
                                        height={128}
                                        className="w-32 h-32 rounded-full mx-auto object-cover"
                                    />
                                    {isEditing && (
                                        <Button
                                            size="sm"
                                            className="absolute bottom-0 right-0 rounded-full"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    )}
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
                    <Card>
                        <CardHeader>
                            <CardTitle>자기소개</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <textarea
                                    value={
                                        formData.bio || ''
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            'bio',
                                            e.target.value
                                        )
                                    }
                                    placeholder="자기소개를 입력하세요..."
                                    className="w-full h-32 p-3 border rounded-md resize-none"
                                />
                            ) : (
                                <p className="text-muted-foreground">
                                    {profile.bio ||
                                        '자기소개가 없습니다.'}
                                </p>
                            )}
                        </CardContent>
                    </Card>

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
                                    {isEditing ? (
                                        <Input
                                            value={
                                                formData.nickname ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'nickname',
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="닉네임을 입력하세요"
                                        />
                                    ) : (
                                        <p className="text-muted-foreground">
                                            {profile.nickname ||
                                                '닉네임이 없습니다.'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        인스타그램 ID
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={
                                                formData.instagramId ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'instagramId',
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="@ 없이 입력하세요"
                                        />
                                    ) : (
                                        <p className="text-muted-foreground">
                                            {profile.instagramId
                                                ? `@${profile.instagramId}`
                                                : '인스타그램 ID가 없습니다.'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        소속 밴드
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={
                                                formData.bandName ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'bandName',
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="밴드명을 입력하세요"
                                        />
                                    ) : (
                                        <p className="text-muted-foreground">
                                            {profile.bandName ||
                                                '소속 밴드가 없습니다.'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        관심 장르
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={
                                                formData.favoriteGenres ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'favoriteGenres',
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder="장르를 쉼표로 구분하여 입력하세요"
                                        />
                                    ) : (
                                        <p className="text-muted-foreground">
                                            {profile.favoriteGenres ||
                                                '관심 장르가 없습니다.'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    프로필 이미지 URL
                                </label>
                                {isEditing ? (
                                    <Input
                                        value={
                                            formData.profileImageUrl ||
                                            ''
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'profileImageUrl',
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="이미지 URL을 입력하세요"
                                    />
                                ) : (
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
                                                프로필
                                                이미지가
                                                없습니다.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    대표 공연 영상 URL
                                </label>
                                {isEditing ? (
                                    <Input
                                        value={
                                            formData.representativeVideoUrl ||
                                            ''
                                        }
                                        onChange={(e) =>
                                            handleInputChange(
                                                'representativeVideoUrl',
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="영상 URL을 입력하세요"
                                    />
                                ) : (
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
                                                대표 공연
                                                영상이
                                                없습니다.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
