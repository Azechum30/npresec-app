"use server"
import { getSession } from "@/lib/get-user"
import { prisma } from "@/lib/prisma"
import { ClassesSelect } from "@/lib/types"
import {
	BulkClassesType,
	ClassesSchema,
	ClassesType,
	gradesType
} from "@/lib/validation"
import "server-only"

export const createClassAction = async (values: ClassesType) => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("unauthorized!")

		const result = ClassesSchema.safeParse(values)

		let zodErrors = {}

		if (!result.success) {
			result.error.issues.forEach((issue) => {
				zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
			})
		}

		if (Object.keys(zodErrors).length > 0) {
			return { errors: zodErrors }
		}

		const prismaErrors: string[] = []

		const checks = await Promise.all([
			{
				codeCheck: prisma.class.findFirst({
					where: {
						code: result.data?.code.trim()
					}
				}),
				nameCheck: prisma.class.findFirst({
					where: {
						name: result.data?.name.trim()
					}
				})
			}
		])

		const results = await Promise.all(
			checks.map((check) =>
				Promise.all([check.codeCheck, check.nameCheck])
			)
		)

		results.forEach((classResult) => {
			const [codeCheck, nameCheck] = classResult

			if (codeCheck) {
				prismaErrors.push(
					`Class code "${result.data?.code}" is already taken!`
				)
			}

			if (nameCheck) {
				prismaErrors.push(
					`Class Name "${result.data?.name}" is already taken`
				)
			}
		})

		if (prismaErrors.length > 0) return { prismaErrors: prismaErrors }

		const normalizedClass = {
			...result.data,
			code: result.data?.code.trim() as string,
			name: result.data?.name.trim() as string,
			createdAt: result.data?.createdAt as Date | undefined,
			level: result.data?.level.trim() as gradesType
		}

		const response = await prisma.class.create({
			data: {
				code: normalizedClass.code,
				name: normalizedClass.name,
				createdAt: normalizedClass.createdAt,
				departmentId: normalizedClass.departmentId,
				level: normalizedClass.level,
				teachers: {
					create: normalizedClass.teachers?.map((teacherId) => ({
						teacher: { connect: { id: teacherId } }
					}))
				}
			},
			select: ClassesSelect
		})

		return { class: response }
	} catch (error: any) {
		return { error: error.message }
	}
}

export const getClassesAction = async () => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("unauthorized!")

		const data = await prisma.class.findMany({
			select: ClassesSelect
		})

		return { data }
	} catch (error: any) {
		return { error: error.message }
	}
}

export const bulkUploadClasses = async (values: BulkClassesType) => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("Unauthorized!")
	} catch (error) {}
}
