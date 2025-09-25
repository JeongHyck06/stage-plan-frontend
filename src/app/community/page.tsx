'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    MessageCircle,
    Star,
    Filter,
    Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PerformanceCard from '@/components/community/PerformanceCard';
import ReviewCard from '@/components/community/ReviewCard';
import ReviewForm from '@/components/community/ReviewForm';
import { useAuthStore } from '@/store/auth';
import { usePerformanceStore } from '@/store/performance';
import { performanceApi } from '@/lib/api/performance';
import { reviewApi } from '@/lib/api/review';
import { Performance, Review } from '@/types';

type TabType = 'performances' | 'reviews';

export default function CommunityPage() {
    const [activeTab, setActiveTab] =
        useState<TabType>('performances');
    const [selectedPerformance, setSelectedPerformance] =
        useState<Performance | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] =
        useState(false);
    const [editingReview, setEditingReview] =
        useState<Review | null>(null);

    const { isAuthenticated, user } = useAuthStore();
    const { performances, setPerformances, setLoading } =
        usePerformanceStore();

    useEffect(() => {
        loadPerformances();
    }, []);

    const loadPerformances = async () => {
        try {
            setLoading(true);
            const data =
                await performanceApi.getAllPerformances();
            setPerformances(data);
        } catch (error) {
            toast.error(
                '공연 정보를 불러오는데 실패했습니다.'
            );
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async (performanceId: number) => {
        try {
            setIsLoading(true);
            const data =
                await reviewApi.getReviewsByPerformanceId(
                    performanceId
                );
            setReviews(data);
        } catch (error) {
            toast.error('리뷰를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePerformanceClick = async (
        performance: Performance
    ) => {
        setSelectedPerformance(performance);
        setActiveTab('reviews');
        await loadReviews(performance.id);
    };

    const handleReviewSuccess = async () => {
        setShowReviewForm(false);
        setEditingReview(null);

        if (selectedPerformance) {
            await loadReviews(selectedPerformance.id);
        }
    };

    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm('리뷰를 삭제하시겠습니까?')) return;

        try {
            await reviewApi.deleteReview(reviewId);
            toast.success('리뷰가 삭제되었습니다.');

            if (selectedPerformance) {
                await loadReviews(selectedPerformance.id);
            }
        } catch (error) {
            toast.error('리뷰 삭제에 실패했습니다.');
        }
    };

    const handleWriteReview = () => {
        if (!isAuthenticated) {
            toast.error('로그인이 필요합니다.');
            return;
        }
        setShowReviewForm(true);
        setEditingReview(null);
    };

    const getCompletedPerformances = () => {
        return performances.filter(
            (p) => p.status === 'COMPLETED'
        );
    };

    const getUpcomingPerformances = () => {
        return performances.filter(
            (p) => p.status === 'ACTIVE'
        );
    };

    const getRecentReviews = () => {
        return reviews.slice(0, 5);
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    커뮤니티
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    공연 정보를 공유하고 후기를 남겨보세요
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    전체 공연
                                </p>
                                <p className="text-2xl font-bold">
                                    {performances.length}개
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <MessageCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    완료된 공연
                                </p>
                                <p className="text-2xl font-bold">
                                    {
                                        getCompletedPerformances()
                                            .length
                                    }
                                    개
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Star className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    다가오는 공연
                                </p>
                                <p className="text-2xl font-bold">
                                    {
                                        getUpcomingPerformances()
                                            .length
                                    }
                                    개
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                        <Button
                            variant={
                                activeTab === 'performances'
                                    ? 'default'
                                    : 'ghost'
                            }
                            size="sm"
                            onClick={() =>
                                setActiveTab('performances')
                            }
                        >
                            공연 정보
                        </Button>
                        <Button
                            variant={
                                activeTab === 'reviews'
                                    ? 'default'
                                    : 'ghost'
                            }
                            size="sm"
                            onClick={() =>
                                setActiveTab('reviews')
                            }
                        >
                            후기
                        </Button>
                    </div>

                    {activeTab === 'reviews' &&
                        selectedPerformance &&
                        isAuthenticated && (
                            <Button
                                onClick={handleWriteReview}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                후기 작성
                            </Button>
                        )}
                </div>

                {/* Performances Tab */}
                {activeTab === 'performances' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Upcoming Performances */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center space-x-2">
                                <Badge variant="success">
                                    예정
                                </Badge>
                                <span>다가오는 공연</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getUpcomingPerformances().map(
                                    (performance) => (
                                        <PerformanceCard
                                            key={
                                                performance.id
                                            }
                                            performance={
                                                performance
                                            }
                                            onReviewClick={
                                                handlePerformanceClick
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>

                        {/* Completed Performances */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center space-x-2">
                                <Badge variant="secondary">
                                    완료
                                </Badge>
                                <span>완료된 공연</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getCompletedPerformances().map(
                                    (performance) => (
                                        <PerformanceCard
                                            key={
                                                performance.id
                                            }
                                            performance={
                                                performance
                                            }
                                            onReviewClick={
                                                handlePerformanceClick
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {selectedPerformance ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">
                                        {
                                            selectedPerformance.title
                                        }{' '}
                                        후기
                                    </h3>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedPerformance(
                                                null
                                            );
                                            setReviews([]);
                                        }}
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        다른 공연 보기
                                    </Button>
                                </div>

                                {isLoading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                        <p className="mt-2 text-muted-foreground">
                                            리뷰를 불러오는
                                            중...
                                        </p>
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map(
                                            (review) => (
                                                <ReviewCard
                                                    key={
                                                        review.id
                                                    }
                                                    review={
                                                        review
                                                    }
                                                    onEdit={
                                                        handleEditReview
                                                    }
                                                    onDelete={
                                                        handleDeleteReview
                                                    }
                                                    showActions={
                                                        isAuthenticated
                                                    }
                                                    currentUserId={
                                                        user?.id
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h4 className="text-lg font-medium mb-2">
                                                아직 후기가
                                                없습니다
                                            </h4>
                                            <p className="text-muted-foreground mb-4">
                                                첫 번째
                                                후기를
                                                작성해보세요!
                                            </p>
                                            {isAuthenticated && (
                                                <Button
                                                    onClick={
                                                        handleWriteReview
                                                    }
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    후기
                                                    작성하기
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h4 className="text-lg font-medium mb-2">
                                        공연을 선택해주세요
                                    </h4>
                                    <p className="text-muted-foreground">
                                        공연 정보 탭에서
                                        공연을 선택하면
                                        후기를 볼 수
                                        있습니다.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Review Form Modal */}
            {showReviewForm && selectedPerformance && (
                <ReviewForm
                    performance={selectedPerformance}
                    onSuccess={handleReviewSuccess}
                    onCancel={() => {
                        setShowReviewForm(false);
                        setEditingReview(null);
                    }}
                    isEditing={!!editingReview}
                    initialData={
                        editingReview
                            ? {
                                  rating: editingReview.rating,
                                  content:
                                      editingReview.content,
                              }
                            : undefined
                    }
                    reviewId={editingReview?.id}
                />
            )}
        </div>
    );
}
