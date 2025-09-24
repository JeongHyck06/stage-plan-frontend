'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Github, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
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
                        <p className="text-sm text-muted-foreground max-w-xs">
                            공연 일정을 관리하고 공유하는
                            스테이지 플랫폼입니다. 모든 공연
                            정보를 한 곳에서 확인하고
                            예약하세요.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">
                            빠른 링크
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-foreground transition-colors"
                                >
                                    캘린더
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/community"
                                    className="hover:text-foreground transition-colors"
                                >
                                    커뮤니티
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/auth/signup"
                                    className="hover:text-foreground transition-colors"
                                >
                                    가입하기
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">
                            연락처
                        </h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>
                                    devjack050700@gmail.com
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Github className="h-4 w-4" />
                                <a
                                    href="https://github.com/JeongHyck06/stage-plan-frontend"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} 스테이지 플랜.
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
