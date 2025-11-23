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
  .transform((val) => (val === "" ? undefined : val)) // Convert to undefined
  .nullish()
  .refine((val) => val === undefined || val === null || val.includes("@"), {
    message: "Invalid email address",
  });
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
  .transform((val) => (val === "" ? undefined : val))
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
  imageFile: z.instanceof(File).optional(),
});

export type TeacherType = z.infer<typeof TeacherSchema>;

export const TeacherEditSchema = TeacherSchema.omit({
  username: true,
  email: true,
  imageFile: true,
});

export type TeacherEditType = z.infer<typeof TeacherEditSchema>;

export const BulkCreateTeachersSchema = z.object({
  data: z.array(
    TeacherSchema.omit({ imageFile: true, isDepartmentHead: true })
  ),
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

export const attendanceStatus = [
  "Present",
  "Absent",
  "Late",
  "Excused",
] as const;
const corcedDate = z.coerce.date({
  errorMap: (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_date) {
      return { message: "Invalid date format provided" };
    }
    return { message: ctx.defaultError };
  },
});
export const AttendanceSchema = z.object({
  studentId: z.string().min(1, "Student ID cannot be empty"),
  status: z.enum(attendanceStatus),
});

export type AttendanceType = z.infer<typeof AttendanceSchema>;

export const BulkAttendanceSchema = z.object({
  classId: z.string().min(1, "Class ID cannot be empty"),
  date: corcedDate,
  semester: z.string().min(1, "Semester cannot be empty"),
  studentEntries: z
    .array(AttendanceSchema)
    .nonempty("At least one student must be marked present"),
});

export type BulkAttendanceType = z.infer<typeof BulkAttendanceSchema>;

export const SingleStudentAttendanceSchema = z.object({
  semester: z.string().min(1, "Semester cannot be empty"),
  date: corcedDate,
  classId: z.string().min(1, "Class ID cannot be empty"),
  ...AttendanceSchema.shape,
});

export const EditSingleStudentAttendanceSchema = z.object({
  id: z.string().min(1, "Id must must have a minimum character of 1"),
  data: SingleStudentAttendanceSchema,
});

export type EditSingleStudentAttendanceType = z.infer<
  typeof EditSingleStudentAttendanceSchema
>;

export type SingleStudentAttendance = z.infer<
  typeof SingleStudentAttendanceSchema
>;

export const RoleSchema = z.object({
  name: z.string().min(1, "Role name cannot be empty"),
  permissions: z
    .array(z.string())
    .default([])
    .refine((val) => val.length > 0, {
      message: "At least one permission is required!",
    }),
});

export type RoleType = z.infer<typeof RoleSchema>;

export const UpdateRoleSchema = z.object({
  id: z.string().min(1, "Role ID is required"),
  data: z.object({ ...RoleSchema.shape }),
});

export type UpdateRoleType = z.infer<typeof UpdateRoleSchema>;

export const PermissionSchema = z.object({
  permissions: z
    .array(
      z.object({
        name: z.string().min(1, "Permission name cannot be empty"),
        description: z.string().optional(),
      })
    )
    .min(1, "At least one permission is required!"),
});

export type PermissionType = z.infer<typeof PermissionSchema>;

export const BoardOfGovernorsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ChairPerson", "ViceChairPerson", "Member", "Secretary"], {
    errorMap: () => ({
      message: "Role must be Chairperson, Member, or Secretary",
    }),
  }),
  affiliation: z.string().nullish(),
  bio: z.string().nullish(),
  photo_url: z.union([z.string().url(), z.instanceof(File)]).nullish(),
  is_active: z.boolean().default(false),
});

export type BoardOfGovernorsType = z.infer<typeof BoardOfGovernorsSchema>;

export const AssesessmentSchema = [
  "Assignment",
  "Midterm",
  "Project",
  "Examination",
] as const;
export type AssesessmentType = (typeof AssesessmentSchema)[number];

export const Semester = ["First", "Second"] as const;

const studentScores = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  score: z.coerce
    .number()
    .min(0, "Score must be greater than 0")
    .max(100, "Score must be less than 100"),
});

export const GradeSchema = z
  .object({
    classId: z.string().min(1, "Class ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    assessmentType: z.enum(AssesessmentSchema),
    scores: z
      .array(studentScores)
      .nonempty("At least one student score is required"),
    maxScore: z.coerce
      .number()
      .min(0, "Max score must be greater than 0")
      .max(100, "Max score must be less than 100"),
    weight: z.coerce
      .number()
      .min(0, "Weight must be greater than 0")
      .max(1, "Weight must be less than 1"),
    semester: z.enum(Semester),
    academicYear: z.coerce
      .number()
      .min(2000, "Academic year must be greater than 2000"),
    remarks: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    data.scores.forEach((scoreOj, index) => {
      if (scoreOj.score > data.maxScore) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Score must be less than or equal to max score",
          path: ["scores", index, "score"],
        });
      }
    });
  });

