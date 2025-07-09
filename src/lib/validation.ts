import { optional, z } from "zod";

const optionalField = <T extends z.ZodTypeAny>(schema: T) =>
  schema.optional().describe("isOptional:true");

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
    password: z.string().min(8, "Password must be at least 8 characters long!"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

export type SignUpType = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email("Email is required!"),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});

export type SignInType = z.infer<typeof SignInSchema>;

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
  headId: z.string().optional().nullable(),
});

export type DepartmentType = z.infer<typeof DepartmentSchema>;

export const DeleteDepartmentsSchema = z.object({
  ids: z.array(z.string()),
});

export type DeleteDepartmentsType = z.infer<typeof DeleteDepartmentsSchema>;

export const BulkUploadDepartmentSchema = z.object({
  data: z.array(
    DepartmentSchema.omit({ createdAt: true }).extend({
      createdAt: z.union([z.string(), z.date()]),
    })
  ),
});

export type BulkUploadDepartmentType = z.infer<
  typeof BulkUploadDepartmentSchema
>;

/* --------------------------- Teacher Schema and Types ------------------------ */
const requiredString = z
  .string({ required_error: "This field is required!" })
  .regex(/^[a-zA-Z\s]+$/, "This field can only accept alpahbets!");
const optionalString = optionalField(z.string().nullish());
const requiredDate = z.union([z.date(), z.string()]);
const optionalDate = optionalField(z.union([z.date(), z.string()]).nullish());
const requiredEmail = z
  .string({ required_error: "This field is required!" })
  .email("You must enter a valid email address");
const optionalEmail = z
    .string()
    .min(0) // Allow empty string
    .email("Invalid email address")
    .or(z.literal("")) // Explicitly allow empty string
    .transform(val => val === "" ? undefined : val) // Convert to undefined
    .nullish()
    .refine(
        val => val === undefined || val === null || val.includes("@"),
        {
          message: "Invalid email address",
        }
    );
const requiredUserName = z
  .string({ required_error: "This field is required!" })
  .regex(
    /^[a-zA-Z0-9]+$/,
    "Username field accepts only letters! Spaces are not allowed!"
  );
const requiredPhoneNumber = z
  .string({ required_error: "phone number is required!" })
  .regex(/^[0-9]+$/, "Must be a valid number");
const registerNumberType = z
    .string()
    .regex(/^[0-9\/]*$/, "Can only accept numbers and a forward slash")
    .transform(val => val === "" ? undefined : val)
    .nullish();
const ghanaCardType = z
  .string()
  .regex(/^GHA-\d{9}-\d$/, "Invalid Ghana card number")
  .optional()
  .nullable();

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
  email: requiredEmail,
  username: requiredUserName,
  licencedNumber: optionalString,
  courses: z.array(z.string()).optional(),
  classes: z.array(z.string()).optional(),
  isDepartmentHead: z.boolean().optional(),
  imageURL: optionalString,
  imageFile: optionalField(z.instanceof(File).nullish()),
});

export type TeacherType = z.infer<typeof TeacherSchema>;

export const TeacherEditSchema = TeacherSchema.omit({
  username: true,
  email: true,
});

export type TeacherEditType = z.infer<typeof TeacherEditSchema>;

export const BulkCreateTeachersSchema = z.object({
  data: z.array(TeacherSchema),
});

export type BulkCreateTeachersType = z.infer<typeof BulkCreateTeachersSchema>;

/**
 * Schema and TypeScript type Definition for Classes
 */

export const grades = ["Year_One", "Year_Two", "Year_Three"] as const;

export type gradesType = (typeof grades)[number];

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
  teachers: z.array(z.string()).optional(),
});

export type ClassesType = z.infer<typeof ClassesSchema>;

export const UpdateClassSchema = ClassesSchema.extend({
  id: z.string(),
});

export type UpdateClassType = z.infer<typeof UpdateClassSchema>;

export const BulkClassesSchema = z.object({
  data: z.array(
    ClassesSchema.omit({ createdAt: true }).extend({
      department: z.string(),
      teacherId: z.string(),
      createdAt: z.union([z.string(), z.date()]),
    })
  ),
});

export type BulkClassesType = z.infer<typeof BulkClassesSchema>;

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
    token: z.string({ message: "reset token is required!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export const GenericDleteSchema = z.object({
  id: z.string(),
});
export type GenericDeleteType = z.infer<typeof GenericDleteSchema>;

export const BulkDeleteClassesSchema = z.object({
  ids: z.array(z.string()),
});

export type BulkDeleteClassesType = z.infer<typeof BulkDeleteClassesSchema>;

//............................... Courses Schema and Types ...............................//

export const CoursesSchema = z.object({
  code: z
    .string()
    .min(2, "Course code must have a minimum character length of 2!")
    .max(10, "Course Code must be 10 characters long!"),
  title: z
    .string()
    .min(5, "Course title must be at least 5 characters long!")
    .max(50, "Course name must be at most 50 characters long!"),
  description: z.string().nullish(),
  credits: z.coerce.number().int().nullish(),
  departments: z.array(z.string()).optional(),
  teachers: z.array(z.string()).optional(),
  classes: z.array(z.string()).optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
});

