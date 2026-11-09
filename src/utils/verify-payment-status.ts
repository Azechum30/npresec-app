import { prisma } from "@/lib/prisma";

export const verifyPaymentStatus = async (admissionId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { admissionId },
    select: { admissionId: true, admission: true, paymentStatus: true },
  });

  if (!payment || payment.paymentStatus === "PENDING")
    throw new Error("Fee payment could not be verified");

  if (!payment.admission?.isFormSubmitted)
    throw new Error("Enrollment form is not completed");

  return {
    ...payment.admission,
    residentialStatus: payment.admission.residentialStatus as string,
    admissionStatus: payment.admission.admissionStatus as string,
  };
};
