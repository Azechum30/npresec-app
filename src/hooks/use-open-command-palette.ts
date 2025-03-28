import { create } from "zustand"

export const useOpenCommandPalette = create<{
	open: boolean
	onOpen: () => void
	onClose: () => void
}>((set) => ({
	open: false,
	onOpen: () => set({ open: true }),
	onClose: () => set({ open: false })
}))
