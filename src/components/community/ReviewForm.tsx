'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Performance } from '@/types';
import { reviewApi } from '@/lib/api/review';

const reviewSchema = z.object({
    rating: z
        .number()
        .min(1, '평점을 선택해주세요')
        .max(5, '평점은 1-5점 사이여야 합니다'),
    content: z
        .string()
        .min(10, '리뷰는 최소 10자 이상 작성해주세요')
        .max(
            500,
            '리뷰는 최대 500자까지 작성할 수 있습니다'
        ),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
    performance: Performance;
    onSuccess: () => void;
    onCancel: () => void;
    isEditing?: boolean;
    initialData?: { rating: number; content: string };
    reviewId?: number;
}

export default function ReviewForm({
    performance,
    onSuccess,
    onCancel,
    isEditing = false,
    initialData,
    reviewId,
}: ReviewFormProps) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: initialData || {
            rating: 0,
            content: '',
        },
    });

    const currentRating = watch('rating');

    const onSubmit = async (data: ReviewFormData) => {
        try {
            setIsSubmitting(true);

            if (isEditing && reviewId) {
                await reviewApi.updateReview(
                    reviewId,
                    data
                );
                toast.success('리뷰가 수정되었습니다!');
            } else {
                await reviewApi.createReview({
                    ...data,
                    performanceId: performance.id,
                });
                toast.success('리뷰가 작성되었습니다!');
            }

            onSuccess();
        } catch (error) {
            toast.error('리뷰 작성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRatingClick = (rating: number) => {
        setValue('rating', rating, {
            shouldValidate: true,
        });
    };

    const handleRatingHover = (rating: number) => {
        setHoveredRating(rating);
    };

    const handleRatingLeave = () => {
        setHoveredRating(0);
    };

    const renderStars = (
        rating: number,
        isHovered: boolean = false
    ) => {
        const displayRating = isHovered
            ? hoveredRating
            : rating;
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-6 w-6 cursor-pointer transition-colors ${
                    i < displayRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-200'
                }`}
                onClick={() => handleRatingClick(i + 1)}
                onMouseEnter={() =>
                    handleRatingHover(i + 1)
                }
                onMouseLeave={handleRatingLeave}
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
                return '평점을 선택해주세요';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onCancel}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <Card className="shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                {isEditing
                                    ? '리뷰 수정'
                                    : '리뷰 작성'}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onCancel}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {performance.title} -{' '}
                            {performance.bandName}
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            {/* Rating */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">
                                    평점
                                </label>
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        {renderStars(
                                            currentRating,
                                            true
                                        )}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {getRatingText(
                                            currentRating
                                        )}
                                    </span>
                                </div>
                                {errors.rating && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.rating
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="content"
                                    className="text-sm font-medium"
                                >
                                    리뷰 내용
                                </label>
                                <textarea
                                    id="content"
                                    {...register('content')}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                                    placeholder="공연에 대한 솔직한 후기를 남겨주세요..."
                                />
                                {errors.content && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.content
                                                .message
                                        }
                                    </p>
                                )}
                                <div className="text-xs text-muted-foreground text-right">
                                    {watch('content')
                                        ?.length || 0}
                                    /500
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-2 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? isEditing
                                            ? '수정 중...'
                                            : '작성 중...'
                                        : isEditing
                                        ? '수정하기'
                                        : '작성하기'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
