'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PerformanceForm from '@/components/performance/PerformanceForm';
import { useAuthStore } from '@/store/auth';

export default function CreatePerformancePage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (
            !isAuthenticated ||
            user?.role !== 'PERFORMER'
        ) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, user, router]);

    const handleSuccess = () => {
        router.push('/performances/manage');
    };

    const handleCancel = () => {
        router.push('/performances/manage');
    };

    if (!isAuthenticated || user?.role !== 'PERFORMER') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        접근 권한이 없습니다
                    </h1>
                    <p className="text-muted-foreground">
                        공연자만 공연을 등록할 수 있습니다.
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
