/** biome-ignore-all assist/source/organizeImports:reason */
import type { Prisma } from "@/generated/prisma/client";
import { ActionError, CUSTOM_ERRORS, type Levels } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { type ClassesResponseType, ClassesSelect } from "@/lib/types";
import type { BulkClassesType, ClassesType } from "@/lib/validation";
import { CONSTANTS } from "@/utils/generateStudentIndex";
import type { IClassStream } from "./interface";
import { generateUniqueClassCode } from "./utils/generate-class-code";

interface DuplicateCheckResult {
  stream: ClassesResponseType | null;
  conflictFields?: "name" | "code" | "nextClassId" | "classTeacherId";
}

interface ClassesWithCodes {
  staff: string[];
  departmentId: string | undefined;
  nextClassId: string | null;
  classTeacherId: string | null;
  name: string;
  code: string;
  createdAt: Date | null;
  maxCapacity: number | null;
  level: "Year_One" | "Year_Two" | "Year_Three";
}

export class ClassesService implements IClassStream {
  private transform(data: ClassesType) {
    return {
      ...data,
      nextClassId: data.nextClassId ? data.nextClassId : null,
      classTeacherId: data.classTeacherId ? data.classTeacherId : null,
      name: data.name.trim(),
      code: data.code?.trim() ?? "",
      createdAt: data.createdAt ?? null,
      maxCapacity: data.maxCapacity ?? null,
      departmentId: data.departmentId ?? null,
    };
  }

  private async verifyExistingStream(
    classId?: string,
    data?: ClassesType,
  ): Promise<DuplicateCheckResult> {
    const whereClause: Prisma.ClassWhereInput = {};

    if (classId && !data) {
      const stream = await prisma.class.findFirst({
        where: { id: classId },
        select: ClassesSelect,
      });
      return { stream };
    }

    if (data) {
      const result = this.transform(data);
      const { nextClassId, classTeacherId, code, name } = result;

      whereClause.OR = [
        ...(code ? [{ code }] : []),
        ...(name ? [{ name }] : []),
        ...(nextClassId ? [{ nextClassId }] : []),
        ...(classTeacherId ? [{ classTeacherId }] : []),
      ];

      if (classId) whereClause.NOT = { id: classId };
    }

    if (Object.keys(whereClause).length === 0) return { stream: null };

    const existing = await prisma.class.findFirst({
      where: whereClause,
      select: ClassesSelect,
    });

    if (existing === null) return { stream: null };

    let conflictFields: DuplicateCheckResult["conflictFields"];

    if (data) {
      if (data.code === existing.code) conflictFields = "code";
      else if (data.name === existing.name) conflictFields = "name";
      else if (data.classTeacherId === existing.classTeacherId)
        conflictFields = "classTeacherId";
      else if (data.nextClassId === existing.nextClassId)
        conflictFields = "nextClassId";
    }

    return { stream: existing, conflictFields };
  }

  private async generateClassCode(
    date: Date | null,
    departmentId: string | null,
    sequenceNumberOverrides?: number,
  ) {
    const year = new Date(date as Date).getFullYear();

    const [lastClass, department] = await Promise.all([
      prisma.class.findFirst({
        where: {
          departmentId,
          createdAt: {
            gte: new Date(year, 0, 1),
            lte: new Date(year + 1, 0, 1),
          },
        },
        orderBy: { createdAt: "desc" },
        select: { code: true, department: { select: { name: true } } },
      }),
      prisma.department.findFirst({
        where: { id: departmentId as string },
        select: { name: true },
      }),
    ]);

    const sequenceNumber =
      sequenceNumberOverrides !== undefined
        ? sequenceNumberOverrides
        : lastClass
          ? Number.isNaN(
              parseInt(lastClass.code.slice(-CONSTANTS.SEQUENCE_LENGTH), 10),
            )
            ? 1
            : parseInt(lastClass.code.slice(-CONSTANTS.SEQUENCE_LENGTH), 10) + 1
          : 1;

    const code = generateUniqueClassCode(
      year,
      lastClass?.department
        ? lastClass.department.name
        : (department?.name as string),
      sequenceNumber,
    );

    return code;
  }

  private async generateBulkClassCodes(data: ClassesWithCodes[]) {
    const classesWithCodes: ClassesWithCodes[] = [];

    for (const item of data) {
      let finalCode = item.code;

      if (!finalCode) {
        let generateCode: string;
        let attempts = 0;
        generateCode = await this.generateClassCode(
          item.createdAt,
          item.departmentId as string,
        );
        let currentSequence = parseInt(
          generateCode.slice(-CONSTANTS.SEQUENCE_LENGTH),
          10,
        );
        if (Number.isNaN(currentSequence)) currentSequence = 1;

        while (
          (await prisma.class.findUnique({ where: { code: generateCode } })) ||
          classesWithCodes.some((c) => c.code === generateCode)
        ) {
          currentSequence += 1;

          generateCode = await this.generateClassCode(
            item.createdAt,
            item.departmentId as string,
            currentSequence,
          );

          attempts++;
          if (attempts > 50) {
            throw new Error(
              "Unable to generate a unique class code after 50 attempts.",
            );
          }
        }

        finalCode = generateCode;
      }

      classesWithCodes.push({
        ...item,
        code: finalCode,
        createdAt: item.createdAt as Date,
      });
    }

    return classesWithCodes;
  }

