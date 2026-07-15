import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  class: ["create", "list", "get", "update", "delete"],
  house: ["create", "list", "get", "update", "delete"],
  department: ["create", "list", "get", "update", "delete"],
  course: ["create", "list", "get", "update", "delete"],
  attendance: ["create", "list", "get", "update", "delete"],
  admission: ["create", "list", "get", "update", "delete"],
} as const;
export const ac = createAccessControl(statements);

export const admin = ac.newRole({
  ...statements,
  ...adminAc.statements,
});

export const teaching_staff = ac.newRole({
  class: ["get", "list"],
});
