import { create } from "zustand"

type Props = {
	open: boolean
	onOpen: () => void
	onClose: () => void
}

export const useCreateDepartment = create<Props>((set) => ({
	open: false,
	onOpen: () => set({ open: true }),
	onClose: () => set({ open: false })
}))
