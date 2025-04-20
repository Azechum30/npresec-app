import { ClassesResponseType } from "@/lib/types";
import { Row } from "@tanstack/react-table";

type ClassDetailRowProps = {
  row: Row<ClassesResponseType>;
};

export default function ClassDetailRow({ row }: ClassDetailRowProps) {
  const { original } = row;
  return (
    <div className="flex flex-col md:flex-row gap-5 p-3 overflow-hidden">
      <div className="p-4 border rounded w-full hover:cursor-pointer hover:scale-105 transition-all delay-300 ">
        <h3 className="text-base font-semibold">Class Details</h3>
        <ul className="mt-2 text-xs px-5 list-disc">
          <li>
            <strong>Class Code:</strong> {original.code}
          </li>
          <li>
            <strong>Class Name:</strong> {original.name}
          </li>
          <li>
            <strong>Department:</strong> {original.department?.name || "N/A"}
          </li>
          <li>
            <strong>Year Level:</strong> {original.level.split("_").join(" ")}
          </li>
          <li>
            <strong>Created At:</strong>{" "}
            {new Date(original.createdAt).toLocaleDateString()}
          </li>
        </ul>
      </div>
      <div className="p-4 border rounded w-full hover:cursor-pointer hover:scale-105 transition-all delay-300">
        <h3 className="text-base font-semibold">Assigned Teachers</h3>
        <ul className="mt-2 text-xs px-5 list-disc">
          {original.teachers.length > 0
            ? original.teachers.map((teacher) => (
                <li key={teacher.id}>
                  {`${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`}
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
