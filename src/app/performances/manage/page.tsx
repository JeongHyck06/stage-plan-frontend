'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PerformanceManagement from '@/components/performance/PerformanceManagement';
import PerformanceForm from '@/components/performance/PerformanceForm';
import { useAuthStore } from '@/store/auth';
import { performanceApi } from '@/lib/api/performance';
import { Performance } from '@/types';

export default function ManagePerformancesPage() {
    const router = useRouter();
    const [performances, setPerformances] = useState<
        Performance[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] =
        useState(false);
    const [editingPerformance, setEditingPerformance] =
        useState<Performance | null>(null);

    const { isAuthenticated, user, isLoading } =
        useAuthStore();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        if (isAuthenticated) {
            loadPerformances();
        }
    }, [isAuthenticated, isLoading, router]);

    const loadPerformances = async () => {
        try {
            setIsLoading(true);
            const data =
                await performanceApi.getMyPerformances();
            setPerformances(data);
        } catch (error) {
            toast.error(
                '공연 정보를 불러오는데 실패했습니다.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (performance: Performance) => {
        setEditingPerformance(performance);
    };

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        loadPerformances();
    };

    const handleEditSuccess = () => {
        setEditingPerformance(null);
        loadPerformances();
    };

    const handleCancel = () => {
        setShowCreateForm(false);
        setEditingPerformance(null);
    };

    const getTotalPerformances = () => performances.length;
    const getUpcomingPerformances = () =>
        performances.filter((p) => p.status === 'UPCOMING')
            .length;
    const getCompletedPerformances = () =>
        performances.filter((p) => p.status === 'COMPLETED')
            .length;

    // 로딩 중이거나 인증 상태를 확인하는 중
    if (isLoading || (!isAuthenticated && !isLoading)) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                        인증 상태를 확인하는 중...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        로그인이 필요합니다
                    </h1>
                    <p className="text-muted-foreground">
                        공연을 관리하려면 먼저
                        로그인해주세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        공연 관리
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        내가 등록한 공연들을 관리하고
                        수정하세요
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateForm(true)}
                >
                    새 공연 등록
                </Button>
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
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    전체 공연
                                </p>
                                <p className="text-2xl font-bold">
                                    {getTotalPerformances()}
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
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    예정된 공연
                                </p>
                                <p className="text-2xl font-bold">
                                    {getUpcomingPerformances()}
                                    개
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Settings className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    완료된 공연
                                </p>
                                <p className="text-2xl font-bold">
                                    {getCompletedPerformances()}
                                    개
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Performance Management */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">
                            공연 정보를 불러오는 중...
                        </p>
                    </div>
                ) : (
                    <PerformanceManagement
                        performances={performances}
                        onEdit={handleEdit}
                        onRefresh={loadPerformances}
                    />
                )}
            </motion.div>

            {/* Create Performance Form */}
            {showCreateForm && (
                <PerformanceForm
                    onSuccess={handleCreateSuccess}
                    onCancel={handleCancel}
                />
            )}

            {/* Edit Performance Form */}
            {editingPerformance && (
                <PerformanceForm
                    performance={editingPerformance}
                    isEditing={true}
                    onSuccess={handleEditSuccess}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}
