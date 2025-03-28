"use server"
import "server-only"
import { getSession } from "@/lib/get-user"
import { prisma } from "@/lib/prisma"
import { TeacherSelect } from "@/lib/types"
import { TeacherSchema, TeacherType } from "@/lib/validation"
import { Prisma } from "@prisma/client"
import argon2 from "argon2"

import { revalidatePath } from "next/cache"
import { sendMail } from "@/lib/resend-config"

export const createTeacher = async (data: TeacherType) => {
	try {
		const { user } = await getSession()
		if (!user) throw new Error("Unauthorized!")

		const validData = TeacherSchema.parse(data)

		const normalizedTeacher = {
			...validData,
			rgNumber:
				validData.rgNumber?.trim() === ""
					? null
					: validData.rgNumber?.trim(),
			ghcardNumber:
				validData.ghcardNumber?.trim() === ""
					? null
					: validData.ghcardNumber?.trim(),
			licencedNumber:
				validData.licencedNumber?.trim() === ""
					? null
					: validData.licencedNumber?.trim(),
			ssnitNumber:
				validData.ssnitNumber?.trim() === ""
					? null
					: validData.ssnitNumber?.trim()
		}

		const { email, username, ...rest } = normalizedTeacher

		const hashedPassword = await argon2.hash("defaultPassword", {
			type: argon2.argon2id
		})

		const teacher = await prisma.$transaction(async (prisma) => {
			const errors: string[] = []

			const checks = await Promise.all([
				{
					emailCheck: email
						? prisma.user.findFirst({
								where: {
									email: email
								}
						  })
						: null,
					usernameCheck: username
						? prisma.user.findFirst({
								where: {
									username: username
								}
						  })
						: null,
					rgNumberCheck: normalizedTeacher.rgNumber
						? prisma.teacher.findFirst({
								where: {
									rgNumber: normalizedTeacher.rgNumber
								}
						  })
						: null,
					ghcardNumberCheck: normalizedTeacher.ghcardNumber
						? prisma.teacher.findFirst({
								where: {
									ghcardNumber: normalizedTeacher.ghcardNumber
								}
						  })
						: null,
					licencedNumberCheck: normalizedTeacher.licencedNumber
						? prisma.teacher.findFirst({
								where: {
									licencedNumber:
										normalizedTeacher.licencedNumber
								}
						  })
						: null,

					ssnitNumberCheck: normalizedTeacher.ssnitNumber
						? prisma.teacher.findFirst({
								where: {
									ssnitNumber: normalizedTeacher.ssnitNumber
								}
						  })
						: null,
					employeeIdCheck: normalizedTeacher.employeeId
						? prisma.teacher.findFirst({
								where: {
									employeeId: normalizedTeacher.employeeId
								}
						  })
						: null
				}
			])

			const results = await Promise.all(
				checks.map((check) =>
					Promise.all([
						check.emailCheck,
						check.usernameCheck,
						check.rgNumberCheck,
						check.employeeIdCheck,
						check.ghcardNumberCheck,
						check.licencedNumberCheck,
						check.ssnitNumberCheck
					])
				)
			)

			results.forEach((result) => {
				const [
					emailCheck,
					usernameCheck,
					rgNumberCheck,
					employeeIdCheck,
					ghcardNumberCheck,
					licencedNumberCheck,
					ssnitNumberCheck
				] = result

				if (emailCheck) {
					errors.push(
						`Email ID ${normalizedTeacher.email} is already taken!`
					)
				}
				if (usernameCheck) {
					errors.push(
						`Username ${normalizedTeacher.username} is already taken!`
					)
				}
				if (employeeIdCheck) {
					errors.push(
						`Staff ID ${normalizedTeacher.employeeId} is already taken!`
					)
				}
				if (rgNumberCheck) {
					errors.push(
						`Registered number ${normalizedTeacher.rgNumber} is already taken!`
					)
				}
				if (ghcardNumberCheck) {
					errors.push(
						`Ghana card number ${normalizedTeacher.ghcardNumber} is already taken!`
					)
				}
				if (ssnitNumberCheck) {
					errors.push(
						`SSNIT number ${normalizedTeacher.ssnitNumber} is already taken!`
					)
				}
				if (licencedNumberCheck) {
					errors.push(
						`Licence number ${normalizedTeacher.licencedNumber} is already taken!`
					)
				}
			})

			if (errors.length > 0) return { errors }

			const createdUser = await prisma.user.create({
				data: {
					username: username as string,
					email: email as string,
					password: hashedPassword,
					role: "teacher"
				}
			})

			const teacher = await prisma.teacher.create({
				data: {
					...rest,
					userId: createdUser.id
				},
				select: TeacherSelect
			})

			await sendMail({
				to: ["azechum21@gmail.com"],
				username: teacher.firstName,
				data: {
					lastName: teacher.lastName,
					email: email as string,
					password: "defaultPassword"
				}
			})

			return { teacher }
		})

		return { teacher }
	} catch (error) {
		return { error: `${error}` }
	} finally {
		revalidatePath("/teachers")
	}
}

