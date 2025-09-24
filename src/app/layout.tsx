import type { Metadata } from 'next';
import {
    Geist,
    Geist_Mono,
    Noto_Sans_KR,
    Inter,
} from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const notoSansKR = Noto_Sans_KR({
    variable: '--font-noto-sans-kr',
    subsets: ['latin'],
    weight: [
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
    ],
    display: 'swap',
});

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    weight: [
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
    ],
    display: 'swap',
});

export const metadata: Metadata = {
    title: '스테이지 플랜 - 공연 일정 관리 플랫폼',
    description:
        '모든 공연 정보를 한 곳에서 확인하고 예약하세요. 공연 일정을 관리하고 공유하는 스테이지 플랫폼입니다.',
    keywords: [
        '공연',
        '예약',
        '캘린더',
        '커뮤니티',
        '스테이지',
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}
            >
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                            border: '1px solid var(--border)',
                        },
                    }}
                />
            </body>
        </html>
    );
}