export type CoursesType = z.infer<typeof CoursesSchema>;

export const CourseUpdateSchema = z.object({
  id: z.string({ message: "A valid ID is required!" }),
  data: CoursesSchema,
});

export type CourseUpdateType = z.infer<typeof CourseUpdateSchema>;

export const BulkUploadCoursesSchema = z.object({
  data: z.array(CoursesSchema),
});

export type BulkUploadCourses = z.infer<typeof BulkUploadCoursesSchema>;

//-------------------------- Student Sessions --------------------------

export const status = [
  "Active",
  "Inactive",
  "Withdrawn",
  "Suspended",
  "Graduated",
] as const;

export const PersonalInfoSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  middleName: optionalString,
  birthDate: requiredDate,
  gender: requiredString,
  email: requiredEmail,
  phone: optionalString,
  address: optionalString,
  nationality: optionalString,
  religion: optionalString,
  photoURL: optionalString,
  imageFile: optionalField(z.instanceof(File).nullish()),
});

export const AcademicInfoSchema = z.object({
  classId: optionalString,
  dateEnrolled: requiredDate,
  graduationDate: optionalDate,
  currentLevel: z
    .string()
    .regex(
      /^[a-zA-Z\_]+$/,
      "current level only accepts alphabets and underscore"
    ),
  status: z.enum(status),
  departmentId: optionalString,
  previousSchool: optionalString,
});

export const GuardianInfoSchema = z.object({
  guardianName: requiredString,
  guardianPhone: requiredPhoneNumber,
  guardianEmail: optionalEmail,
  guardianAddress: optionalString,
  guardianRelation: requiredString,
});

export const StudentSchema = z.object({
  ...PersonalInfoSchema.shape,
  ...AcademicInfoSchema.shape,
  ...GuardianInfoSchema.shape,
});

export const EditStudentSchema = z.object({
  id: z.string(),
  data: StudentSchema,
});

export const BulkCreateStudentsSchema = z.object({
  data: z.array(StudentSchema),
});

export type PersonalInfoType = z.infer<typeof PersonalInfoSchema>;
export type AcademicInfoType = z.infer<typeof AcademicInfoSchema>;
export type GuardianInfoType = z.infer<typeof GuardianInfoSchema>;

export type StudentType = z.infer<typeof StudentSchema>;
export type EditStudentType = z.infer<typeof EditStudentSchema>;
export type BulkCreateStudentsType = z.infer<typeof BulkCreateStudentsSchema>;

// Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email is required!"),
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;


// Attendance Schema

export const attendanceStatus = ["Present", "Absent", "Late", "Excused"] as const ;
const corcedDate = z.coerce.date({
  errorMap: (issue, ctx)=>{
    if(issue.code === z.ZodIssueCode.invalid_date){
      return {message: "Invalid date format provided"}
    }
    return {message: ctx.defaultError}
  }
})
export const AttendanceSchema = z.object({
  studentId: z.string().min(1, "Student ID cannot be empty"),
  status: z.enum(attendanceStatus),
});

export type AttendanceType = z.infer<typeof AttendanceSchema>;


export const BulkAttendanceSchema = z.object({
  classId: z.string().min(1, "Class ID cannot be empty"),
  date: corcedDate,
  semester: z.string().min(1, "Semester cannot be empty"),
  studentEntries: z.array(AttendanceSchema).nonempty("At least one student must be marked present")
})

export type BulkAttendanceType = z.infer<typeof BulkAttendanceSchema>;

export const SingleStudentAttendanceSchema = z.object({
  semester: z.string().min(1, "Semester cannot be empty"),
  date: corcedDate,
  classId: z.string().min(1, "Class ID cannot be empty"),
  ...AttendanceSchema.shape
})

export const EditSingleStudentAttendanceSchema = z.object({
  id: z.string().min(1, "Id must must have a minimum character of 1"),
  data: SingleStudentAttendanceSchema
})

export type EditSingleStudentAttendanceType = z.infer<typeof EditSingleStudentAttendanceSchema>

export type SingleStudentAttendance = z.infer<typeof SingleStudentAttendanceSchema>;


export const RoleSchema = z.object({
  name: z.string().min(1, "Role name cannot be empty"),
  permissions: z.array(z.string()).default([]).refine(val => val.length > 0, {
    message: "At least one permission is required!"
  })
});

export type RoleType = z.infer<typeof RoleSchema>;

export const UpdateRoleSchema = z.object({
  id: z.string().min(1, "Role ID is required"),
  data: z.object({...RoleSchema.shape})
});

export type UpdateRoleType = z.infer<typeof UpdateRoleSchema>;


export const PermissionSchema = z.object({
    permissions: z.array(
        z.object({
            name: z.string().min(1, "Permission name cannot be empty"),
            description: z.string().optional()
        })
    ).min(1, "At least one permission is required!")
})

export type PermissionType = z.infer<typeof PermissionSchema>;