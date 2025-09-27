'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Edit,
    Trash2,
    Calendar,
    MapPin,
    Clock,
    Music,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Performance } from '@/types';
import { performanceApi } from '@/lib/api/performance';

interface PerformanceManagementProps {
    performances: Performance[];
    onEdit: (performance: Performance) => void;
    onRefresh: () => void;
}

export default function PerformanceManagement({
    performances,
    onEdit,
    onRefresh,
}: PerformanceManagementProps) {
    const [deletingId, setDeletingId] = useState<
        number | null
    >(null);

    const handleDelete = async (id: number) => {
        if (!confirm('정말로 이 공연을 삭제하시겠습니까?'))
            return;

        try {
            setDeletingId(id);
            await performanceApi.deletePerformance(id);
            toast.success('공연이 삭제되었습니다.');
            onRefresh();
        } catch (error: unknown) {
            console.error(
                'Failed to delete performance:',
                error
            );
            toast.error('공연 삭제에 실패했습니다.');
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadge = (
        status: Performance['status']
    ) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <Badge variant="success">활성</Badge>
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

    const getPerformancesByStatus = (
        status: Performance['status']
    ) => {
        return performances.filter(
            (p) => p.status === status
        );
    };

    const statusGroups = [
        {
            status: 'ACTIVE' as const,
            title: '활성 공연',
            color: 'text-green-600',
        },
        {
            status: 'COMPLETED' as const,
            title: '완료된 공연',
            color: 'text-gray-600',
        },
        {
            status: 'CANCELLED' as const,
            title: '취소된 공연',
            color: 'text-red-600',
        },
    ];

    return (
        <div className="space-y-8">
            {statusGroups.map((group) => {
                const groupPerformances =
                    getPerformancesByStatus(group.status);

                if (groupPerformances.length === 0)
                    return null;

                return (
                    <motion.div
                        key={group.status}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3
                            className={`text-xl font-semibold flex items-center space-x-2 ${group.color}`}
                        >
                            <Calendar className="h-5 w-5" />
                            <span>{group.title}</span>
                            <Badge variant="outline">
                                {groupPerformances.length}개
                            </Badge>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupPerformances.map(
                                (performance) => (
                                    <motion.div
                                        key={performance.id}
                                        initial={{
                                            opacity: 0,
                                            scale: 0.95,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        whileHover={{
                                            y: -5,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                    >
                                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2 flex-1">
                                                        <CardTitle className="text-lg line-clamp-2">
                                                            {
                                                                performance.title
                                                            }
                                                        </CardTitle>
                                                        <div className="flex items-center space-x-2">
                                                            <Music className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">
                                                                {
                                                                    performance.bandName
                                                                }
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
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {format(
                                                                new Date(
                                                                    performance.performanceDate
                                                                ),
                                                                'yyyy년 M월 d일',
                                                                {
                                                                    locale: ko,
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="line-clamp-1">
                                                            {
                                                                performance.location
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            공연
                                                            시간
                                                            미정
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-muted-foreground">
                                                            장르:
                                                        </span>
                                                        <Badge variant="outline">
                                                            {
                                                                performance.genre
                                                            }
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Performance Content Preview */}
                                                {performance.content && (
                                                    <div className="text-sm text-muted-foreground line-clamp-3">
                                                        {
                                                            performance.content
                                                        }
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex justify-end space-x-2 pt-2 border-t">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            onEdit(
                                                                performance
                                                            )
                                                        }
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span>
                                                            수정
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                performance.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            performance.id
                                                        }
                                                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>
                                                            {deletingId ===
                                                            performance.id
                                                                ? '삭제 중...'
                                                                : '삭제'}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.div>
                );
            })}

            {performances.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                        등록된 공연이 없습니다
                    </h3>
                    <p className="text-muted-foreground">
                        첫 번째 공연을 등록해보세요!
                    </p>
                </motion.div>
            )}
        </div>
    );
}