export type GradeType = z.infer<typeof GradeSchema>;

export const SingleStudentScoreSchema = z
  .object({
    classId: z.string().min(1, "Class ID is required"),
    courseId: z.string().min(1, "Course ID is required"),
    assessmentType: z.enum(AssesessmentSchema),
    score: z.coerce
      .number()
      .min(0, "Score must be greater than 0")
      .max(100, "Score must be less than 100"),
    studentId: z.string().min(1, "Student ID is required"),
    studentName: z.string().min(1, "Student name is required"),
    maxScore: z.coerce
      .number()
      .min(0, "Max score must be greater than 0")
      .max(100, "Max score must be less than 100"),
    weight: z.coerce
      .number()
      .min(0, "Weight must be greater than 0")
      .max(1, "Weight must be less than 1"),
    semester: z.enum(Semester),
    academicYear: z.coerce
      .number()
      .min(2000, "Academic year must be greater than 2000"),
    remarks: z.string().optional(),
  })
  .refine((data) => data.score <= data.maxScore, {
    path: ["score"],
    message: "Score must be less than or equal to max score",
  });

export type SingleStudentScoreType = z.infer<typeof SingleStudentScoreSchema>;

export const EditGradeSchema = z.object({
  id: z.string().min(1, "ID is required"),
  dataValues: SingleStudentScoreSchema,
});

export type EditGradeType = z.infer<typeof EditGradeSchema>;

export const GenerateTranscriptSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  academicYear: z.coerce
    .number()
    .min(2000, "Academic year must be greater than 2000")
    .max(2100, "Academic year must be less than 2100"),
  semester: z.enum(Semester).optional(),
  isOfficial: z.boolean().optional().default(false),
});

export type GenerateTranscriptType = z.infer<typeof GenerateTranscriptSchema>;

export const UserPermissionsFormSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    username: z.string().min(1, "Username is required"),
    permissions: z
      .array(z.string())
      .min(1, "At least one permission is required"),
  })
  .refine((data) => data.permissions.length > 0, {
    path: ["permissions"],
    message: "At least one permission must be selected",
  });

export type UserPermissionsFormType = z.infer<typeof UserPermissionsFormSchema>;

export const UpdateUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  roleId: z.string().min(1, "Role ID is required"),
});

export type UserRoleUpdateType = z.infer<typeof UpdateUserRoleSchema>;

