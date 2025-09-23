'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Clock,
    Music,
    Star,
    MessageCircle,
    Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Performance } from '@/types';
import { reviewApi } from '@/lib/api/review';

interface PerformanceCardProps {
    performance: Performance;
    onReviewClick?: (performance: Performance) => void;
    showReviews?: boolean;
}

export default function PerformanceCard({
    performance,
    onReviewClick,
    showReviews = true,
}: PerformanceCardProps) {
    const [reviewCount, setReviewCount] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // 리뷰 정보 로드
    const loadReviewStats = async () => {
        if (!showReviews) return;

        try {
            setIsLoading(true);
            const reviews =
                await reviewApi.getReviewsByPerformanceId(
                    performance.id
                );
            setReviewCount(reviews.length);

            if (reviews.length > 0) {
                const totalRating = reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                );
                setAverageRating(
                    totalRating / reviews.length
                );
            }
        } catch (error) {
            console.error('리뷰 정보 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 리뷰 정보 로드
    useState(() => {
        loadReviewStats();
    });

    const getStatusBadge = (
        status: Performance['status']
    ) => {
        switch (status) {
            case 'UPCOMING':
                return (
                    <Badge variant="success">예정</Badge>
                );
            case 'ONGOING':
                return (
                    <Badge variant="warning">진행중</Badge>
                );
            case 'COMPLETED':
                return (
                    <Badge variant="secondary">완료</Badge>
                );
            case 'CANCELLED':
                return (
                    <Badge variant="destructive">
                        취소
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        알 수 없음
                    </Badge>
                );
        }
    };

    const formatDateTime = (date: string, time: string) => {
        const dateTime = new Date(`${date}T${time}`);
        return format(dateTime, 'M월 d일 HH:mm', {
            locale: ko,
        });
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <CardTitle className="text-lg line-clamp-2">
                                {performance.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Music className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    {performance.bandName}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(
                                performance.status
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Performance Details */}
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {formatDateTime(
                                    performance.performanceDate,
                                    performance.startTime
                                )}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="line-clamp-1">
                                {performance.venue}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">
                                장르:
                            </span>
                            <Badge variant="outline">
                                {performance.genre}
                            </Badge>
                        </div>
                    </div>

                    {/* Performance Content Preview */}
                    {performance.content && (
                        <div className="text-sm text-muted-foreground line-clamp-3">
                            {performance.content}
                        </div>
                    )}

                    {/* Review Stats */}
                    {showReviews && (
                        <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    {renderStars(
                                        Math.round(
                                            averageRating
                                        )
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                        (
                                        {averageRating.toFixed(
                                            1
                                        )}
                                        )
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1 text-muted-foreground">
                                    <MessageCircle className="h-4 w-4" />
                                    <span className="text-sm">
                                        {reviewCount}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onReviewClick?.(
                                        performance
                                    )
                                }
                                className="flex items-center space-x-1"
                            >
                                <Eye className="h-4 w-4" />
                                <span>상세보기</span>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
