import { z } from 'zod';

export const signUpSchema = z
    .object({
        email: z
            .string()
            .min(1, '이메일을 입력해주세요')
            .email('올바른 이메일 형식을 입력해주세요'),
        password: z
            .string()
            .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다'
            ),
        confirmPassword: z.string(),
        name: z
            .string()
            .min(2, '이름은 최소 2자 이상이어야 합니다')
            .max(
                50,
                '이름은 최대 50자까지 입력할 수 있습니다'
            ),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: '비밀번호가 일치하지 않습니다',
            path: ['confirmPassword'],
        }
    );

export const signInSchema = z.object({
    email: z
        .string()
        .min(1, '이메일을 입력해주세요')
        .email('올바른 이메일 형식을 입력해주세요'),
    password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export const emailVerificationSchema = z.object({
    email: z
        .string()
        .min(1, '이메일을 입력해주세요')
        .email('올바른 이메일 형식을 입력해주세요'),
    verificationCode: z
        .string()
        .min(1, '인증 코드를 입력해주세요')
        .regex(
            /^\d{6}$/,
            '인증 코드는 6자리 숫자여야 합니다'
        ),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type EmailVerificationFormData = z.infer<
    typeof emailVerificationSchema
>;
