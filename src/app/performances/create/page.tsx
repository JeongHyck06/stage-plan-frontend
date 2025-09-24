'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PerformanceForm from '@/components/performance/PerformanceForm';
import { useAuthStore } from '@/store/auth';

export default function CreatePerformancePage() {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } =
        useAuthStore();

    useEffect(() => {
        // 로딩이 완료되고 인증되지 않은 경우에만 리다이렉트
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSuccess = () => {
        router.push('/performances/manage');
    };

    const handleCancel = () => {
        router.push('/performances/manage');
    };

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
                        공연을 등록하려면 먼저
                        로그인해주세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PerformanceForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}