export const getTeachers = async () => {
	try {
		const { user } = await getSession()

		if (!user) throw new Error("Unauthorized!")

		const teachers = await prisma.teacher.findMany({
			select: TeacherSelect,
			orderBy: {
				firstName: "asc"
			}
		})

		return { teachers }
	} catch (error) {
		return { error: "Something went wrong!" }
	}
}

export const getTeacher = async (id: string) => {
	try {
		const { user } = await getSession()
		if (!user) throw new Error("Unauthorized")

		const teacher = await prisma.teacher.findUnique({
			where: { id },
			select: TeacherSelect
		})

		if (!teacher) {
			return { error: `No Teacher found with this ${id}` }
		}

		return teacher
	} catch (error) {
		return { error: "Something went wrong!" }
	}
}

export const updateTeacher = async (id: string, data: TeacherType) => {
	try {
		const { user } = await getSession()
		if (!user) throw new Error("Unauthorized!")

		const { email, username, ...rest } = TeacherSchema.parse(data)

		const normalizedTeacher = {
			...rest,
			ghcardNumber: rest.ghcardNumber?.trim() || null,
			licencedNumber: rest.licencedNumber?.trim() || null,
			rgNumber: rest.rgNumber?.trim() || null,
			ssnitNumber: rest.ssnitNumber?.trim() || null
		}

		const updatedRecord = await prisma.teacher.update({
			where: {
				id
			},
			data: { ...normalizedTeacher },
			select: TeacherSelect
		})

		return { data: updatedRecord }
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2003") {
				return { error: "Foreign key validation failed!" }
			} else if (error.code === "P2002") {
				const targetFields = error.meta?.target as string[]
				const errorMessage = targetFields.includes("employeeId")
					? "Staff ID already exists"
					: "An unknown error has occurred!"

				return { error: errorMessage }
			}
		} else if (error instanceof TypeError) {
			return { error: "Invalid arguments passed!" }
		} else {
			return { error: `${error}` }
		}
	}
}

export const deleteTeacherRequest = async (id: string) => {
	try {
		const { user } = await getSession()
		if (!user) throw new Error("Unauthorized!")

		const teacher = await prisma.teacher.delete({
			where: { id },
			select: TeacherSelect
		})

		if (!teacher) return { error: `No teacher with ID ${id} found!` }

		return teacher
	} catch (error) {
		return { error: "Something went wrong!" }
	}
}

export const bulkDeleteTeachers = async (rows: string[]) => {
	try {
		const { user } = await getSession()
		if (!user) throw new Error("Unauthorized!")

		const count = await prisma.teacher.deleteMany({
			where: {
				id: { in: rows }
			}
		})

		return count
	} catch (error) {
		return { error: "Something went wrong" }
	} finally {
		revalidatePath("/teachers")
	}
}
