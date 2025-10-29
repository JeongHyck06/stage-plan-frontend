'use client';

import { useState, useEffect, Suspense } from 'react';
import {
    useRouter,
    useSearchParams,
} from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    Mail,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    emailVerificationSchema,
    type EmailVerificationFormData,
} from '@/lib/validations/auth';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

function VerifyEmailContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isPageLoading, setIsPageLoading] =
        useState(true);
    const [emailSendAttempted, setEmailSendAttempted] =
        useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const { isAuthenticated, isLoading: authLoading } =
        useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<EmailVerificationFormData>({
        resolver: zodResolver(emailVerificationSchema),
        defaultValues: {
            email: email,
        },
    });

    const watchedEmail = watch('email');

    // 인증 상태 확인 및 리다이렉트 처리
    useEffect(() => {
        if (!authLoading) {
            setIsPageLoading(false);

            // 이미 인증된 사용자가 이메일 인증 페이지에 접근한 경우 홈으로 리다이렉트
            if (isAuthenticated) {
                router.push('/');
                return;
            }

            // 이메일 파라미터가 없는 경우 로그인 페이지로 리다이렉트
            if (!email) {
                router.push('/auth/login');
                return;
            }
        }
    }, [isAuthenticated, authLoading, email, router]);

    // 이메일이 있으면 자동으로 인증 코드 발송 (한 번만)
    useEffect(() => {
        if (
            email &&
            !isCodeSent &&
            !emailSendAttempted &&
            !isPageLoading &&
            !authLoading
        ) {
            setEmailSendAttempted(true);
            onSendCode(email);
        }
    }, [
        email,
        isCodeSent,
        emailSendAttempted,
        isPageLoading,
        authLoading,
    ]);

    const onSendCode = async (
        email: string,
        isManual: boolean = false
    ) => {
        try {
            setIsLoading(true);
            await authApi.sendVerificationEmail(email);
            setIsCodeSent(true);
            toast.success(
                isManual
                    ? '인증 코드가 재발송되었습니다. 이메일을 확인해주세요.'
                    : '인증 코드가 발송되었습니다. 이메일을 확인해주세요.'
            );
        } catch (error: unknown) {
            const errorMessage =
                (
                    error as {
                        response?: {
                            data?: { message?: string };
                        };
                    }
                )?.response?.data?.message ||
                '인증 코드 발송에 실패했습니다.';
            toast.error(errorMessage);

            // 자동 발송 실패 시에도 isCodeSent를 true로 설정하여 UI 표시
            if (!isManual) {
                setIsCodeSent(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyCode = async (
        data: EmailVerificationFormData
    ) => {
        try {
            setIsLoading(true);
            await authApi.verifyEmail(data);
            setIsVerified(true);
            toast.success('이메일 인증이 완료되었습니다!');

            // 2초 후 로그인 페이지로 이동
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (error: unknown) {
            const errorMessage =
                (
                    error as {
                        response?: {
                            data?: { message?: string };
                        };
                    }
                )?.response?.data?.message ||
                '인증 코드가 올바르지 않습니다.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // 페이지 로딩 중이거나 인증 상태 확인 중
    if (isPageLoading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        로딩 중...
                    </p>
                </div>
            </div>
        );
    }

    if (isVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-green-800">
                                인증 완료!
                            </CardTitle>
                            <CardDescription className="text-green-600">
                                이메일 인증이 성공적으로
                                완료되었습니다.
                                <br />
                                이제 로그인하실 수 있습니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button
                                onClick={() =>
                                    router.push(
                                        '/auth/login'
                                    )
                                }
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                로그인하기
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <Mail className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            이메일 인증
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {isCodeSent
                                ? '이메일로 발송된 6자리 인증 코드를 입력해주세요.'
                                : '이메일 인증 코드를 발송 중입니다...'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!isCodeSent ? (
                            <div className="text-center space-y-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-gray-600">
                                    {watchedEmail}로 인증
                                    코드를 발송하고
                                    있습니다...
                                </p>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit(
                                    onVerifyCode
                                )}
                                className="space-y-4"
                            >
                                <div className="text-center">
                                    <Badge
                                        variant="outline"
                                        className="mb-4"
                                    >
                                        {watchedEmail}
                                    </Badge>
                                    <p className="text-sm text-gray-600 mb-4">
                                        위 이메일로 발송된
                                        6자리 인증 코드를
                                        입력해주세요.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="verificationCode"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        인증 코드
                                    </label>
                                    <Input
                                        id="verificationCode"
                                        type="text"
                                        placeholder="123456"
                                        maxLength={6}
                                        {...register(
                                            'verificationCode'
                                        )}
                                        className="w-full text-center text-lg tracking-widest"
                                    />
                                    {errors.verificationCode && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors
                                                    .verificationCode
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    {isLoading
                                        ? '인증 중...'
                                        : '인증 완료'}
                                </Button>

                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        인증 코드를 받지
                                        못하셨나요?
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            onSendCode(
                                                watchedEmail,
                                                true
                                            )
                                        }
                                        disabled={isLoading}
                                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                    >
                                        인증 코드 재발송
                                    </Button>
                                </div>
                            </form>
                        )}

                        <div className="text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                            >
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                로그인 페이지로 돌아가기
                            </Link>
                        </div>

                        <div className="rounded-lg bg-yellow-50 p-4">
                            <div className="flex">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        주의사항
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>
                                                인증 코드는
                                                10분 후에
                                                만료됩니다
                                            </li>
                                            <li>
                                                스팸 폴더도
                                                확인해주세요
                                            </li>
                                            <li>
                                                코드는 한
                                                번만 사용할
                                                수 있습니다
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
