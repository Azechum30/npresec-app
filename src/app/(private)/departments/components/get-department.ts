"use server"

import { getSession } from "@/lib/get-user"
import { prisma } from "@/lib/prisma"
import { DepartmentSelect } from "@/lib/types"

export const getDepartment = async (id: string) => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("Unauthorized!")
		const department = await prisma.department.findUnique({
			where: {
				id: id
			},
			select: DepartmentSelect
		})

		if (!department)
			return { success: false, error: "No department found!" }

		return { success: true, department }
	} catch (error) {
		return { success: false, error: "Something went wrong!" }
	}
}
