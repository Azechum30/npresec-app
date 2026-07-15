/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import {
  type SystemSettings,
  useSystemWideActionsStore,
} from "@/hooks/use-system-wide-actions-store";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Switch } from "../ui/switch";

import { getSystemSettings } from "@/app/actions/get-system-settings";
import { updateSystemSettings } from "@/app/actions/update-system-settings";

export const SetSystemWideActions: React.FC = () => {
  const { dialogs, onClose } = useGenericDialog();

  const settings = useSystemWideActionsStore((s) => s.settings);
  const setSettings = useSystemWideActionsStore((s) => s.setSettings);
  const updatePartial = useSystemWideActionsStore((s) => s.updatePartial);

  const [busy, setBusy] = useState({
    editing: false,
    deleting: false,
    exports: false,
    scores: false,
  });

  const local = settings ?? {
    enableEditing: false,
    enableDeleting: false,
    enableScoresEntry: false,
    enableDataExports: false,
  };

  async function handleToggle<K extends keyof SystemSettings>(
    key: K,
    value?: boolean,
    busyKey?: keyof typeof busy,
  ) {
    if (busyKey) setBusy((b) => ({ ...b, [busyKey]: true }));

    const next = typeof value === "boolean" ? value : !(local[key] as boolean);

    updatePartial({
      [key]: next,
      updatedAt: new Date().toISOString(),
    } as Partial<SystemSettings>);

    try {
      await updateSystemSettings({
        enableEditing: key === "enableEditing" ? (next as boolean) : undefined,
        enableDeleting:
          key === "enableDeleting" ? (next as boolean) : undefined,
        enableScoresEntry:
          key === "enableScoresEntry" ? (next as boolean) : undefined,
        enableDataExports:
          key === "enableDataExports" ? (next as boolean) : undefined,
      } as {
        enableEditing?: boolean;
        enableDeleting?: boolean;
        enableScoresEntry?: boolean;
        enableDataExports?: boolean;
      });
    } catch (err) {
      try {
        const { settings } = await getSystemSettings();
        if (settings) {
          setSettings(settings);
        }
      } catch (e) {
        setSettings(
          settings ?? {
            enableEditing: false,
            enableDeleting: false,
            enableScoresEntry: false,
            enableDataExports: false,
          },
        );
      }
    } finally {
      if (busyKey) setBusy((b) => ({ ...b, [busyKey]: false }));
    }
  }

  return (
    <Dialog
      open={!!dialogs["open-system-wide-actions-setting"]}
      onOpenChange={() => onClose("open-system-wide-actions-setting")}>
      {!!dialogs["open-system-wide-actions-setting"] && (
        <DialogContent className="w-full md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="mb-3 bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent text-xl">
              System Settings
            </DialogTitle>
            <DialogDescription>
              Enable or disable features across the system in realtime. Changes
              are propagated across all clients.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 border p-4 rounded-md">
            <div className="flex justify-between items-center space-x-3">
              <span className="text-muted-foreground font-light">
                Enable/Disable Editing
              </span>
              <Switch
                checked={local.enableEditing}
                onCheckedChange={(v) =>
                  handleToggle("enableEditing", v, "editing")
                }
                disabled={busy.editing}
                className="hover:cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center space-x-3">
              <span className="text-muted-foreground font-light">
                Enable/Disable Deleting
              </span>
              <Switch
                checked={local.enableDeleting}
                onCheckedChange={(v) =>
                  handleToggle("enableDeleting", v, "deleting")
                }
                disabled={busy.deleting}
                className="hover:cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center space-x-3">
              <span className="text-muted-foreground font-light">
                Enable/Disable Data Exports
              </span>
              <Switch
                checked={local.enableDataExports}
                onCheckedChange={(v) =>
                  handleToggle("enableDataExports", v, "exports")
                }
                disabled={busy.exports}
                className="hover:cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center space-x-3">
              <span className="text-muted-foreground font-light">
                Enable/Disable Score Entry
              </span>
              <Switch
                checked={local.enableScoresEntry}
                onCheckedChange={(v) =>
                  handleToggle("enableScoresEntry", v, "scores")
                }
                disabled={busy.scores}
                className="hover:cursor-pointer"
              />
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
