"use client";

import { saveExportColumnConfig } from "@/app/actions/save-export-column-config";
import {
  ColumnConfigItem,
  useExportColumnConfigStore,
} from "@/hooks/use-export-column-config-store";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import {
  EXPORT_COLUMN_REGISTRY,
  ExportRegistryEntry,
  getRegistryEntry,
} from "@/utils/exportColumnRegistry";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

const DIALOG_KEY = "export-column-config";

function buildDefaultColumns(entry: ExportRegistryEntry): ColumnConfigItem[] {
  return entry.columns.map((col) => ({ key: col.key, enabled: true }));
}

function mergeWithDefaults(
  entry: ExportRegistryEntry,
  saved: ColumnConfigItem[],
): ColumnConfigItem[] {
  const savedMap = new Map(saved.map((c) => [c.key, c.enabled]));
  return entry.columns.map((col) => ({
    key: col.key,
    enabled: savedMap.has(col.key) ? (savedMap.get(col.key) as boolean) : true,
  }));
}

export const ExportColumnConfigDialog: React.FC = () => {
  const { dialogs, onClose } = useGenericDialog();
  const isOpen = !!dialogs[DIALOG_KEY];

  const { configs, setConfig, getEnabledKeys } = useExportColumnConfigStore();

  const [selectedKey, setSelectedKey] = useState<string>(
    EXPORT_COLUMN_REGISTRY[0].exportKey,
  );
  const [localColumns, setLocalColumns] = useState<ColumnConfigItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    loadColumnsForKey(selectedKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedKey]);

  function loadColumnsForKey(key: string) {
    const entry = getRegistryEntry(key);
    if (!entry) return;
    const saved = configs[key];
    setLocalColumns(
      saved ? mergeWithDefaults(entry, saved) : buildDefaultColumns(entry),
    );
  }

  function handleSelectExport(key: string) {
    setSelectedKey(key);
  }

  function toggleColumn(columnKey: string, checked: boolean) {
    setLocalColumns((prev) =>
      prev.map((c) => (c.key === columnKey ? { ...c, enabled: checked } : c)),
    );
  }

  function toggleAll(enabled: boolean) {
    setLocalColumns((prev) => prev.map((c) => ({ ...c, enabled })));
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveExportColumnConfig(selectedKey, localColumns);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setConfig(selectedKey, localColumns);
    toast.success(
      `Export columns for "${getRegistryEntry(selectedKey)?.label}" saved.`,
    );
  }

  const entry = getRegistryEntry(selectedKey);
  const allEnabled = localColumns.every((c) => c.enabled);
  const noneEnabled = localColumns.every((c) => !c.enabled);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(DIALOG_KEY)}>
      {isOpen && (
        <DialogContent className="w-full md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="mb-1 bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent text-xl">
              Export Column Settings
            </DialogTitle>
            <DialogDescription>
              Choose which columns appear in each Excel export. Changes apply
              globally across all client instances.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Export Type
              </label>
              <Select value={selectedKey} onValueChange={handleSelectExport}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select export type" />
                </SelectTrigger>
                <SelectContent align="center" position="popper">
                  {EXPORT_COLUMN_REGISTRY.map((reg) => (
                    <SelectItem key={reg.exportKey} value={reg.exportKey}>
                      {reg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {entry?.label} Columns
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAll(true)}
                  disabled={allEnabled}>
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAll(false)}
                  disabled={noneEnabled}>
                  Clear All
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-[30vh] scrollbar-thin rounded-md border p-3">
              <div className="flex flex-col gap-3">
                {localColumns.map((col) => {
                  const regCol = entry?.columns.find((c) => c.key === col.key);
                  return (
                    <div
                      key={col.key}
                      className="flex items-center gap-3 hover:bg-accent/50 rounded px-1 py-0.5">
                      <Checkbox
                        id={`col-${col.key}`}
                        checked={col.enabled}
                        onCheckedChange={(checked) =>
                          toggleColumn(col.key, !!checked)
                        }
                        className="hover:cursor-pointer"
                      />
                      <label
                        htmlFor={`col-${col.key}`}
                        className="text-sm select-none hover:cursor-pointer flex-1">
                        {regCol?.label ?? col.key}
                      </label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <p className="text-xs text-muted-foreground">
              {localColumns.filter((c) => c.enabled).length} of{" "}
              {localColumns.length} columns selected
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onClose(DIALOG_KEY)}
              disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || noneEnabled}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
