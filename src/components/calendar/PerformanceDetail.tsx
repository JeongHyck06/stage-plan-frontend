'use client';

import { motion } from 'framer-motion';
import {
    MapPin,
    Clock,
    Music,
    Users,
    Calendar,
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

interface PerformanceDetailProps {
    performance: Performance;
    onClose: () => void;
}

export default function PerformanceDetail({
    performance,
    onClose,
}: PerformanceDetailProps) {
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
        return format(dateTime, 'yyyy년 M월 d일 HH:mm', {
            locale: ko,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <Card className="shadow-2xl">
                    <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl">
                                    {performance.title}
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Music className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-lg font-medium">
                                        {
                                            performance.bandName
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getStatusBadge(
                                    performance.status
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Performance Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            공연 일시
                                        </p>
                                        <p className="font-medium">
                                            {formatDateTime(
                                                performance.performanceDate,
                                                performance.startTime
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            공연 시간
                                        </p>
                                        <p className="font-medium">
                                            {
                                                performance.startTime
                                            }{' '}
                                            -{' '}
                                            {
                                                performance.endTime
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            장소
                                        </p>
                                        <p className="font-medium">
                                            {
                                                performance.venue
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            장르
                                        </p>
                                        <p className="font-medium">
                                            {
                                                performance.genre
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Content */}
                        {performance.content && (
                            <div className="space-y-2">
                                <h4 className="font-medium">
                                    공연 소개
                                </h4>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {
                                            performance.content
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                닫기
                            </Button>
                            {performance.status ===
                                'UPCOMING' && (
                                <Button>예약하기</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
