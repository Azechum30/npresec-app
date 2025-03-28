"use server"
import "server-only"
import { getSession } from "@/lib/get-user"
import { prisma } from "@/lib/prisma"
import {
	BulkUploadDepartmentSchema,
	BulkUploadDepartmentType
} from "@/lib/validation"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const bulkUploadDepartments = async (
	values: BulkUploadDepartmentType
) => {
	try {
		const { user } = await getSession()
		if (!user) throw new Error("Unauthorized!")

		const { data } = BulkUploadDepartmentSchema.parse(values)

		const normalizedDepartments = data.map((department) => ({
			...department,
			code: department.code.trim(),
			name: department.name.trim(),
			headId: department?.headId?.trim() || null,
			description: department?.description?.trim() || null
		}))

		const checks = normalizedDepartments.map((department) => ({
			codeCheck: prisma.department.findFirst({
				where: {
					code: department.code
				}
			}),
			nameCheck: prisma.department.findFirst({
				where: {
					name: department.name
				}
			}),
			headCheck: department.headId
				? prisma.teacher.findFirst({
						where: {
							id: department.headId
						}
				  })
				: null
		}))

		const results = await Promise.all(
			checks.map((check) =>
				Promise.all([check.codeCheck, check.nameCheck, check.headCheck])
			)
		)

		const errors: string[] = []

		results.forEach((result, index) => {
			const [codeCheck, nameCheck, headCheck] = result
			if (codeCheck) {
				errors.push(
					`Department Code '${normalizedDepartments[index].code}' already exists!`
				)
			}

			if (nameCheck) {
				errors.push(
					`Department Name '${normalizedDepartments[index].name}' already exists!`
				)
			}

			if (headCheck) {
				errors.push(
					`Teacher with ID '${normalizedDepartments[index].headId}' has already been assigned!`
				)
			}
		})

		if (errors.length > 0) return { errors }

		const createDepartmentPromises = normalizedDepartments.map(
			(department) =>
				prisma.department.create({
					data: {
						code: department.code,
						name: department.name,
						description: department.description,
						headId: department.headId
					}
				})
		)

		const createdDepartments = await Promise.all(createDepartmentPromises)

		return { count: createdDepartments.length }
	} catch (error: any) {
		return {
			error: "message" in error ? error.message : "Something went wrong!"
		}
	} finally {
		revalidatePath("/departments")
	}
}