  async createClass(data: ClassesType) {
    const transformedData = this.transform(data);
    const { stream, conflictFields } = await this.verifyExistingStream(
      undefined,
      data,
    );

    if (stream && conflictFields) {
      const errorMessages = {
        code: `The class code '${transformedData.code}' is already assigned to another class.`,
        name: `The class name '${transformedData.name}' is already in use.`,
        classTeacherId:
          "This teacher is already assigned to manage another class.",
        nextClassId:
          "The designated next class is already linked to a different class.",
      };

      throw new ActionError(errorMessages[conflictFields]);
    }

    const classCode = await this.generateClassCode(
      transformedData.createdAt,
      transformedData.departmentId,
    );

    return await prisma.class.create({
      data: {
        name: transformedData.name,
        code: classCode,
        level: transformedData.level,
        createdAt: transformedData.createdAt as Date,
        maxCapacity: transformedData.maxCapacity,
        nextClassId: transformedData.nextClassId,
        classTeacherId: transformedData.classTeacherId,
        departmentId: transformedData.departmentId,
        staff: transformedData.staff
          ? {
              connect: transformedData.staff.map((staffId) => ({
                id: staffId,
              })),
            }
          : undefined,
      },
      select: ClassesSelect,
    });
  }

  async listClasses() {
    return await prisma.class.findMany({
      orderBy: { createdAt: "desc" },
      select: ClassesSelect,
    });
  }

  async getClass(classId: string) {
    const { stream } = await this.verifyExistingStream(classId);
    if (!stream) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);
    return stream;
  }

  async updateClass(classId: string, data: ClassesType) {
    const transformedData = this.transform(data);
    const { stream, conflictFields } = await this.verifyExistingStream(
      classId,
      data,
    );

    if (stream && conflictFields) {
      const errorMessages = {
        code: `The class code '${transformedData.code}' is already assigned to another class.`,
        name: `The class name '${transformedData.name}' is already in use.`,
        classTeacherId:
          "This teacher is already assigned to manage another class.",
        nextClassId:
          "The designated next class is already linked to a different class.",
      };

      throw new ActionError(errorMessages[conflictFields]);
    }

    return await prisma.class.update({
      where: { id: classId },
      data: {
        ...transformedData,
        createdAt: transformedData.createdAt as Date,
        staff: transformedData.staff
          ? { set: transformedData.staff.map((staffId) => ({ id: staffId })) }
          : undefined,
      },
      select: ClassesSelect,
    });
  }

  async deleteClass(classId: string) {
    const { stream } = await this.verifyExistingStream(classId);
    if (!stream) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    if (stream._count.exeats)
      throw new ActionError(
        "You cannot delete a class with existing exeat records.",
      );
    await prisma.class.delete({ where: { id: stream.id } });
  }

  async deleteClasses(classIds: string[]) {
    const filterResults = await Promise.all(
      classIds.map(async (classId) => {
        const { stream } = await this.verifyExistingStream(classId);
        return stream !== null;
      }),
    );
    const filteredClassIds = classIds.filter(
      (_, index) => filterResults[index],
    );
    return await prisma.class.deleteMany({
      where: { id: { in: filteredClassIds } },
    });
  }
  async updateClassEnrollment(classId: string, enrollmentCount: number) {
    const { stream } = await this.verifyExistingStream(classId);
    if (!stream) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);
    return await prisma.class.update({
      where: { id: stream.id },
      data: {
        currentEnrollment: { set: enrollmentCount },
      },
      select: ClassesSelect,
    });
  }

  async bulkCreateClasses(data: BulkClassesType) {
    const parsed = data.data.map((item) => {
      const { department, ...rest } = item;
      return {
        ...rest,
        level: item.level.replace(" ", "_") as (typeof Levels)[number],
      };
    });
    const filterResults = await Promise.all(
      parsed.map(async (cls) => {
        const { stream, conflictFields } = await this.verifyExistingStream(
          undefined,
          { ...cls, createdAt: new Date(cls.createdAt) },
        );
        return !stream && !conflictFields;
      }),
    );

    const filteredClasses = parsed.filter((_, index) => filterResults[index]);
    const transformedData = filteredClasses.map((item) =>
      this.transform({ ...item, createdAt: new Date(item.createdAt) }),
    );

    const deptPromises = transformedData.map(async (klass) => {
      const dp = await prisma.department.findFirst({
        where: { name: klass.departmentId as string },
        select: { id: true },
      });
      return {
        ...klass,
        departmentId: dp?.id,
      };
    });

    const fulfilledDeptPromises = await Promise.all(deptPromises);

    const staffPromises = fulfilledDeptPromises.map(async (klass) => {
      const staff = await prisma.staff.findMany({
        where: { employeeId: { in: klass.staff } },
      });

      return {
        ...klass,
        staff: staff.map((staff) => staff.id),
      };
    });

    const fulfilledStaffPromises = await Promise.all(staffPromises);
    const classesWithCodes = await this.generateBulkClassCodes(
      fulfilledStaffPromises,
    );
    const createClassesPromises = classesWithCodes.map((klass) =>
      prisma.class.create({
        data: {
          ...klass,
          createdAt: klass.createdAt as Date,
          staff: klass.staff
            ? { connect: klass.staff.map((staffId) => ({ id: staffId })) }
            : undefined,
        },
      }),
    );

    return { count: (await prisma.$transaction(createClassesPromises)).length };
  }
}
