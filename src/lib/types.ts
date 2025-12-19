import { Prisma } from "@/generated/prisma/client";

// Universal nested keys with top-level keys included
export type NestedKeys<T, Prev extends string = ""> = T extends (infer U)[]
  ? NestedKeys<U, `${Prev}[number]`> | NestedKeys<U, `${Prev}.${number}`>
  : T extends object
    ?
        | // Include top-level keys when Prev is empty
        (Prev extends "" ? keyof T & string : never)
        | {
            [K in keyof T & string]:
              | `${Prev}${Prev extends "" ? "" : "."}${K}`
              | NestedKeys<T[K], `${Prev}${Prev extends "" ? "" : "."}${K}`>;
          }[keyof T & string]
    : never;

export const DepartmentInclude = {
  head: {
    select: {
      firstName: true,
      lastName: true,
      middleName: true,
    },
  },
} satisfies Prisma.DepartmentInclude;

export const DepartmentSelect = {
  id: true,
  code: true,
  name: true,
  description: true,
  headId: true,
  createdAt: true,
  head: true,
  classes: true,
  staff: true,
} satisfies Prisma.DepartmentSelect;

export type DepartmentData = Prisma.DepartmentGetPayload<{
  include: typeof DepartmentInclude;
}>;

export type DepartmentResponseType = Prisma.DepartmentGetPayload<{
  select: typeof DepartmentSelect;
}>;

export const StaffSelect = {
  id: true,
  employeeId: true,
  firstName: true,
  lastName: true,
  middleName: true,
  birthDate: true,
  staffType: true,
  staffCategory: true,
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
  department: {
    select: {
      id: true,
      name: true,
    },
  },
  classes: true,
  courses: true,
  departmentHead: true,
  user: {
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
    },
  },
} satisfies Prisma.StaffSelect;

export type StaffResponseType = Prisma.StaffGetPayload<{
  select: typeof StaffSelect;
}>;

export const ClassesSelect = {
  id: true,
  code: true,
  name: true,
  createdAt: true,
  maxCapacity: true,
  currentEnrollment: true,
  staff: {
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      employeeId: true,
    },
  },
  level: true,
  department: {
    select: {
      id: true,
      name: true,
    },
  },
  departmentId: true,
  staffId: true,
  courses: {
    select: {
      id: true,
      title: true,
    },
  },
} satisfies Prisma.ClassSelect;

export type ClassesResponseType = Prisma.ClassGetPayload<{
  select: typeof ClassesSelect;
}>;

export const CourseSelect = {
  id: true,
  code: true,
  title: true,
  description: true,
  createdAt: true,
  credits: true,
  classes: {
    select: {
      id: true,
      name: true,
    },
  },
  staff: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      middleName: true,
    },
  },
  departments: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.CourseSelect;

export type CourseResponseType = Prisma.CourseGetPayload<{
  select: typeof CourseSelect;
}>;

export type UserType = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    permissions: {
      select: {
        id: true;
        name: true;
      };
    };
    image: true;
    role: {
      select: {
        id: true;
        name: true;
      };
    };
    roleId: true;
  };
}>;

export const StudentSelect = {
  id: true,
  studentNumber: true,
  firstName: true,
  lastName: true,
  middleName: true,
  gender: true,
  birthDate: true,
  currentLevel: true,
  nationality: true,
  religion: true,
  dateEnrolled: true,
  currentClass: {
    select: {
      id: true,
      name: true,
    },
  },
  department: {
    select: {
      id: true,
      name: true,
    },
  },
  user: {
    select: {
      email: true,
      id: true,
      username: true,
      image: true,
    },
  },
  guardianName: true,
  guardianRelation: true,
  guardianAddress: true,
  guardianEmail: true,
  address: true,
  classId: true,
  graduationDate: true,
  guardianPhone: true,
  phone: true,
  status: true,
  previousSchool: true,
  departmentId: true,
} satisfies Prisma.StudentSelect;

export type StudentResponseType = Prisma.StudentGetPayload<{
  select: typeof StudentSelect;
}>;

export const AttendanceSelect = {
  id: true,
  status: true,
  classId: true,
  date: true,
  academicYear: true,
  semester: true,
  class: {
    select: {
      id: true,
      name: true,
    },
  },
  student: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      studentNumber: true,
      user: {
        select: {
          id: true,
          username: true,
          role: true,
          image: true,
        },
      },
    },
  },
} satisfies Prisma.AttendanceSelect;

export type AttendanceResponseType = Prisma.AttendanceGetPayload<{
  select: typeof AttendanceSelect;
}>;

export const RolesSelect = {
  id: true,
  name: true,
  createdAt: true,
  permissions: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
} satisfies Prisma.RoleSelect;

export type RolesResponseType = Prisma.RoleGetPayload<{
  select: typeof RolesSelect;
}>;

export const PermissionSelect = {
  id: true,
  name: true,
  createdAt: true,
  description: true,
  roles: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.PermissionSelect;

export type PermissionResponseType = Prisma.PermissionGetPayload<{
  select: typeof PermissionSelect;
}>;

export const BoardMemberSelect = {
  id: true,
  name: true,
  role: true,
  affiliation: true,
  is_active: true,
  picture: true,
  bio: true,
} satisfies Prisma.BoardMemberSelect;

export type BoardMemberResponseType = Prisma.BoardMemberGetPayload<{
  select: typeof BoardMemberSelect;
}>;

export const GradeSelect = {
  id: true,
  courseId: true,
  studentId: true,
  staffId: true,
  assessmentType: true,
  score: true,
  maxScore: true,
  weight: true,
  semester: true,
  academicYear: true,
  createdAt: true,
  student: {
    select: {
      id: true,
      studentNumber: true,
      firstName: true,
      lastName: true,
      gender: true,
      user: {
        select: {
          id: true,
          image: true,
        },
      },
      currentClass: {
        select: {
          id: true,
          name: true,
          level: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
  course: {
    select: {
      id: true,
      title: true,
    },
  },
  staff: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      gender: true,
    },
  },
} satisfies Prisma.GradeSelect;

export type GradeResponseType = Prisma.GradeGetPayload<{
  select: typeof GradeSelect;
}>;

export const UserSelect = {
  id: true,
  email: true,
  username: true,
  emailVerified: true,
  image: true,
  sessions: {
    select: {
      id: true,
      expiresAt: true,
    },
  },
  role: {
    select: {
      id: true,
      name: true,
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  permissions: {
    select: {
      id: true,
      name: true,
    },
  },
  student: {
    select: {
      id: true,
      studentNumber: true,
      firstName: true,
      lastName: true,
      gender: true,
    },
  },
  staff: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserResponseType = Prisma.UserGetPayload<{
  select: typeof UserSelect;
}>;

export const HouseSelect = {
  id: true,
  name: true,
  occupancy: true,
  houseGender: true,
  residencyType: true,
  houseMasterId: true,
  houseMaster: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
} satisfies Prisma.HouseSelect;

export type HouseResponseType = Prisma.HouseGetPayload<{
  select: typeof HouseSelect;
}>;
