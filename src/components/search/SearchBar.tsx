'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SearchFilters } from '@/types';

interface SearchBarProps {
    onSearch: (filters: SearchFilters) => void;
    onClear: () => void;
    isLoading?: boolean;
}

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

export default function SearchBar({
    onSearch,
    onClear,
    isLoading = false,
}: SearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        keyword: '',
        genre: '',
        bandName: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 검색 조건이 하나도 없으면 경고 메시지 표시
        const hasSearchConditions =
            (filters.keyword && filters.keyword.trim()) ||
            (filters.genre && filters.genre.trim()) ||
            (filters.bandName && filters.bandName.trim());

        if (!hasSearchConditions) {
            toast.error('검색어를 입력해주세요.');
            return;
        }

        onSearch(filters);
    };

    const handleClear = () => {
        setFilters({
            keyword: '',
            genre: '',
            bandName: '',
        });
        onClear();
        setIsExpanded(false);
    };

    const hasActiveFilters =
        filters.keyword ||
        filters.genre ||
        filters.bandName;

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Main Search Input */}
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="공연명, 밴드명, 장르로 검색..."
                                value={filters.keyword}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        keyword:
                                            e.target.value,
                                    }))
                                }
                                className="pl-10 pr-4"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="px-6"
                        >
                            {isLoading
                                ? '검색 중...'
                                : '검색'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setIsExpanded(!isExpanded)
                            }
                            className="flex items-center space-x-2"
                        >
                            <Filter className="h-4 w-4" />
                            <span>필터</span>
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Expanded Filters */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    height: 'auto',
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                }}
                                className="space-y-4 pt-4 border-t"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            밴드명
                                        </label>
                                        <Input
                                            placeholder="밴드명을 입력하세요"
                                            value={
                                                filters.bandName ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setFilters(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        bandName:
                                                            e
                                                                .target
                                                                .value,
                                                    })
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            장르
                                        </label>
                                        <select
                                            value={
                                                filters.genre ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setFilters(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        genre: e
                                                            .target
                                                            .value,
                                                    })
                                                )
                                            }
                                            className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                            <option value="">
                                                모든 장르
                                            </option>
                                            {genres.map(
                                                (genre) => (
                                                    <option
                                                        key={
                                                            genre
                                                        }
                                                        value={
                                                            genre
                                                        }
                                                    >
                                                        {
                                                            genre
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={
                                            handleClear
                                        }
                                    >
                                        초기화
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        검색
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap gap-2 pt-2"
                        >
                            {filters.keyword && (
                                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                                    <span>
                                        검색어:{' '}
                                        {filters.keyword}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setFilters(
                                                (prev) => ({
                                                    ...prev,
                                                    keyword:
                                                        '',
                                                })
                                            )
                                        }
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            {filters.bandName && (
                                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                                    <span>
                                        밴드:{' '}
                                        {filters.bandName}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setFilters(
                                                (prev) => ({
                                                    ...prev,
                                                    bandName:
                                                        '',
                                                })
                                            )
                                        }
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            {filters.genre && (
                                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                                    <span>
                                        장르:{' '}
                                        {filters.genre}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setFilters(
                                                (prev) => ({
                                                    ...prev,
                                                    genre: '',
                                                })
                                            )
                                        }
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
