"use client";

import { getExportColumnConfigs } from "@/app/actions/get-export-column-configs";
import {
  ExportColumnConfigMap,
  useExportColumnConfigStore,
} from "@/hooks/use-export-column-config-store";
import { useEffect } from "react";
import { ExportColumnConfigDialog } from "./export-column-config-dialog";

export const ExportColumnConfigProvider: React.FC = () => {
  const setConfigs = useExportColumnConfigStore((s) => s.setConfigs);

  useEffect(() => {
    getExportColumnConfigs().then(({ data }) => {
      if (!data) return;
      const map: ExportColumnConfigMap = {};
      data.forEach((r) => {
        map[r.exportKey] = r.columns;
      });
      setConfigs(map);
    });
  }, [setConfigs]);

  return <ExportColumnConfigDialog />;
};
