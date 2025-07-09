import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { calculateAge } from "@/lib/calculate-age";
import { TeacherResponseType } from "@/lib/types";
import { yearsAndMonthsUntilRetirement } from "@/lib/yearsUntilRetirement";
import { Row } from "@tanstack/react-table";
import { BadgeCent } from "lucide-react";
import moment from "moment";

type TeacherRowDetailProp = {
  row: Row<TeacherResponseType>;
};
export default function TeacherRowDetail({ row }: TeacherRowDetailProp) {
  return (
    <div>
      <div className="rounded-md border p-4">
        <div className="border-b py-3">
          <div className="flex justify-between items-center ">
            <h1 className="uppercase">
              Profile Details of{" "}
              {`${row.original.firstName} ${row.original.lastName}`}
            </h1>
            <Badge variant="default" className="hover:cursor-pointer">
              <BadgeCent className="size-5 mr-1" />
              <span>STAFF ID: {row.original.employeeId}</span>
            </Badge>
          </div>
          <p className="mt-4 text-muted-foreground text-sm">
            This contains a detailed description of{" "}
            <span className="text-primary font-semibold dark:text-primary-foreground">
              {`${row.original.lastName} ${row.original.firstName} ${row.original.middleName}`}
              ,
            </span>{" "}
            including the department to which{" "}
            <span>{row.original.gender === "Male" ? "he" : "she"}</span>{" "}
            belongs, the classes{" "}
            <span>{row.original.gender === "Male" ? "he" : "she"}</span>{" "}
            teaches, and other additional responsibilities assigned to{" "}
            <span>{row.original.gender === "Male" ? "him" : "her"}</span> by the
            Headmaster and his Management Board. Peruse this detail section to
            obtain all the necessary information about{" "}
            <span>{row.original.firstName}</span>.
          </p>
        </div>
        <div>
          <div className="flex flex-col md:flex-row gap-4 p-3 overflow-hidden">
            <div className="rounded-md p-4 border hover:cursor-pointer hover:scale-105 transition-all delay-300 w-full bg-background">
              <div className="text-base font-semibold py-2">Bio Data</div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Name:</span>{" "}
                {row.original.lastName +
                  " " +
                  row.original.firstName +
                  " " +
                  row.original.middleName}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Gender:</span>{" "}
                {row.original.gender}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Age:</span>{" "}
                {calculateAge(row.original.birthDate)}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Marital Status:</span>{" "}
                {row.original.maritalStatus}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Phone:</span>{" "}
                {row.original.phone}
              </div>
            </div>
            <div className="rounded-md p-4 border hover:cursor-pointer hover:scale-105 transition-all delay-300 w-full bg-background">
              <div className="text-base font-semibold py-2">
                Employment Details
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Staff ID:</span>{" "}
                {row.original.employeeId}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Current Rank:</span>{" "}
                {row.original.rank}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Years to Retirement:</span>{" "}
                {yearsAndMonthsUntilRetirement(row.original.birthDate)
                  .remainingYears +
                  " " +
                  "Years" +
                  " " +
                  yearsAndMonthsUntilRetirement(row.original.birthDate)
                    .remainingMonths +
                  " " +
                  "Months"}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">
                  1<sup>st</sup> Appointment Date:
                </span>{" "}
                {moment(row.original.dateOfFirstAppointment).format(
                  "DD/MM/YYYY"
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">SSNIT No.:</span>{" "}
                {row.original.ssnitNumber}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Registered No.:</span>{" "}
                {row.original.rgNumber}
              </div>
            </div>
            <div className="rounded-md p-4 border hover:cursor-pointer hover:scale-105 transition-all delay-300 w-full bg-background">
              <div className="text-base font-semibold py-2">School Details</div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Department:</span>{" "}
                {row.original.department?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className=" font-semibold">Assigned Classes:</span>{" "}
                  <ul className="px-8 list-disc">
                {row.original.classes.map((classItem,index) => (
                    <li key={`${index}-${classItem.id}`}>{classItem.name}</li>
                ))}
                  </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
