import { create } from "zustand";

type DialogState = {
  [dialogId: string]: boolean;
};

type DialogProps = {
  id?: string;
  dialogs: DialogState;
  onOpen: (dialogId: string, id?: string) => void;
  onClose: (dialogId: string) => void;
};

export const useGenericDialog = create<DialogProps>((set) => ({
  id: "",
  dialogs: {},
  onOpen: (dialogId, id) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [dialogId]: true },
      id: id,
    })),
  onClose: (dialogId) =>
    set((state) => ({
      dialogs: { ...state.dialogs, [dialogId]: false },
      id: undefined,
    })),
}));
