import { create } from "zustand"

type Props = {
	id: string
	open: boolean
	onOpen: (id: string) => void
	onClose: () => void
}

export const useEditDepartment = create<Props>((set) => ({
	id: "",
	open: false,
	onOpen: (id) => set({ open: true, id: id }),
	onClose: () => set({ open: false, id: undefined })
}))
