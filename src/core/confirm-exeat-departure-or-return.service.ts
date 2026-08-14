import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { workflowClient } from "@/lib/server-only-actions/workflow";

export const confirmExeatDepartureOrReturnService = async (
  userId: string,
  exeatId: string,
) => {
  const [existingExeat, staff] = await Promise.all([
    prisma.exeat.findUnique({
      where: { id: exeatId },
      select: {
        id: true,
        status: true,
        guardianName: true,
        guardianContact: true,
        destination: true,
        departureDate: true,
        expectedReturnDate: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
      },
    }),
    prisma.staff.findFirst({
      where: { userId },
      select: { id: true },
    }),
  ]);

  if (!existingExeat)
    throw new Error("No record matches the provided exeat ID");
  if (!staff) throw new Error("No staff matched the provided user ID");

  const departureMessage = `Dear Parent/Guardian,\n\nThis is to formally inform you that your ward, ${existingExeat.student.lastName} ${existingExeat.student.firstName} ${existingExeat.student.middleName ?? ""}, has been officially dispatched from Nakpanduri Presbyterian Senior High Technical School (NPRESEC) for an approved exeat to visit ${existingExeat.destination}.\n\nYour ward is strictly expected to report back to campus by ${new Intl.DateTimeFormat("en-GH", { dateStyle: "long", timeStyle: "short" }).format(existingExeat.expectedReturnDate as Date)}.\n\nThank you for your continuous cooperation.\n\nBest regards,\nSchool Administration,\nNakpanduri Presby SHTS.`;

  const checkInMessage = `Dear Parent/Guardian,\n\nThis is to formally confirm that your ward, ${existingExeat.student.lastName} ${existingExeat.student.firstName} ${existingExeat.student.middleName ?? ""}, has returned to campus and successfully checked in at the school gate.\n\nYour ward's exeat record is now officially closed, and they have resumed normal school activities.\n\nThank you for ensuring a timely return and for your continuous cooperation with the school authorities.\n\nBest regards,\nSchool Administration,\nNakpanduri Presby SHTS.`;

  await prisma.exeat.update({
    where: { id: existingExeat.id },
    data: {
      status: existingExeat.status === "APPROVED" ? "ACTIVE" : "RETURNED",
      checkOutById: existingExeat.status === "APPROVED" ? staff.id : undefined,
      checkInById: existingExeat.status === "ACTIVE" ? staff.id : undefined,
    },
  });

  const workflowURL = `${env.UPSTASH_WORKFLOW_URL}/api/sms/send`;

  await workflowClient.trigger({
    url: workflowURL,
    body: {
      to: existingExeat.guardianContact,
      message:
        existingExeat.status === "APPROVED" ? departureMessage : checkInMessage,
      userId,
    },
  });
};
