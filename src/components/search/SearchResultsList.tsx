'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Performance } from '@/types';

interface SearchResultsListProps {
    performances: Performance[];
    onPerformanceClick: (performance: Performance) => void;
    isLoading?: boolean;
}

export default function SearchResultsList({
    performances,
    onPerformanceClick,
    isLoading = false,
}: SearchResultsListProps) {
    const router = useRouter();
    const [showAll, setShowAll] = useState(false);
    const [expandedPerformance, setExpandedPerformance] =
        useState<Performance | null>(null);

    const visiblePerformances = showAll
        ? performances
        : performances.slice(0, 4);
    const hasMoreResults = performances.length > 4;

    const handlePerformanceClick = (
        performance: Performance
    ) => {
        setExpandedPerformance(performance);
        onPerformanceClick(performance);
    };

    const handleArtistClick = (artistId: number) => {
        router.push(`/profile/${artistId}`);
    };

    const handleCloseDetail = () => {
        setExpandedPerformance(null);
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                        검색 중...
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (performances.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">
                        검색 결과가 없습니다
                    </h3>
                    <p className="text-muted-foreground">
                        다른 검색어나 필터를 사용해보세요.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* 검색 결과 헤더 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold">
                        검색 결과
                    </h2>
                    <Badge variant="secondary">
                        {performances.length}개
                    </Badge>
                </div>
            </div>

            {/* 검색 결과 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {visiblePerformances.map(
                        (performance, index) => (
                            <motion.div
                                key={performance.id}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -20,
                                }}
                                transition={{
                                    delay: index * 0.1,
                                }}
                            >
                                <Card
                                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    onClick={() =>
                                        handlePerformanceClick(
                                            performance
                                        )
                                    }
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2 flex-1">
                                                <CardTitle className="text-lg line-clamp-2">
                                                    {
                                                        performance.title
                                                    }
                                                </CardTitle>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-muted-foreground">
                                                        {
                                                            performance.bandName
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    performance.status ===
                                                    'ACTIVE'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {performance.status ===
                                                'ACTIVE'
                                                    ? '예정'
                                                    : performance.status ===
                                                      'COMPLETED'
                                                    ? '완료'
                                                    : '취소'}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-muted-foreground">
                                                    📅
                                                </span>
                                                <span>
                                                    {new Date(
                                                        performance.performanceDate
                                                    ).toLocaleDateString(
                                                        'ko-KR',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-muted-foreground">
                                                    📍
                                                </span>
                                                <span className="line-clamp-1">
                                                    {
                                                        performance.location
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-muted-foreground">
                                                    🎵
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {
                                                        performance.genre
                                                    }
                                                </Badge>
                                            </div>
                                            <div
                                                className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
                                                onClick={(
                                                    e
                                                ) => {
                                                    e.stopPropagation();
                                                    handleArtistClick(
                                                        performance.artistId
                                                    );
                                                }}
                                            >
                                                <User className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground hover:text-primary">
                                                    {performance.artistNickname ||
                                                        performance.artistName}
                                                </span>
                                            </div>
                                        </div>

                                        {performance.content && (
                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                {
                                                    performance.content
                                                }
                                            </div>
                                        )}

                                        <div className="pt-2 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={(
                                                    e
                                                ) => {
                                                    e.stopPropagation();
                                                    handlePerformanceClick(
                                                        performance
                                                    );
                                                }}
                                            >
                                                상세 정보
                                                보기
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            {/* 더보기 버튼 */}
            {hasMoreResults && (
                <div className="text-center pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center space-x-2"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp className="h-4 w-4" />
                                <span>접기</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                <span>
                                    더보기 (
                                    {performances.length -
                                        4}
                                    개 더)
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* 공연 상세 모달 */}
            {expandedPerformance && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={handleCloseDetail}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <CardTitle className="text-2xl">
                                            {
                                                expandedPerformance.title
                                            }
                                        </CardTitle>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg text-muted-foreground">
                                                {
                                                    expandedPerformance.bandName
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={
                                            handleCloseDetail
                                        }
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-semibold mb-1">
                                                공연 일시
                                            </h4>
                                            <p className="text-muted-foreground">
                                                {new Date(
                                                    expandedPerformance.performanceDate
                                                ).toLocaleDateString(
                                                    'ko-KR',
                                                    {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        weekday:
                                                            'long',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">
                                                공연 장소
                                            </h4>
                                            <p className="text-muted-foreground">
                                                {
                                                    expandedPerformance.location
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-semibold mb-1">
                                                장르
                                            </h4>
                                            <Badge variant="outline">
                                                {
                                                    expandedPerformance.genre
                                                }
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">
                                                상태
                                            </h4>
                                            <Badge
                                                variant={
                                                    expandedPerformance.status ===
                                                    'ACTIVE'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {expandedPerformance.status ===
                                                'ACTIVE'
                                                    ? '예정'
                                                    : expandedPerformance.status ===
                                                      'COMPLETED'
                                                    ? '완료'
                                                    : '취소'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* 작성자 정보 */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold">
                                        작성자 정보
                                    </h4>
                                    <div
                                        className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                                        onClick={() =>
                                            handleArtistClick(
                                                expandedPerformance.artistId
                                            )
                                        }
                                    >
                                        <Image
                                            src={
                                                expandedPerformance.artistProfileImageUrl ||
                                                '/default-profile.png'
                                            }
                                            alt="작성자 프로필"
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {expandedPerformance.artistNickname ||
                                                    expandedPerformance.artistName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                프로필 보기
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {expandedPerformance.content && (
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            공연 설명
                                        </h4>
                                        <div className="text-muted-foreground whitespace-pre-wrap">
                                            {
                                                expandedPerformance.content
                                            }
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={
                                            handleCloseDetail
                                        }
                                    >
                                        닫기
                                    </Button>
                                    <Button>
                                        예약하기
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
