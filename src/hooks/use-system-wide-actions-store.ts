import { create } from "zustand";

export type SystemSettings = {
  id?: string;
  enableEditing: boolean;
  enableDeleting: boolean;
  enableScoresEntry: boolean;
  enableDataExports: boolean;
  updatedAt?: string;
};

type SystemState = {
  settings: SystemSettings | null;
  setSettings: (s: SystemSettings) => void;
  updatePartial: (patch: Partial<SystemSettings>) => void;
  clear: () => void;
};

const defaultSettings: SystemSettings = {
  enableEditing: false,
  enableDeleting: false,
  enableScoresEntry: false,
  enableDataExports: false,
};

export const useSystemWideActionsStore = create<SystemState>((set, get) => ({
  settings: null,

  setSettings: (s) => {
    set(() => ({ settings: s }));
  },

  updatePartial: (patch) => {
    const cur = get().settings ?? defaultSettings;
    set(() => ({ settings: { ...cur, ...patch } }));
  },

  clear: () => set(() => ({ settings: null })),
}));
