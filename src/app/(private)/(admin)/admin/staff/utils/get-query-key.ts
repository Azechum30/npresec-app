export const getQueryKey = (id?: string) => {
  return {
    department: {
      all: ["departments"],
      single: ["department", id as string],
    },

    class: {
      all: ["classes"],
      single: ["class", id as string],
    },
    staff: {
      all: ["staff-list"],
      single: ["staff", id as string],
    },
    course: {
      all: ["courses"],
      single: ["course", id as string],
    },
    student: {
      all: ["students"],
      single: ["student", id as string],
    },
    user: {
      all: ["users"],
      single: ["user", id as string],
    },

    attendance: {
      all: ["attendance-list"],
      single: ["attendance-record", id as string],
    },
    service: {
      all: ["services"],
      single: ["service", id as string],
    },
    allocation: {
      all: ["house-allocations"],
      single: ["house-allocation", id as string],
    },
    permission: {
      all: ["permissions"],
      single: ["permission", id as string],
    },
    role: {
      all: ["roles"],
      single: ["role", id as string],
    },
  };
};
