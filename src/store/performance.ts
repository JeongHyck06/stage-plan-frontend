import { create } from 'zustand';
import {
    Performance,
    SearchFilters,
    CalendarEvent,
} from '@/types';

interface PerformanceState {
    performances: Performance[];
    filteredPerformances: Performance[];
    calendarEvents: CalendarEvent[];
    searchFilters: SearchFilters;
    isLoading: boolean;
    setPerformances: (performances: Performance[]) => void;
    setFilteredPerformances: (
        performances: Performance[]
    ) => void;
    setCalendarEvents: (events: CalendarEvent[]) => void;
    setSearchFilters: (filters: SearchFilters) => void;
    setLoading: (loading: boolean) => void;
    clearFilters: () => void;
}

export const usePerformanceStore = create<PerformanceState>(
    (set, get) => ({
        performances: [],
        filteredPerformances: [],
        calendarEvents: [],
        searchFilters: {},
        isLoading: false,
        setPerformances: (performances: Performance[]) => {
            set({ performances });
            // 초기 로드 시에는 filteredPerformances를 빈 배열로 설정
            // 사용자가 명시적으로 검색해야만 결과가 표시됨
            set({ filteredPerformances: [] });
        },
        setFilteredPerformances: (
            performances: Performance[]
        ) => set({ filteredPerformances: performances }),
        setCalendarEvents: (events: CalendarEvent[]) =>
            set({ calendarEvents: events }),
        setSearchFilters: (filters: SearchFilters) =>
            set({ searchFilters: filters }),
        setLoading: (loading: boolean) =>
            set({ isLoading: loading }),
        clearFilters: () => {
            set({
                searchFilters: {},
                filteredPerformances: [],
            });
        },
    })
);
