import { DepartmentResponseType } from "@/lib/types"
import { create } from "zustand"

export type Department = {
	id: string
	code: string
	name: string
	description: string | null
	headId: string | null
}

type TDepartment = {
	departments: DepartmentResponseType[]
	setDepartments: (data: DepartmentResponseType[]) => void
	addNew: (data: DepartmentResponseType) => void
	deleteDepartment: (id: string) => void
	updateDepartment: (code: string, data: Department) => void
	bulkDeleteDepartment: (ids: string[]) => void
}

export const useStore = create<TDepartment>((set) => ({
	departments: [],
	setDepartments: (data) => set({ departments: data }),
	addNew: (data) =>
		set((state) => ({ departments: [...state.departments, data] })),
	deleteDepartment: (id) =>
		set((state) => ({
			departments: state.departments.filter(
				(department) => department.code !== id
			)
		})),

	updateDepartment: (code, data) =>
		set((state) => ({
			departments: state.departments.map((department) =>
				department.code === code
					? { ...department, ...data }
					: department
			)
		})),
	bulkDeleteDepartment: (ids) =>
		set((state) => ({
			departments: state.departments.filter(
				(department) => !ids.includes(department.id)
			)
		}))
}))
