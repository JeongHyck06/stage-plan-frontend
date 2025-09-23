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
            // 필터가 없으면 모든 공연을 표시
            const { searchFilters } = get();
            if (Object.keys(searchFilters).length === 0) {
                set({ filteredPerformances: performances });
            }
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
            const { performances } = get();
            set({
                searchFilters: {},
                filteredPerformances: performances,
            });
        },
    })
);
