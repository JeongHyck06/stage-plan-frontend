'use client';

import { motion } from 'framer-motion';
import { Star, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Review } from '@/types';

interface ReviewCardProps {
    review: Review;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: number) => void;
    showActions?: boolean;
    currentUserId?: number;
}

export default function ReviewCard({
    review,
    onEdit,
    onDelete,
    showActions = false,
    currentUserId,
}: ReviewCardProps) {
    const isOwner = currentUserId === review.userId;

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

    const getRatingText = (rating: number) => {
        switch (rating) {
            case 5:
                return '매우 만족';
            case 4:
                return '만족';
            case 3:
                return '보통';
            case 2:
                return '불만족';
            case 1:
                return '매우 불만족';
            default:
                return '평가 없음';
        }
    };

    const getRatingColor = (rating: number) => {
        switch (rating) {
            case 5:
                return 'bg-green-100 text-green-800';
            case 4:
                return 'bg-blue-100 text-blue-800';
            case 3:
                return 'bg-yellow-100 text-yellow-800';
            case 2:
                return 'bg-orange-100 text-orange-800';
            case 1:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">
                                        {review.user
                                            ?.name ||
                                            '익명 사용자'}
                                    </span>
                                    {isOwner && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            나의 리뷰
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {format(
                                            new Date(
                                                review.createdAt
                                            ),
                                            'yyyy년 M월 d일',
                                            { locale: ko }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                            </div>
                            <Badge
                                variant="outline"
                                className={`text-xs ${getRatingColor(
                                    review.rating
                                )}`}
                            >
                                {getRatingText(
                                    review.rating
                                )}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {review.content}
                        </p>
                    </div>

                    {showActions && isOwner && (
                        <div className="flex justify-end space-x-2 pt-2 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onEdit?.(review)
                                }
                            >
                                수정
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onDelete?.(review.id)
                                }
                                className="text-red-600 hover:text-red-700"
                            >
                                삭제
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
