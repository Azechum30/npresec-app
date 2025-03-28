"use server"

import { getSession } from "@/lib/get-user"
import { prisma } from "@/lib/prisma"
import {
	BulkCreateTeachersSchema,
	BulkCreateTeachersType
} from "@/lib/validation"
import { revalidatePath } from "next/cache"
import argon2 from "argon2"

export const bulkCreateTeachers = async (values: BulkCreateTeachersType) => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("Unauthorized!")

		const { data } = BulkCreateTeachersSchema.parse(values)

		const hashedPassword = await argon2.hash("defaultPassword", {
			type: argon2.argon2id
		})

		const normalizedTeachers = data.map((teacher) => ({
			...teacher,
			licencedNumber:
				teacher.licencedNumber?.trim() === ""
					? null
					: teacher.licencedNumber?.trim(),
			rgNumber:
				teacher.rgNumber?.trim() === ""
					? null
					: teacher.rgNumber?.trim(),
			ghcardNumber:
				teacher.ghcardNumber?.trim() === ""
					? null
					: teacher.ghcardNumber?.trim(),
			ssnitNumber:
				teacher.ssnitNumber?.trim() === ""
					? null
					: teacher.ssnitNumber?.trim(),
			employeeId:
				teacher.employeeId?.trim() === ""
					? null
					: teacher.employeeId?.trim()
		}))

		const checks = normalizedTeachers.map((teacher) => ({
			emailChecks: prisma.user.findFirst({
				where: {
					email: teacher.email as string
				}
			}),
			userNameChecks: prisma.user.findFirst({
				where: {
					username: teacher.username as string
				}
			}),
			rgNumberChecks: teacher.rgNumber
				? prisma.teacher.findFirst({
						where: {
							rgNumber: teacher.rgNumber
						}
				  })
				: null,
			licencedNumberChecks: teacher.licencedNumber
				? prisma.teacher.findFirst({
						where: {
							licencedNumber: teacher.licencedNumber
						}
				  })
				: null,
			ssnitNumberChecks: teacher.ssnitNumber
				? prisma.teacher.findFirst({
						where: {
							ssnitNumber: teacher.ssnitNumber
						}
				  })
				: null,
			employeeIdChecks: teacher.employeeId
				? prisma.teacher.findFirst({
						where: {
							employeeId: teacher.employeeId
						}
				  })
				: null,
			ghcardNumberChecks: teacher.ghcardNumber
				? prisma.teacher.findFirst({
						where: {
							ghcardNumber: teacher.ghcardNumber
						}
				  })
				: null
		}))

		const results = await Promise.all(
			checks.map((check) =>
				Promise.all([
					check.emailChecks,
					check.userNameChecks,
					check.employeeIdChecks,
					check.ssnitNumberChecks,
					check.rgNumberChecks,
					check.licencedNumberChecks,
					check.ghcardNumberChecks
				])
			)
		)

		const errors: string[] = []

		results.forEach((result, index) => {
			const [
				emailChecks,
				userNameChecks,
				ssnitNumberChecks,
				licencedNumberChecks,
				ghcardNumberChecks,
				employeeIdChecks,
				rgNumberChecks
			] = result

			if (emailChecks) {
				errors.push(
					`Email ID ${normalizedTeachers[index].email} is already taken!`
				)
			}
			if (userNameChecks) {
				errors.push(
					`Username ${normalizedTeachers[index].username} is already taken!`
				)
			}
			if (ssnitNumberChecks) {
				errors.push(
					`SSNIT Number ${normalizedTeachers[index].ssnitNumber} is already taken!`
				)
			}
			if (ghcardNumberChecks) {
				errors.push(
					`Ghana card Number ${normalizedTeachers[index].ghcardNumber} is already taken!`
				)
			}
			if (rgNumberChecks) {
				errors.push(
					`Registered Number ${normalizedTeachers[index].rgNumber} is already taken!`
				)
			}
			if (employeeIdChecks) {
				errors.push(
					`Staff ID ${normalizedTeachers[index].employeeId} is already taken!`
				)
			}
			if (licencedNumberChecks) {
				errors.push(
					`Licence number ${normalizedTeachers[index].licencedNumber} is already taken!`
				)
			}
		})

		if (errors.length > 0) return { errors }

		const createUserPromises = normalizedTeachers.map((teacher) =>
			prisma.user.create({
				data: {
					email: teacher.email as string,
					username: teacher.username as string,
					password: hashedPassword,
					role: "teacher"
				}
			})
		)

		const teachers = normalizedTeachers.map((teacher) => {
			const { email, username, ...rest } = teacher

			return {
				...rest,
				employeeId: rest.employeeId as string,
				birthDate: new Date(rest.birthDate),
				dateOfFirstAppointment: new Date(rest.dateOfFirstAppointment!)
			}
		})

		const createdUsers = await Promise.all(createUserPromises)

		const createTeachersPromises = createdUsers.map((user, index) =>
			prisma.teacher.create({
				data: {
					...teachers[index],
					userId: user.id,
					departmentId: undefined
				}
			})
		)

		const createdTeachers = await Promise.all(createTeachersPromises)

		return { count: createdTeachers.length }
	} catch (error) {
		return {
			error: `Something went wrong while uploading the teachers data: ${error}`
		}
	} finally {
		revalidatePath("/teachers")
	}
}
