-- DropIndex
DROP INDEX "departments_name_code_idx";

-- DropIndex
DROP INDEX "students_departmentId_currentLevel_idx";

-- DropIndex
DROP INDEX "students_firstName_lastName_studentNumber_idx";

-- DropIndex
DROP INDEX "user_roles_userId_roleId_idx";

-- DropIndex
DROP INDEX "users_email_username_idx";

-- CreateIndex
CREATE INDEX "departments_name_idx" ON "departments"("name");

-- CreateIndex
CREATE INDEX "departments_code_idx" ON "departments"("code");

-- CreateIndex
CREATE INDEX "students_departmentId_idx" ON "students"("departmentId");

-- CreateIndex
CREATE INDEX "students_firstName_lastName_studentNumber_currentLevel_idx" ON "students"("firstName", "lastName", "studentNumber", "currentLevel");

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");
