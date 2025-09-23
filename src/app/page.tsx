'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Plus,
    Music,
} from 'lucide-react';
import toast from 'react-hot-toast';

import SearchBar from '@/components/search/SearchBar';
import CalendarView from '@/components/calendar/CalendarView';
import PerformanceDetail from '@/components/calendar/PerformanceDetail';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';
import { usePerformanceStore } from '@/store/performance';
import { performanceApi } from '@/lib/api/performance';
import {
    Performance,
    SearchFilters,
    CalendarEvent,
} from '@/types';

export default function Home() {
    const [selectedDate, setSelectedDate] = useState<
        Date | undefined
    >();
    const [selectedPerformance, setSelectedPerformance] =
        useState<Performance | null>(null);
    const { isAuthenticated, user } = useAuthStore();
    const {
        performances,
        filteredPerformances,
        calendarEvents,
        isLoading,
        setPerformances,
        setFilteredPerformances,
        setCalendarEvents,
        setLoading,
        clearFilters,
    } = usePerformanceStore();

    // 공연 데이터 로드
    useEffect(() => {
        loadPerformances();
    }, []);

    // 캘린더 이벤트 생성
    useEffect(() => {
        const events: CalendarEvent[] =
            filteredPerformances.map((performance) => ({
                id: performance.id,
                title: performance.title,
                date: new Date(performance.performanceDate),
                time: performance.startTime,
                venue: performance.venue,
                genre: performance.genre,
                bandName: performance.bandName,
                performance,
            }));
        setCalendarEvents(events);
    }, [filteredPerformances, setCalendarEvents]);

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

    const handleSearch = async (filters: SearchFilters) => {
        try {
            setLoading(true);
            const data =
                await performanceApi.searchPerformances(
                    filters
                );
            setFilteredPerformances(data);
        } catch (error) {
            toast.error('검색에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        clearFilters();
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        const dayPerformances = filteredPerformances.filter(
            (performance) => {
                const performanceDate = new Date(
                    performance.performanceDate
                );
                return (
                    performanceDate.toDateString() ===
                    date.toDateString()
                );
            }
        );

        if (dayPerformances.length > 0) {
            setSelectedPerformance(dayPerformances[0]);
        }
    };

    const handlePerformanceSelect = (
        performance: Performance
    ) => {
        setSelectedPerformance(performance);
    };

    const handleCloseDetail = () => {
        setSelectedPerformance(null);
    };

    const getTodayPerformances = () => {
        const today = new Date();
        return filteredPerformances.filter(
            (performance) => {
                const performanceDate = new Date(
                    performance.performanceDate
                );
                return (
                    performanceDate.toDateString() ===
                    today.toDateString()
                );
            }
        );
    };

    const getUpcomingPerformances = () => {
        const today = new Date();
        return filteredPerformances
            .filter(
                (performance) =>
                    new Date(performance.performanceDate) >
                    today
            )
            .slice(0, 3);
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1
                    className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    style={{
                        fontFamily:
                            'var(--font-seoul-notice)',
                        fontWeight: 900,
                    }}
                >
                    스테이지 플랜
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    공연자와 관객을 연결하는 플랫폼에서
                    <br />
                    모든 공연 정보를 한 곳에서 확인하고
                    예약하세요
                </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <SearchBar
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    isLoading={isLoading}
                />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    오늘의 공연
                                </p>
                                <p className="text-2xl font-bold">
                                    {
                                        getTodayPerformances()
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
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Music className="h-5 w-5 text-green-600" />
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
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Plus className="h-5 w-5 text-purple-600" />
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

            {/* Calendar Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        공연 캘린더
                    </h2>
                    {isAuthenticated &&
                        user?.role === 'PERFORMER' && (
                            <Button asChild>
                                <a href="/performances/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    공연 등록
                                </a>
                            </Button>
                        )}
                </div>

                <CalendarView
                    performances={filteredPerformances}
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDate}
                />
            </motion.div>

            {/* Selected Date Performances */}
            {selectedDate && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <h3 className="text-xl font-semibold">
                        {selectedDate.toLocaleDateString(
                            'ko-KR',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }
                        )}{' '}
                        공연
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPerformances
                            .filter((performance) => {
                                const performanceDate =
                                    new Date(
                                        performance.performanceDate
                                    );
                                return (
                                    performanceDate.toDateString() ===
                                    selectedDate.toDateString()
                                );
                            })
                            .map((performance) => (
                                <Card
                                    key={performance.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() =>
                                        handlePerformanceSelect(
                                            performance
                                        )
                                    }
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {
                                                performance.title
                                            }
                                        </CardTitle>
                                        <p className="text-muted-foreground">
                                            {
                                                performance.bandName
                                            }
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                📍{' '}
                                                {
                                                    performance.venue
                                                }
                                            </p>
                                            <p>
                                                🕒{' '}
                                                {
                                                    performance.startTime
                                                }{' '}
                                                -{' '}
                                                {
                                                    performance.endTime
                                                }
                                            </p>
                                            <p>
                                                🎵{' '}
                                                {
                                                    performance.genre
                                                }
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </motion.div>
            )}

            {/* Performance Detail Modal */}
            {selectedPerformance && (
                <PerformanceDetail
                    performance={selectedPerformance}
                    onClose={handleCloseDetail}
                />
            )}
        </div>
    );
}
