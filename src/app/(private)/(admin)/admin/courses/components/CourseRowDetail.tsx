"use client";

import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { CourseResponseType } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { FC } from "react";

const CourseRowDetail: FC<{ row: Row<CourseResponseType> }> = ({ row }) => {
  const { formatDate } = useUserPreferredDateFormat();
  const { original } = row;
  return (
    <div className="p-4 rounded-md border">
      <div className="">
        <h3 className="text-base font-semibold mb-2">Course Details</h3>
        <ul className="px-5 list-disc text-sm">
          <li>
            <strong>Course Code: </strong>
            {original.code}
          </li>
          <li>
            <strong>Course Title: </strong>
            {original.title}
          </li>
          <li>
            <strong>Course Credits: </strong>
            {original.credits}
          </li>
          <li>
            <strong>Created Date: </strong>
            {formatDate(original.createdAt)}
          </li>
        </ul>
        <div className="border-t py-3 mt-3">
          <h4 className="font-semibold py-3">Course Description</h4>
          <p className="leading-loose text-justify">
            {original?.description ? original.description : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5 mt-4 border-t py-3 overflow-hidden">
        <div className="rounded-md border p-6 transition-all hover:cursor-pointer hover:scale-105 w-full hover:shadow-md">
          <h3 className="text-sm font-semibold mb-2 ">
            Depts. that run this Course
          </h3>
          <ul className="ps-5 list-disc">
            {original.departments.map((dept, index) => (
              <li key={`${dept.id}-${index}`}>{dept.name}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border p-6 transition-all hover:cursor-pointer hover:scale-105 w-full hover:shadow-md">
          <h3 className="text-sm font-semibold mb-2 ">Course Classes:</h3>
          <ul className="ps-5 list-disc">
            {original.classes.map((className, index) => (
              <li key={`${className.id}-${index}`}>{className.name}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border p-6 transition-all hover:cursor-pointer hover:scale-105 w-full hover:shadow-md">
          <h3 className="text-sm font-semibold mb-2 ">Course Instructors:</h3>
          <ul className="ps-5 list-disc">
            {original.staff.map((teacherName, index) => (
              <li key={`${teacherName.id}-${index}`}>
                {teacherName.lastName + " " + teacherName.firstName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseRowDetail;
