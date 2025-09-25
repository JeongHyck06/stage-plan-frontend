'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Clock,
    Music,
    User,
} from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Performance } from '@/types';

interface CalendarViewProps {
    performances: Performance[];
    onDateSelect: (date: Date) => void;
    selectedDate?: Date;
    onArtistClick?: (artistId: number) => void;
}

export default function CalendarView({
    performances,
    onDateSelect,
    selectedDate,
    onArtistClick,
}: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(
        new Date()
    );

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
    });

    // 이전 달의 마지막 날들을 가져와서 달력 시작 부분을 채움
    const startDate = monthStart;
    const startDateDay = startDate.getDay();
    const previousMonthDays = [];
    for (let i = startDateDay - 1; i >= 0; i--) {
        const date = new Date(startDate);
        date.setDate(date.getDate() - i - 1);
        previousMonthDays.push(date);
    }

    // 다음 달의 첫 날들을 가져와서 달력 끝 부분을 채움
    const totalCells =
        Math.ceil(
            (previousMonthDays.length + days.length) / 7
        ) * 7;
    const nextMonthDays = [];
    for (
        let i = days.length + previousMonthDays.length;
        i < totalCells;
        i++
    ) {
        const date = new Date(monthEnd);
        date.setDate(
            date.getDate() +
                i -
                days.length -
                previousMonthDays.length +
                1
        );
        nextMonthDays.push(date);
    }

    const allDays = [
        ...previousMonthDays,
        ...days,
        ...nextMonthDays,
    ];

    const getPerformancesForDate = (date: Date) => {
        return performances.filter((performance) => {
            const performanceDate = new Date(
                performance.performanceDate
            );
            return isSameDay(performanceDate, date);
        });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth((prev) =>
            direction === 'prev'
                ? subMonths(prev, 1)
                : addMonths(prev, 1)
        );
    };

    const getPerformanceColor = (
        status: Performance['status']
    ) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="flex items-center space-x-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>이전</span>
                </Button>

                <motion.h2
                    key={format(currentMonth, 'yyyy-MM')}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold"
                >
                    {format(currentMonth, 'yyyy년 M월', {
                        locale: ko,
                    })}
                </motion.h2>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="flex items-center space-x-1"
                >
                    <span>다음</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Calendar Grid */}
            <Card>
                <CardContent className="p-0">
                    {/* Days of week header */}
                    <div className="grid grid-cols-7 border-b">
                        {[
                            '일',
                            '월',
                            '화',
                            '수',
                            '목',
                            '금',
                            '토',
                        ].map((day) => (
                            <div
                                key={day}
                                className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7">
                        {allDays.map((date, index) => {
                            const dayPerformances =
                                getPerformancesForDate(
                                    date
                                );
                            const isCurrentMonth =
                                isSameMonth(
                                    date,
                                    currentMonth
                                );
                            const isSelected =
                                selectedDate &&
                                isSameDay(
                                    date,
                                    selectedDate
                                );
                            const isToday = isSameDay(
                                date,
                                new Date()
                            );

                            return (
                                <motion.div
                                    key={date.toISOString()}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    transition={{
                                        delay: index * 0.01,
                                    }}
                                    className={`
                                        min-h-[120px] border-r border-b last:border-r-0 p-2 cursor-pointer transition-all hover:bg-muted/50
                                        ${
                                            !isCurrentMonth
                                                ? 'text-muted-foreground bg-muted/20'
                                                : ''
                                        }
                                        ${
                                            isToday
                                                ? 'bg-blue-50 border-blue-200'
                                                : ''
                                        }
                                        ${
                                            isSelected
                                                ? 'bg-primary/10 border-primary'
                                                : ''
                                        }
                                    `}
                                    onClick={() =>
                                        onDateSelect(date)
                                    }
                                >
                                    <div
                                        className={`
                                        text-sm font-medium mb-1
                                        ${
                                            isToday
                                                ? 'text-blue-600 font-bold'
                                                : ''
                                        }
                                        ${
                                            isSelected
                                                ? 'text-primary'
                                                : ''
                                        }
                                    `}
                                    >
                                        {format(date, 'd')}
                                    </div>

                                    <div className="space-y-1">
                                        <AnimatePresence>
                                            {dayPerformances
                                                .slice(0, 2)
                                                .map(
                                                    (
                                                        performance
                                                    ) => (
                                                        <motion.div
                                                            key={
                                                                performance.id
                                                            }
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            className={`
                                                        text-xs p-1 rounded border truncate
                                                        ${getPerformanceColor(
                                                            performance.status
                                                        )}
                                                    `}
                                                            title={`${
                                                                performance.title
                                                            } - ${new Date(
                                                                performance.performanceDate
                                                            ).toLocaleTimeString(
                                                                'ko-KR',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                }
                                                            )} - ${
                                                                performance.location
                                                            }`}
                                                        >
                                                            <div className="space-y-0.5">
                                                                <div className="flex items-center space-x-1">
                                                                    <Music className="h-3 w-3" />
                                                                    <span className="truncate font-medium">
                                                                        {
                                                                            performance.title
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-1 text-xs opacity-80">
                                                                    <Clock className="h-2 w-2" />
                                                                    <span className="truncate">
                                                                        {new Date(
                                                                            performance.performanceDate
                                                                        ).toLocaleTimeString(
                                                                            'ko-KR',
                                                                            {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            }
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-1 text-xs opacity-80">
                                                                    <MapPin className="h-2 w-2" />
                                                                    <span className="truncate">
                                                                        {
                                                                            performance.location
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className="flex items-center space-x-1 text-xs opacity-80 cursor-pointer hover:opacity-100"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        onArtistClick?.(
                                                                            performance.artistId
                                                                        );
                                                                    }}
                                                                >
                                                                    <User className="h-2 w-2" />
                                                                    <span className="truncate">
                                                                        {performance.artistNickname ||
                                                                            performance.artistName}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                )}
                                        </AnimatePresence>

                                        {dayPerformances.length >
                                            2 && (
                                            <div className="text-xs text-muted-foreground text-center">
                                                +
                                                {dayPerformances.length -
                                                    2}
                                                개 더
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
