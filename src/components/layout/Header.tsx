'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout, isLoading } =
        useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    const navigation = [
        { name: '캘린더', href: '/', icon: Calendar },
        {
            name: '커뮤니티',
            href: '/community',
            icon: Users,
        },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2"
                        >
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <span
                                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                                style={{
                                    fontFamily:
                                        'var(--font-seoul-notice)',
                                    fontWeight: 900,
                                }}
                            >
                                스테이지 플랜
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {!isLoading && isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-muted-foreground">
                                        안녕하세요,
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="h-auto p-0 font-medium hover:bg-transparent"
                                    >
                                        <Link href="/profile">
                                            {user?.name}
                                        </Link>
                                    </Button>
                                </div>
                                <div className="h-4 w-px bg-border"></div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>로그아웃</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <Link href="/auth/login">
                                        로그인
                                    </Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/auth/signup">
                                        가입
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setIsMenuOpen(!isMenuOpen)
                            }
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t"
                    >
                        <div className="py-4 space-y-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() =>
                                        setIsMenuOpen(false)
                                    }
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}

                            <div className="pt-4 border-t space-y-3">
                                {!isLoading &&
                                isAuthenticated ? (
                                    <>
                                        <div className="px-2 py-1">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    안녕하세요,
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-auto p-0 font-medium hover:bg-transparent"
                                                >
                                                    <Link href="/profile">
                                                        {
                                                            user?.name
                                                        }
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={
                                                handleLogout
                                            }
                                            className="w-full justify-start"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            로그아웃
                                        </Button>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="w-full"
                                        >
                                            <Link href="/auth/login">
                                                로그인
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            asChild
                                            className="w-full"
                                        >
                                            <Link href="/auth/signup">
                                                가입
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
}
