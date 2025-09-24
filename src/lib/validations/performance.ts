import { z } from 'zod';

export const createPerformanceSchema = z
    .object({
        title: z
            .string()
            .min(1, '공연 제목을 입력해주세요')
            .max(
                100,
                '공연 제목은 최대 100자까지 입력할 수 있습니다'
            ),
        content: z
            .string()
            .min(
                10,
                '공연 소개는 최소 10자 이상이어야 합니다'
            )
            .max(
                1000,
                '공연 소개는 최대 1000자까지 입력할 수 있습니다'
            ),
        genre: z.string().min(1, '장르를 선택해주세요'),
        bandName: z
            .string()
            .min(1, '밴드명을 입력해주세요')
            .max(
                50,
                '밴드명은 최대 50자까지 입력할 수 있습니다'
            ),
        venue: z
            .string()
            .min(1, '장소를 입력해주세요')
            .max(
                100,
                '장소는 최대 100자까지 입력할 수 있습니다'
            ),
        performanceDate: z
            .string()
            .min(1, '공연 날짜를 선택해주세요'),
        startTime: z
            .string()
            .min(1, '시작 시간을 입력해주세요')
            .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                '올바른 시간 형식으로 입력해주세요 (HH:MM)'
            ),
        endTime: z
            .string()
            .min(1, '종료 시간을 입력해주세요')
            .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                '올바른 시간 형식으로 입력해주세요 (HH:MM)'
            ),
    })
    .refine(
        (data) => {
            const startTime = new Date(
                `2000-01-01T${data.startTime}`
            );
            const endTime = new Date(
                `2000-01-01T${data.endTime}`
            );
            return endTime > startTime;
        },
        {
            message:
                '종료 시간은 시작 시간보다 늦어야 합니다',
            path: ['endTime'],
        }
    )
    .refine(
        (data) => {
            const performanceDate = new Date(
                data.performanceDate
            );
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return performanceDate >= today;
        },
        {
            message: '공연 날짜는 오늘 이후여야 합니다',
            path: ['performanceDate'],
        }
    );

export const updatePerformanceSchema = z
    .object({
        title: z
            .string()
            .min(1, '공연 제목을 입력해주세요')
            .max(
                100,
                '공연 제목은 최대 100자까지 입력할 수 있습니다'
            )
            .optional(),
        content: z
            .string()
            .min(
                10,
                '공연 소개는 최소 10자 이상이어야 합니다'
            )
            .max(
                1000,
                '공연 소개는 최대 1000자까지 입력할 수 있습니다'
            )
            .optional(),
        genre: z
            .string()
            .min(1, '장르를 선택해주세요')
            .optional(),
        bandName: z
            .string()
            .min(1, '밴드명을 입력해주세요')
            .max(
                50,
                '밴드명은 최대 50자까지 입력할 수 있습니다'
            )
            .optional(),
        venue: z
            .string()
            .min(1, '장소를 입력해주세요')
            .max(
                100,
                '장소는 최대 100자까지 입력할 수 있습니다'
            )
            .optional(),
        performanceDate: z
            .string()
            .min(1, '공연 날짜를 선택해주세요')
            .optional(),
        startTime: z
            .string()
            .min(1, '시작 시간을 입력해주세요')
            .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                '올바른 시간 형식으로 입력해주세요 (HH:MM)'
            )
            .optional(),
        endTime: z
            .string()
            .min(1, '종료 시간을 입력해주세요')
            .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                '올바른 시간 형식으로 입력해주세요 (HH:MM)'
            )
            .optional(),
    })
    .refine(
        (data) => {
            if (data.startTime && data.endTime) {
                const startTime = new Date(
                    `2000-01-01T${data.startTime}`
                );
                const endTime = new Date(
                    `2000-01-01T${data.endTime}`
                );
                return endTime > startTime;
            }
            return true;
        },
        {
            message:
                '종료 시간은 시작 시간보다 늦어야 합니다',
            path: ['endTime'],
        }
    )
    .refine(
        (data) => {
            if (data.performanceDate) {
                const performanceDate = new Date(
                    data.performanceDate
                );
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return performanceDate >= today;
            }
            return true;
        },
        {
            message: '공연 날짜는 오늘 이후여야 합니다',
            path: ['performanceDate'],
        }
    );

export type CreatePerformanceFormData = z.infer<
    typeof createPerformanceSchema
>;
export type UpdatePerformanceFormData = z.infer<
    typeof updatePerformanceSchema
>;
