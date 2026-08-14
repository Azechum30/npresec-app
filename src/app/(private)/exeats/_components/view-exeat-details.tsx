/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { useAuth } from "@/components/customComponents/SessionProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { ExtendedSession } from "@/lib/auth-client";
import { toProperCase } from "@/lib/to-proper-case";
import { userHasRole } from "@/lib/user-has-role";
import { useQuery } from "@tanstack/react-query";
import { Download, ShieldCheck, ShieldQuestionMark } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useApproveExeatRequestMutationFn } from "../_actions/mutations";
import { getStudentExeatRequestQueryOptions } from "../_actions/queries";

export const ViewExeatDetails = () => {
  const { dialogs, id, onClose } = useGenericDialog();

  const isOpen = !!dialogs["view-exeat-details"];
  const validId = id ?? null;
  const { data } = useQuery({
    ...getStudentExeatRequestQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const { isPending, mutateAsync, isSuccess } =
    useApproveExeatRequestMutationFn();
  const user = useAuth();
  const roleSet = userHasRole(user as ExtendedSession["user"]);

  const hasRole = roleSet.has("admin") || roleSet.has("senior_house_master");

  const handleExeatApproval = async () => {
    await Promise.try(async () => {
      await mutateAsync(data?.exeatNumber as string);
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose("view-exeat-details")}>
      <SheetContent side="right" className="w-full md:min-w-2xl">
        {data ? (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>
                <div className="w-fit py-2 text-xl font-bold">
                  Exeat Summary
                </div>
              </SheetTitle>
              <SheetDescription>
                Review the details of the selected exeat and either approve or
                reject it. Should the exeat be rejected, you need to provide a
                reason for the rejection.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-4 max-h-[70vh] overflow-y-auto scrolbar-thin">
              <div className="flex flex-col sm:flex-row gap-6 p-4 border mx-3 rounded-md">
                <div className="border rounded-md p-2 sm:flex-1/4 sm:shrink-0">
                  <Image
                    src={data.student.user?.image ?? "/no-avatar.jpg"}
                    alt="Profile picture of a student"
                    width={150}
                    height={200}
                  />
                </div>
                <div className="sm:flex-3/4 flex flex-col gap-2">
                  <h3 className="text-xl font-bold">
                    {`${data.student.gender === "Male" ? "Mr." : "Miss"} ${data.student.lastName} ${data.student.firstName} ${data.student.middleName ?? ""}`}
                  </h3>
                  <div className="flex space-x-2">
                    <span className="text-muted-foreground text-sm">
                      Exeat Number:
                    </span>
                    <span className="font-bold">{data.exeatNumber}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-muted-foreground text-sm">
                      Current Class:
                    </span>
                    <span className="font-bold">{data.currentClass.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-muted-foreground text-sm">
                      Current Year Group:
                    </span>
                    <span className="font-bold">
                      {toProperCase(data.level)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-muted-foreground text-sm">
                      Assigned House:
                    </span>
                    <span className="font-bold">{data.house.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-muted-foreground text-sm">
                      Exeat Type:
                    </span>
                    <span className="font-bold">{toProperCase(data.type)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-muted-foreground text-sm">
                      Destination:
                    </span>
                    <span className="font-bold">
                      {toProperCase(data.destination)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-muted-foreground text-sm">
                      Exeat Status:
                    </span>
                    <Badge
                      className="text-sm"
                      variant={
                        data.status === "PENDING"
                          ? "secondary"
                          : data.status === "APPROVED"
                            ? "outline"
                            : data.status === "ACTIVE"
                              ? "default"
                              : data.status === "OVERDUE"
                                ? "destructive"
                                : data.status === "RETURNED"
                                  ? "ghost"
                                  : "link"
                      }>
                      {toProperCase(data.status)}
                    </Badge>
                  </div>
                  <div className="flex space-x-2 sm:space-x-6">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">
                        Departure Date:
                      </span>
                      <span>
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                          timeStyle: "short",
                        }).format(data.departureDate as Date)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">
                        Expected Return Date:
                      </span>
                      <span>
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                          timeStyle: "short",
                        }).format(data.expectedReturnDate as Date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col px-3 space-y-4">
                <fieldset className="flex flex-col space-y-2 px-4 border pb-3 rounded-md">
                  <legend className="bg-primary/10 border-primary px-2 py-1.5 border w-fit rounded-md font-bold">
                    Reason For Exeat
                  </legend>
                  <p className="text-justify">{data.reason}</p>
                </fieldset>
                {(data.approvedById ||
                  data.checkOutById ||
                  data.checkInById) && (
                  <fieldset className="flex flex-col space-y-2 px-4 border pb-3 rounded-md">
                    <legend className="bg-primary/10 border-primary px-2 py-1.5 border w-fit rounded-md font-bold">
                      Approval Officers
                    </legend>
                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                      {data.approvedById && (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Approved By:
                          </span>
                          <span>
                            {`${data.approvedBy?.lastName ?? "NA"} ${data.approvedBy?.firstName ?? "NA"} ${data.approvedBy?.middleName ?? "NA"}`}{" "}
                            | Role:{" "}
                            {data.approvedBy?.user?.roles
                              .find(
                                (role) =>
                                  role.role.name === "admin" ||
                                  role.role.name === "senior_house_master",
                              )
                              ?.role.name.replace(/[_-]+/g, " ")}
                          </span>
                        </div>
                      )}
                      {data.checkOutById && (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Checked Out By:
                          </span>
                          <span>
                            {`${data.checkOutBy?.lastName ?? "NA"} ${data.checkOutBy?.firstName ?? "NA"} ${data.checkOutBy?.middleName ?? "NA"}`}{" "}
                            | Role:{" "}
                            {data.checkOutBy?.user?.roles
                              .find(
                                (role) =>
                                  role.role.name === "admin" ||
                                  role.role.name === "senior_house_master",
                              )
                              ?.role.name.replace(/[_-]+/g, " ")}
                          </span>
                        </div>
                      )}
                      {data.checkInById && (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">
                            Checked-In By:
                          </span>
                          <span>
                            {`${data.checkInBy?.lastName ?? "NA"} ${data.checkInBy?.firstName ?? "NA"} ${data.checkInBy?.middleName ?? "NA"}`}{" "}
                            | Role:{" "}
                            {data.checkInBy?.user?.roles
                              .find(
                                (role) =>
                                  role.role.name === "admin" ||
                                  role.role.name === "senior_house_master",
                              )
                              ?.role.name.replace(/[_-]+/g, " ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </fieldset>
                )}
              </div>
              {hasRole &&
                !(data.status === "ACTIVE" || data.status === "RETURNED") && (
                  <div className="flex flex-col sm:flex-row sm:item-center gap-3 px-3">
                    <LoadingButton
                      onClick={handleExeatApproval}
                      loading={isPending}
                      type="button"
                      className="flex-1"
                      disabled={data.status !== "PENDING"}>
                      <ShieldCheck className="size-5" />
                      {isPending
                        ? "Proccessing request"
                        : data.status !== "PENDING"
                          ? "Approved"
                          : "Approve"}
                    </LoadingButton>
                    {data.status === "PENDING" && (
                      <LoadingButton
                        loading={false}
                        type="button"
                        variant="destructive"
                        className="flex-1">
                        <ShieldQuestionMark className="size-5" />
                        Reject With Issues
                      </LoadingButton>
                    )}
                    {data.status === "APPROVED" && (
                      <Button asChild className="flex-1" variant="outline">
                        <Link href={`/api/exeats/${data.id}` as Route} download>
                          <Download className="size-5" />
                          Generate Exeat
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
            </div>
          </>
        ) : (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>
                <div className="w-fit py-2 text-xl font-bold">
                  Exeat Summary
                </div>
              </SheetTitle>
              <SheetDescription>
                Review the details of the selected exeat and either approve or
                reject it. Should the exeat be rejected, you need to provide a
                reason for the rejection.
              </SheetDescription>
            </SheetHeader>
            <DotMatrixLoader />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
