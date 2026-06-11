import { create } from "zustand";

export type ColumnConfigItem = {
  key: string;
  enabled: boolean;
};

export type ExportColumnConfigMap = Record<string, ColumnConfigItem[]>;

type ExportColumnConfigState = {
  configs: ExportColumnConfigMap;
  setConfigs: (configs: ExportColumnConfigMap) => void;
  setConfig: (exportKey: string, columns: ColumnConfigItem[]) => void;
  getEnabledKeys: (exportKey: string) => string[] | null;
};

export const useExportColumnConfigStore = create<ExportColumnConfigState>(
  (set, get) => ({
    configs: {},

    setConfigs: (configs) => set({ configs }),

    setConfig: (exportKey, columns) =>
      set((state) => ({
        configs: { ...state.configs, [exportKey]: columns },
      })),

    getEnabledKeys: (exportKey) => {
      const config = get().configs[exportKey];
      if (!config) return null;
      return config.filter((c) => c.enabled).map((c) => c.key);
    },
  }),
);