export const UserSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .regex(
        /^[a-zA-Z0-9]+$/,
        "username can only be alphanumeric characters. Spaces are are not allowed"
      )
      .min(1),
    email: z
      .string({ required_error: "Email must be a string" })
      .min(1, "Email is required")
      .email(),
    role: z.string().min(1, "Role is required"),
    password: z
      .string()
      .min(6, "password must contain at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|':;,.<>?/~`])(?=.{6,}).*$/,
        "password must contain at least one uppercase character, one lowercase character, one digit and one special character"
      ),

    confirmPassword: z
      .string()
      .min(6, "password must contain at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|':;,.<>?/~`])(?=.{6,}).*$/,
        "password must contain at least one uppercase character, one lowercase character, one digit and one special character"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UserType = z.infer<typeof UserSchema>;

export const BioSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  fullName: z.string().min(1),
  role: z.string().min(1),
  picture: z.union([z.string(), z.instanceof(File)]).optional(),
  subscribeToNewsletter: z.boolean().optional(),
  bio: z
    .string()
    .max(160, "Bio must be at most 160 characters long")
    .optional(),
  social: z.object({
    x: z
      .union([z.string().url(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    linkedIn: z
      .union([z.string().url(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    github: z
      .union([z.string().url(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    facebook: z
      .union([z.string().url(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    instagram: z
      .union([z.string().url(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
  }),
});

export type BioType = z.infer<typeof BioSchema>;

// Settings Schema and Types
export const themeOptions = ["light", "dark", "system"] as const;
export type ThemeType = (typeof themeOptions)[number];

export const itemsPerPageOptions = [10, 25, 50, 100] as const;
export type ItemsPerPageType = (typeof itemsPerPageOptions)[number];

export const dateFormatOptions = [
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD",
  "DD MMM YYYY",
] as const;
export type DateFormatType = (typeof dateFormatOptions)[number];

export const notificationFrequencyOptions = [
  "realtime",
  "daily",
  "weekly",
  "never",
] as const;
export type NotificationFrequencyType =
  (typeof notificationFrequencyOptions)[number];

// Timezone options with IANA timezone IDs and display labels
export const timezoneOptions = [
  // Africa (West Africa - Ghana region)
  { value: "Africa/Accra", label: "Accra, Ghana (GMT)" },
  { value: "Africa/Lagos", label: "Lagos, Nigeria (WAT)" },
  { value: "Africa/Abidjan", label: "Abidjan, Côte d'Ivoire (GMT)" },
  { value: "Africa/Dakar", label: "Dakar, Senegal (GMT)" },

  // Africa (East Africa)
  { value: "Africa/Nairobi", label: "Nairobi, Kenya (EAT)" },
  { value: "Africa/Addis_Ababa", label: "Addis Ababa, Ethiopia (EAT)" },
  { value: "Africa/Dar_es_Salaam", label: "Dar es Salaam, Tanzania (EAT)" },

  // Africa (South Africa)
  { value: "Africa/Johannesburg", label: "Johannesburg, South Africa (SAST)" },
  { value: "Africa/Cairo", label: "Cairo, Egypt (EET)" },

  // Europe
  { value: "Europe/London", label: "London, UK (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris, France (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin, Germany (CET/CEST)" },
  { value: "Europe/Madrid", label: "Madrid, Spain (CET/CEST)" },
  { value: "Europe/Rome", label: "Rome, Italy (CET/CEST)" },
  { value: "Europe/Amsterdam", label: "Amsterdam, Netherlands (CET/CEST)" },

  // Americas
  { value: "America/New_York", label: "New York, USA (EST/EDT)" },
  { value: "America/Chicago", label: "Chicago, USA (CST/CDT)" },
  { value: "America/Denver", label: "Denver, USA (MST/MDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles, USA (PST/PDT)" },
  { value: "America/Toronto", label: "Toronto, Canada (EST/EDT)" },
  { value: "America/Sao_Paulo", label: "São Paulo, Brazil (BRT)" },
  { value: "America/Mexico_City", label: "Mexico City, Mexico (CST)" },

  // Asia
  { value: "Asia/Dubai", label: "Dubai, UAE (GST)" },
  { value: "Asia/Kolkata", label: "Mumbai, India (IST)" },
  { value: "Asia/Shanghai", label: "Shanghai, China (CST)" },
  { value: "Asia/Tokyo", label: "Tokyo, Japan (JST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
  { value: "Asia/Bangkok", label: "Bangkok, Thailand (ICT)" },

  // Oceania
  { value: "Australia/Sydney", label: "Sydney, Australia (AEDT/AEST)" },
  { value: "Australia/Melbourne", label: "Melbourne, Australia (AEDT/AEST)" },
  { value: "Pacific/Auckland", label: "Auckland, New Zealand (NZDT/NZST)" },
] as const;

export type TimezoneOption = (typeof timezoneOptions)[number];
export type TimezoneValue = TimezoneOption["value"];

export const SettingsSchema = z.object({
  subscribeToNewsletter: z.boolean().optional().default(false),

  // Display Preferences
  theme: z.enum(themeOptions).optional().default("system"),
  itemsPerPage: z
    .union([z.literal(10), z.literal(25), z.literal(50), z.literal(100)])
    .optional()
    .default(10),
  dateFormat: z.enum(dateFormatOptions).optional().default("DD/MM/YYYY"),
  timezone: z
    .enum(
      timezoneOptions.map((tz) => tz.value) as [
        TimezoneValue,
        ...TimezoneValue[],
      ]
    )
    .optional()
    .default("Africa/Accra"),

  // Notification Preferences
  emailNotifications: z
    .object({
      grades: z.boolean().optional().default(true),
      attendance: z.boolean().optional().default(true),
      assignments: z.boolean().optional().default(true),
      announcements: z.boolean().optional().default(true),
      systemUpdates: z.boolean().optional().default(true),
    })
    .default({
      grades: true,
      attendance: true,
      assignments: true,
      announcements: true,
      systemUpdates: true,
    }),
  notificationFrequency: z
    .enum(notificationFrequencyOptions)
    .optional()
    .default("realtime"),

  // Application Preferences
  compactMode: z.boolean().optional().default(false),
  showTips: z.boolean().optional().default(true),
});

export type SettingsType = z.infer<typeof SettingsSchema>;

export const HouseSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["DAY", "BOARDING", "MIXED"]),
  houseGender: z.enum(["MALE", "FEMALE", "BOTH"]),
  roomCount: z.number().min(1),
  roomCapacity: z.number().min(10),
});

export type HouseType = z.infer<typeof HouseSchema>;
