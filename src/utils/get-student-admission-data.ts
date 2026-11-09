import { prisma } from "@/lib/prisma";
import { verifyPaymentStatus } from "./verify-payment-status";

export const getStudentAdmissionData = async (admissionId: string) => {
  const paymentStatus = await verifyPaymentStatus(admissionId);

  const newStudent = await prisma.student.findFirst({
    where: {
      jhsIndexNumber: paymentStatus.jhsIndexNumber,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      middleName: true,
      studentNumber: true,
      department: {
        select: { name: true },
      },
      currentClass: {
        select: {
          name: true,
        },
      },
      allocations: {
        select: {
          studentId: true,
          status: true,
          house: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (!newStudent) throw new Error("Student not found");
  const { id, allocations, currentClass, department, ...rest } = newStudent;

  return {
    ...rest,
    programme: department?.name ?? "N/A",
    assignedClass: currentClass?.name ?? "N/A",
    assignedHouse:
      allocations.find((al) => al.studentId === id)?.house.name ?? "N/A",
    residentialStatus:
      allocations.find((al) => al.studentId === id)?.status ?? "N/A",
  };
};
