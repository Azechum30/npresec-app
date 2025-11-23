import { Prisma } from "../../prisma/generated/client";

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
  teachers: true,
} satisfies Prisma.DepartmentSelect;

export type DepartmentData = Prisma.DepartmentGetPayload<{
  include: typeof DepartmentInclude;
}>;

export type DepartmentResponseType = Prisma.DepartmentGetPayload<{
  select: typeof DepartmentSelect;
}>;

export const TeacherSelect = {
  id: true,
  employeeId: true,
  firstName: true,
  lastName: true,
  middleName: true,
  birthDate: true,
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
      picture: true,
    },
  },
} satisfies Prisma.TeacherSelect;

export type TeacherResponseType = Prisma.TeacherGetPayload<{
  select: typeof TeacherSelect;
}>;

export const ClassesSelect = {
  id: true,
  code: true,
  name: true,
  createdAt: true,
  teachers: {
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
  teacherId: true,
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
  teachers: {
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
    picture: true;
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
      picture: true,
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
          picture: true,
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
  teacherId: true,
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
          picture: true,
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
  teacher: {
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
  picture: true,
  resetPasswordRequired: true,
  session: {
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
  teacher: {
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
