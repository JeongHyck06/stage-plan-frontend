'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Clock, MapPin, Music, X } from 'lucide-react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Performance } from '@/types';

interface PerformanceSelectionModalProps {
    performances: Performance[];
    selectedDate: Date;
    onSelect: (performance: Performance) => void;
    onClose: () => void;
}

export default function PerformanceSelectionModal({
    performances,
    selectedDate,
    onSelect,
    onClose,
}: PerformanceSelectionModalProps) {
    const getStatusBadge = (
        status: Performance['status']
    ) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <Badge variant="success">예정</Badge>
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

    const formatTime = (dateTimeString: string) => {
        try {
            const dateTime = new Date(dateTimeString);
            if (isNaN(dateTime.getTime())) {
                return '시간 정보 없음';
            }
            return dateTime.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return '시간 정보 없음';
        }
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
                                    {format(
                                        selectedDate,
                                        'yyyy년 M월 d일',
                                        {
                                            locale: ko,
                                        }
                                    )}
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    총 {performances.length}
                                    개의 공연이 있습니다
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid gap-4">
                            <AnimatePresence>
                                {performances.map(
                                    (
                                        performance,
                                        index
                                    ) => (
                                        <motion.div
                                            key={
                                                performance.id
                                            }
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
                                                delay:
                                                    index *
                                                    0.1,
                                            }}
                                        >
                                            <Card
                                                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                                                onClick={() =>
                                                    onSelect(
                                                        performance
                                                    )
                                                }
                                            >
                                                <CardContent className="p-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-1">
                                                                <h3 className="font-semibold text-lg">
                                                                    {
                                                                        performance.title
                                                                    }
                                                                </h3>
                                                                <div className="flex items-center space-x-2">
                                                                    <Music className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-sm font-medium">
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

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            <div className="flex items-center space-x-2">
                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm">
                                                                    {formatTime(
                                                                        performance.performanceDate
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm">
                                                                    {
                                                                        performance.location
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {performance.genre && (
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xs text-muted-foreground">
                                                                    장르:
                                                                </span>
                                                                <Badge variant="outline">
                                                                    {
                                                                        performance.genre
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        )}

                                                        {performance.ticketPrice && (
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xs text-muted-foreground">
                                                                    가격:
                                                                </span>
                                                                <span className="text-sm font-medium text-primary">
                                                                    {performance.ticketPrice.toLocaleString()}

                                                                    원
                                                                </span>
                                                            </div>
                                                        )}

                                                        {performance.content && (
                                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                                {
                                                                    performance.content
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                닫기
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
