import { create } from 'zustand';
import { streakService } from '@/services/streaks.service';

interface StreaksStore {
  streakCount: number;
  isLoading: boolean;
  error: string | null;
  fetchStreakCount: () => Promise<void>;
  clearError: () => void;
}

export const useStreaksStore = create<StreaksStore>((set) => ({
  streakCount: 0,
  isLoading: false,
  error: null,

  fetchStreakCount: async () => {
    try {
      set({ isLoading: true, error: null });
      const count = await streakService.getStreakCount();
      set({ streakCount: count });
    } catch (error) {
      console.error('Error in fetchStreakCount:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch streak count',
        streakCount: 0
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
