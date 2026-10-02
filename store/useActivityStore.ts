import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActivityLog {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
}

interface ActivityStore {
  logs: ActivityLog[];
  addLog: (action: string, detail: string) => void;
  clearLogs: () => void;
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (action, detail) => {
        const log: ActivityLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          action,
          detail,
          timestamp: new Date().toISOString(),
        };
        set({ logs: [log, ...get().logs].slice(0, 100) });
      },
      clearLogs: () => set({ logs: [] }),
    }),
    { name: "toppersthrifts-logs" }
  )
);