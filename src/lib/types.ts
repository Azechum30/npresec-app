import { Prisma } from "@prisma/client"

export const DepartmentInclude = {
	head: {
		select: {
			firstName: true,
			lastName: true,
			middleName: true
		}
	}
} satisfies Prisma.DepartmentInclude

export const DepartmentSelect = {
	id: true,
	code: true,
	name: true,
	description: true,
	headId: true,
	createdAt: true,
	head: true
} satisfies Prisma.DepartmentSelect

export type DepartmentData = Prisma.DepartmentGetPayload<{
	include: typeof DepartmentInclude
}>

export type DepartmentResponseType = Prisma.DepartmentGetPayload<{
	select: typeof DepartmentSelect
}>

export const TeacherSelect = {
	id: true,
	employeeId: true,
	firstName: true,
	lastName: true,
	middleName: true,
	birthDate: true,
	gender: true,
	departmentId: true,
	maritalStatus: true,
	ghcardNumber: true,
	phone: true,
	rank: true,
	dateOfFirstAppointment: true,
	rgNumber: true,
	ssnitNumber: true,
	userId: true,
	academicQual: true,
	licencedNumber: true,
	department: true
} satisfies Prisma.TeacherSelect

export type TeacherResponseType = Prisma.TeacherGetPayload<{
	select: typeof TeacherSelect
}>

export const ClassesSelect = {
	id: true,
	code: true,
	name: true,
	createdAt: true,
	teachers: true,
	level: true,
	department: true,
	departmentId: true,
	teacherId: true
} satisfies Prisma.ClassSelect

export type ClassesResponseType = Prisma.ClassGetPayload<{
	select: typeof ClassesSelect
}>
