import { create } from "zustand"

type SidebarOpenProps = {
	width: number
	open: boolean
	setOpen: (open: boolean) => void
	setWidth: (width: number) => void
}

export const useOpenSidebar = create<SidebarOpenProps>((set) => ({
	width: 0,
	open: false,
	setOpen: (open) => set({ open: open ? false : true }),
	setWidth: (width) => set({ width: width })
}))
