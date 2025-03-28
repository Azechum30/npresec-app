import { create } from "zustand"

type DialogState = {
	["dialogs"]: string
}

type UploadHookProps = {
	open: boolean
	onOpen: () => void
	onClose: () => void
}

export const useUpload = create<UploadHookProps>((set) => ({
	open: false,
	onOpen: () => set({ open: true }),
	onClose: () => set({ open: false })
}))
