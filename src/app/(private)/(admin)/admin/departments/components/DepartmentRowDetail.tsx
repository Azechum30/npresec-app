import { Badge } from "@/components/ui/badge";
import { DepartmentResponseType } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { ChartBar } from "lucide-react";
import moment from "moment";
import React from "react";

export default function DepartmentRowDetail({
  row,
}: {
  row: Row<DepartmentResponseType>;
}) {
  const { original } = row;

  return (
    <div className="border rounded-md p-4">
      <div className="border-b rounded-md p-3">
        <div className="flex justify-between">
          <h3 className="text-base font-semibold mb-2">Department Details</h3>
          <Badge className="text-base lg:block]">
            <ChartBar /> Total Teachers: {original.staff.length}
          </Badge>
        </div>
        <ul className="text-sm px-5 list-disc">
          <li>
            <strong>Department Code:</strong> {original.code}
          </li>
          <li>
            <strong>Department Name:</strong> {original.name}
          </li>
          <li>
            <strong>Created Date:</strong>{" "}
            {moment(original.createdAt).format("DD/MM/YYYY")}
          </li>
          <li>
            <strong>Head of Department:</strong>{" "}
            {original.head
              ? `${original.head?.lastName} ${original.head?.firstName} ${original.head?.middleName}`
              : ""}
          </li>
        </ul>
      </div>
      <div className="p-3">
        <p className="text-justify leading-normal">{original.description}</p>
      </div>

      <div className="p-3 flex flex-col md:flex-row gap-6 overflow-clip">
        <div className="rounded-md border p-2 hover:cursor-pointer hover:scale-105 transition-all delay-300 w-full">
          <h3 className="text-base font-semibold mb-2">Assigned Teachers</h3>
          <ul className="text-sm px-5 list-disc">
            {original.staff?.map((st) => (
              <li
                key={
                  st.id
                }>{`${st.lastName} ${st.firstName} ${st.middleName}`}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border p-2 hover:cursor-pointer hover:scale-105 transition-all delay-300 w-full">
          <h3 className="text-base font-semibold mb-2">
            Classes Under Department
          </h3>
          <ul className="text-sm px-5 list-disc">
            {original.classes?.map((klass) => (
              <React.Fragment key={klass.id}>
                <li className="">
                  <span className="w-full mr-3 last:mr-0">
                    <strong>ClassName: </strong>
                    {klass.name}
                  </span>
                  <span className="w-full mr-3 last:mr-0">
                    <strong>Level: </strong> {klass.level.split("_").join(" ")}
                  </span>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
