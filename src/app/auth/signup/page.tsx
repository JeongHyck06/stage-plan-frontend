'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Calendar } from 'lucide-react';
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
import {
    signUpSchema,
    type SignUpFormData,
} from '@/lib/validations/auth';
import { authApi } from '@/lib/api/auth';
// import { useAuthStore } from '@/store/auth'; // 회원가입 시에는 사용하지 않음

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // 회원가입 시에는 인증 상태를 설정하지 않음
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            setIsLoading(true);
            const { confirmPassword: _, ...signUpData } =
                data;
            const response = await authApi.signUp(
                signUpData
            );

            // 회원가입 성공 시 이메일 인증 페이지로 리다이렉트
            toast.success(
                '회원가입이 완료되었습니다! 이메일 인증을 완료해주세요.'
            );
            router.push(
                `/auth/verify-email?email=${encodeURIComponent(
                    signUpData.email
                )}`
            );
        } catch (error) {
            toast.error('회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                stiffness: 200,
                            }}
                            className="mx-auto mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                        >
                            <Calendar className="h-6 w-6 text-white" />
                        </motion.div>
                        <CardTitle
                            className="text-2xl font-bold"
                            style={{
                                fontFamily:
                                    'var(--font-seoul-notice)',
                                fontWeight: 900,
                            }}
                        >
                            스테이지 플랜 가입
                        </CardTitle>
                        <CardDescription>
                            공연 일정을 관리하고 공유하는
                            플랫폼에 오신 것을 환영합니다
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(
                                onSubmit
                            )}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    이메일
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    {...register('email')}
                                    className={
                                        errors.email
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.email
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    이름
                                </label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="홍길동"
                                    {...register('name')}
                                    className={
                                        errors.name
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.name
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    비밀번호
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="비밀번호를 입력하세요"
                                        {...register(
                                            'password'
                                        )}
                                        className={
                                            errors.password
                                                ? 'border-red-500 pr-10'
                                                : 'pr-10'
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.password
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="confirmPassword"
                                    className="text-sm font-medium"
                                >
                                    비밀번호 확인
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="비밀번호를 다시 입력하세요"
                                        {...register(
                                            'confirmPassword'
                                        )}
                                        className={
                                            errors.confirmPassword
                                                ? 'border-red-500 pr-10'
                                                : 'pr-10'
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors
                                                .confirmPassword
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? '가입 중...'
                                    : '가입하기'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                이미 계정이 있으신가요?{' '}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-primary hover:underline"
                                >
                                    로그인
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
