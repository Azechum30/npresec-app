import { TeacherResponseType } from "@/lib/types"
import { create } from "zustand"

type StoreProps = {
	intialState: TeacherResponseType[]
	setTeachers: (data: TeacherResponseType[]) => void
	addTeacher: (data: TeacherResponseType) => void
	deleteTeacher: (employeeId: string) => void
	updateTeacher: (id: string, date: TeacherResponseType) => void
	bulkAddTeachers: (data: TeacherResponseType[]) => void
}

export const useTeacherStore = create<StoreProps>((set) => ({
	intialState: [],
	setTeachers: (data) => set({ intialState: data }),
	addTeacher: (data) =>
		set((state) => ({ intialState: [...state.intialState, data] })),
	deleteTeacher: (employeeId) =>
		set((state) => ({
			intialState: state.intialState.filter(
				(teacher) => teacher.employeeId !== employeeId
			)
		})),
	updateTeacher: (id, data) =>
		set((state) => ({
			intialState: state.intialState.map((teacher) =>
				teacher.employeeId === id ? { ...teacher, ...data } : teacher
			)
		})),
	bulkAddTeachers: (data) =>
		set((state) => ({ intialState: [...state.intialState, ...data] }))
}))
