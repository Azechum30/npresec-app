"use server"
import "server-only"
import { getSession } from "@/lib/get-user"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { DepartmentType, DepartmentSchema } from "@/lib/validation"
import { DepartmentSelect } from "@/lib/types"

export const createDepartment = async (data: DepartmentType) => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("Unauthorized!")

		const validData = DepartmentSchema.parse(data)

		const response = await prisma.department.create({
			data: validData,
			select: DepartmentSelect
		})

		return { success: true, response }
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2003") {
				return {
					success: false,
					error: "Foreign Key Constraint failed!"
				}
			} else if (error.code === "P2002") {
				const targetFields = error.meta?.target as string[]
				const errorMessage = targetFields.includes("code")
					? "Department code already taken!"
					: targetFields.includes("name")
					? "Department name already taken!"
					: "Teacher is already assigned!"
				return { success: false, error: errorMessage }
			}
		} else if (error instanceof TypeError) {
			console.log("Type Error", error)
			return { success: false, error: "Invalid argument type" }
		}
	}
}

export const updateDepartmentAction = async (
	id: string,
	data: DepartmentType
) => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("Unauthorized!")

		const validData = DepartmentSchema.parse(data)

		const response = await prisma.department.update({
			where: {
				id
			},
			data: {
				...validData
			},
			select: DepartmentSelect
		})

		if (!response) return { success: false, error: "Update failed!" }

		return { success: true, response }
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2003") {
				console.log("Error: ", "Foreign key constraint failed")
				return {
					success: false,
					error: "Foreign key constraint failed"
				}
			} else if (error.code === "P2002") {
				const targetFields = error.meta?.target as string[]
				const errorMessage = targetFields.includes("code")
					? "Department code already taken!"
					: targetFields.includes("name")
					? "Department name already taken!"
					: "Teacher is already assigned!"
				return { success: false, error: errorMessage }
			}
		} else if (error instanceof TypeError) {
			return { success: false, error: "Invalid arguments" }
		} else {
			return { success: false, error: "Unknown error has occured!" }
		}
	}
}
