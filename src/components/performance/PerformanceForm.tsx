'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    MapPin,
    Music,
    Users,
    FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    createPerformanceSchema,
    updatePerformanceSchema,
    type CreatePerformanceFormData,
} from '@/lib/validations/performance';
import { performanceApi } from '@/lib/api/performance';
import { usePerformanceStore } from '@/store/performance';
import { Performance } from '@/types';

const genres = [
    '락',
    '팝',
    '재즈',
    '클래식',
    '힙합',
    'R&B',
    '일렉트로닉',
    '포크',
    '블루스',
    '메탈',
    '기타',
];

interface PerformanceFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    performance?: Performance;
    isEditing?: boolean;
}

export default function PerformanceForm({
    onSuccess,
    onCancel,
    performance,
    isEditing = false,
}: PerformanceFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setPerformances } = usePerformanceStore();

    const schema = isEditing
        ? updatePerformanceSchema
        : createPerformanceSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<CreatePerformanceFormData>({
        resolver: zodResolver(schema),
        defaultValues: performance
            ? {
                  title: performance.title,
                  content: performance.content,
                  genre: performance.genre,
                  bandName: performance.bandName,
                  venue: performance.venue,
                  performanceDate:
                      performance.performanceDate,
                  startTime: performance.startTime,
                  endTime: performance.endTime,
              }
            : undefined,
    });

    const watchedContent = watch('content', '');

    const onSubmit = async (
        data: CreatePerformanceFormData
    ) => {
        try {
            setIsSubmitting(true);

            if (isEditing && performance) {
                await performanceApi.updatePerformance(
                    performance.id,
                    data
                );
                toast.success('공연이 수정되었습니다!');
            } else {
                await performanceApi.createPerformance(
                    data
                );
                toast.success('공연이 등록되었습니다!');
            }

            // 공연 목록 새로고침
            const updatedPerformances =
                await performanceApi.getAllPerformances();
            setPerformances(updatedPerformances);

            onSuccess();
        } catch (error) {
            const errorMessage = isEditing
                ? '공연 수정에 실패했습니다.'
                : '공연 등록에 실패했습니다.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onCancel}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center space-x-2">
                            <Music className="h-6 w-6" />
                            <span>
                                {isEditing
                                    ? '공연 수정'
                                    : '새 공연 등록'}
                            </span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="title"
                                        className="text-sm font-medium flex items-center space-x-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>
                                            공연 제목 *
                                        </span>
                                    </label>
                                    <Input
                                        id="title"
                                        placeholder="공연 제목을 입력하세요"
                                        {...register(
                                            'title'
                                        )}
                                        className={
                                            errors.title
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">
                                            {
                                                errors.title
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="bandName"
                                        className="text-sm font-medium flex items-center space-x-2"
                                    >
                                        <Users className="h-4 w-4" />
                                        <span>
                                            밴드명 *
                                        </span>
                                    </label>
                                    <Input
                                        id="bandName"
                                        placeholder="밴드명을 입력하세요"
                                        {...register(
                                            'bandName'
                                        )}
                                        className={
                                            errors.bandName
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.bandName && (
                                        <p className="text-sm text-red-500">
                                            {
                                                errors
                                                    .bandName
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Genre */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="genre"
                                    className="text-sm font-medium flex items-center space-x-2"
                                >
                                    <Music className="h-4 w-4" />
                                    <span>장르 *</span>
                                </label>
                                <select
                                    id="genre"
                                    {...register('genre')}
                                    className={`w-full h-10 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                                        errors.genre
                                            ? 'border-red-500'
                                            : 'border-input'
                                    }`}
                                >
                                    <option value="">
                                        장르를 선택하세요
                                    </option>
                                    {genres.map((genre) => (
                                        <option
                                            key={genre}
                                            value={genre}
                                        >
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                                {errors.genre && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.genre
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="performanceDate"
                                        className="text-sm font-medium flex items-center space-x-2"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            공연 날짜 *
                                        </span>
                                    </label>
                                    <Input
                                        id="performanceDate"
                                        type="date"
                                        min={getMinDate()}
                                        {...register(
                                            'performanceDate'
                                        )}
                                        className={
                                            errors.performanceDate
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.performanceDate && (
                                        <p className="text-sm text-red-500">
                                            {
                                                errors
                                                    .performanceDate
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="startTime"
                                        className="text-sm font-medium flex items-center space-x-2"
                                    >
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            시작 시간 *
                                        </span>
                                    </label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        {...register(
                                            'startTime'
                                        )}
                                        className={
                                            errors.startTime
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.startTime && (
                                        <p className="text-sm text-red-500">
                                            {
                                                errors
                                                    .startTime
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="endTime"
                                        className="text-sm font-medium flex items-center space-x-2"
                                    >
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            종료 시간 *
                                        </span>
                                    </label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        {...register(
                                            'endTime'
                                        )}
                                        className={
                                            errors.endTime
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.endTime && (
                                        <p className="text-sm text-red-500">
                                            {
                                                errors
                                                    .endTime
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Venue */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="venue"
                                    className="text-sm font-medium flex items-center space-x-2"
                                >
                                    <MapPin className="h-4 w-4" />
                                    <span>공연 장소 *</span>
                                </label>
                                <Input
                                    id="venue"
                                    placeholder="공연 장소를 입력하세요"
                                    {...register('venue')}
                                    className={
                                        errors.venue
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                {errors.venue && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.venue
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="content"
                                    className="text-sm font-medium flex items-center space-x-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>공연 소개 *</span>
                                </label>
                                <textarea
                                    id="content"
                                    rows={6}
                                    placeholder="공연에 대한 자세한 소개를 작성해주세요..."
                                    {...register('content')}
                                    className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none ${
                                        errors.content
                                            ? 'border-red-500'
                                            : 'border-input'
                                    }`}
                                />
                                {errors.content && (
                                    <p className="text-sm text-red-500">
                                        {
                                            errors.content
                                                .message
                                        }
                                    </p>
                                )}
                                <div className="text-xs text-muted-foreground text-right">
                                    {watchedContent?.length ||
                                        0}
                                    /1000
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-2 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? isEditing
                                            ? '수정 중...'
                                            : '등록 중...'
                                        : isEditing
                                        ? '공연 수정'
                                        : '공연 등록'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
