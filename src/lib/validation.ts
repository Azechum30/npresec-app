import z, { ZodDate, ZodString } from "zod"

export const SignUpSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username must be at least 3 characters long!")
			.regex(
				/^[a-zA-Z0-9_-]+$/,
				"Only letters, underscores, and hypens are allowed!"
			),
		email: z.string().email("Email is required!"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long!"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long!")
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match!",
		path: ["confirmPassword"]
	})

export type SignUpType = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
	email: z.string().email("Email is required!"),
	password: z.string().min(8, "Password must be at least 8 characters long!")
})

export type SignInType = z.infer<typeof SignInSchema>

export const DepartmentSchema = z.object({
	name: z
		.string({ required_error: "department name is required!" })
		.regex(/^[a-zA-Z\s]+$/, "Only letters, and white spaces are allowed!")
		.max(20, "department name must have a maximum character length of 20!"),
	code: z
		.string()
		.min(2, "department code must be at least 2 characters long")
		.max(5, "department code must be at most 5 character long!")
		.regex(/^[A-Z]+$/, "Only uppercase characters are allowed!"),
	createdAt: z.date().optional(),
	description: z.string().optional().nullable(),
	headId: z.string().optional().nullable()
})

export type DepartmentType = z.infer<typeof DepartmentSchema>

export const DeleteDepartmentsSchema = z.object({
	ids: z.array(z.string())
})

export type DeleteDepartmentsType = z.infer<typeof DeleteDepartmentsSchema>

export const BulkUploadDepartmentSchema = z.object({
	data: z.array(DepartmentSchema)
})

export type BulkUploadDepartmentType = z.infer<
	typeof BulkUploadDepartmentSchema
>

/* --------------------------- Teacher Schema and Types ------------------------ */
const requiredString = z
	.string({ required_error: "This field is required!" })
	.regex(/^[a-zA-Z]+$/, "This field can only accept alpahbets!")
const optionalString = z.string().nullable().optional()
const requiredDate = z.date({ required_error: "This must be a valid date" })
const optionalDate = z.date().optional().nullable()
const requiredEmail = z
	.string({ required_error: "This field is required!" })
	.email("You must enter a valid email address")
const requiredUserName = z
	.string({ required_error: "This field is required!" })
	.regex(
		/^[a-zA-Z0-9]+$/,
		"Username field accepts only letters! Spaces are not allowed!"
	)
const requiredPhoneNumber = z
	.string()
	.regex(/^[0-9]+$/, "Must be a valid number")
const registerNumberType = z
	.string()
	.regex(/^[0-9\/]+$/, "Can only accept numbers and a forward slash")
	.optional()
	.nullable()
const ghanaCardType = z
	.string()
	.regex(/^[GHA-\d{9}-\d$]/, "Invalid Ghana card number")
	.optional()
	.nullable()

export const TeacherSchema = z.object({
	firstName: requiredString,
	lastName: requiredString,
	middleName: optionalString,
	employeeId: requiredPhoneNumber,
	departmentId: optionalString,
	birthDate: requiredDate,
	dateOfFirstAppointment: optionalDate,
	gender: requiredString,
	maritalStatus: requiredString,
	rgNumber: registerNumberType,
	rank: optionalString,
	academicQual: optionalString,
	ssnitNumber: optionalString,
	ghcardNumber: ghanaCardType,
	phone: requiredPhoneNumber,
	email: optionalString,
	username: optionalString,
	licencedNumber: optionalString
})

export type TeacherType = z.infer<typeof TeacherSchema>

export const TeacherEditSchema = TeacherSchema.omit({
	username: true,
	email: true
})

export type TeacherEditType = z.infer<typeof TeacherEditSchema>

type DateType = typeof ZodDate | typeof ZodString

const BulkTeachersSchema = TeacherSchema.omit({
	birthDate: true,
	dateOfFirstAppointment: true
}).extend({
	birthDate: z.string(),
	dateOfFirstAppointment: z.string().optional()
})

export const BulkCreateTeachersSchema = z.object({
	data: z.array(BulkTeachersSchema)
})

export type BulkCreateTeachersType = z.infer<typeof BulkCreateTeachersSchema>

/**
 * Schema and Typescript type Definition for Classes
 */

export const grades = ["Year_One", "Year_Two", "Year_Three"] as const

export type gradesType = (typeof grades)[number]

export const ClassesSchema = z.object({
	name: z
		.string({ required_error: "name is required!" })
		.regex(
			/^[a-zA-Z0-9\s]/,
			"name can only contain letters, numbers and whitespaces"
		),
	code: z
		.string()
		.min(2, "code must be at least 2 characters long")
		.max(10, "code must be at most 5 characters long")
		.regex(
			/^[A-Z0-9\s]+$/,
			"Only uppercase characters, numbers and whitespaces are allowed!"
		),
	level: z.enum(grades),
	createdAt: z.date().nullish(),
	departmentId: z.string().nullish(),
	teachers: z
		.array(z.string())
		.min(1, "At least one teacher is required!")
		.max(8, "`teachers` can only have a maximum of 8 teachers!")
})

export type ClassesType = z.infer<typeof ClassesSchema>

export const BulkClassesSchema = z.object({
	data: z.array(ClassesSchema)
})

export type BulkClassesType = z.infer<typeof BulkClassesSchema>

export const ResetPasswordSchema = z
	.object({
		password: z
			.string({ message: "new password is required!" })
			.min(8, { message: "password must be at least 8 characters long!" })
			.regex(
				/^[a-zA-Z0-9]+s/,
				"password must contain lowercase and uppercase characters, including digits!"
			),
		confirmPassword: z.string({ message: "confirm password is required!" }),
		token: z.string({ message: "reset token is required!" })
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match"
	})

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>
