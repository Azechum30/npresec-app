/** biome-ignore-all assist/source/organizeImports: reason */
"use client";
import LoadingButton from "@/components/customComponents/LoadingButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toProperCase } from "@/lib/to-proper-case";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useConfirmExeatRequestMutationFn } from "../../../_actions/mutations";
import { getStudentExeatRequestQueryOptions } from "../../../_actions/queries";

export const ConfirmExeatCheckinOrCheckout = ({
  exeatId,
}: {
  exeatId: string;
}) => {
  const { data } = useSuspenseQuery(
    getStudentExeatRequestQueryOptions(exeatId),
  );

  const { isPending, mutateAsync } = useConfirmExeatRequestMutationFn();
  const router = useRouter();

  const handleExeatConfirmation = async () => {
    await Promise.try(async () => {
      await mutateAsync(exeatId);
      router.push("/exeats");
    });
  };
  return (
    <Card className="w-full md:max-w-md md:mx-auto">
      <CardHeader className="border-b">
        <CardTitle>
          {data.status === "APPROVED"
            ? "Confirm Student Departure"
            : data.status === "ACTIVE"
              ? "Confirm Student Return"
              : "Exeat Expired"}
        </CardTitle>
        <CardDescription>
          Kindly confirm the departure or return status of an exeat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-50 rounded-md mx-auto flex justify-center items-center border">
          <Image
            src={data.student.user?.image ?? "/no-avatar.jpg"}
            alt="student profile image"
            width={150}
            height={180}
          />
        </div>
        <div className="flex flex-col space-y-2 py-4 border px-4 rounded-md mt-3">
          <h4 className="uppercase border-b font-semibold text-sm pb-3">
            Student Details
          </h4>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Full Name:
            </span>
            <span>{`${data.student.lastName} ${data.student.firstName} ${data.student.middleName ?? ""}`}</span>
          </div>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Gender:
            </span>
            <span>{data.student.gender}</span>
          </div>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Class/Form:
            </span>
            <span>
              {data.currentClass.name}, {toProperCase(data.level)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Assigned House:
            </span>
            <span>{data.house.name}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-2 py-4 border px-4 rounded-md mt-3">
          <h4 className="uppercase border-b font-semibold text-sm pb-3">
            Exeat Details
          </h4>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Exeat Number:
            </span>
            <span>{data.exeatNumber}</span>
          </div>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Type:
            </span>
            <span>{toProperCase(data.type)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Status:
            </span>
            <span>{toProperCase(data.status)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Destination:
            </span>
            <span>{data.destination}</span>
          </div>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Departure Date:
            </span>
            <span>
              {new Intl.DateTimeFormat("en-GH", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(data.departureDate as Date)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pb-2">
            <span className="text-muted-foreground uppercase text-xs">
              Departure Date:
            </span>
            <span>
              {new Intl.DateTimeFormat("en-GH", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(data.expectedReturnDate as Date)}
            </span>
          </div>
        </div>
        <LoadingButton
          loading={isPending}
          onClick={handleExeatConfirmation}
          disabled={isPending || data.status === "RETURNED"}>
          {data.status === "APPROVED"
            ? "Confirm Departure"
            : data.status === "ACTIVE"
              ? "Confirm Return"
              : "Returned"}
        </LoadingButton>
      </CardContent>
    </Card>
  );
};
