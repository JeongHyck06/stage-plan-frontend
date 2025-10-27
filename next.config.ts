import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // 환경 변수 설정
    env: {
        NEXT_PUBLIC_API_URL:
            process.env.NEXT_PUBLIC_API_URL ||
            'https://43.201.96.136:8080',
    },

    // HTTPS 리다이렉트 설정
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
