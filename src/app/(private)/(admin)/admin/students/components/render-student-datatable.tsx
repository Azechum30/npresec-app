/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FilterX } from "lucide-react";
import { useMemo, useState } from "react";
import { useDeleteStudentsMutationFn } from "../actions/mutations";
import { studentsQueryOptions } from "../actions/queries";
import { studentTransformer } from "../utils/utils";
import { useGetColumns } from "./studentColumns";
import StudentRowDetail from "./StudentRowDetail";

export const StudentDataTable = () => {
  const columns = useGetColumns();

  const { preferredDateFormat } = useUserPreferredDateFormat();
  const transformer = useMemo(
    () => studentTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const { data, error } = useSuspenseQuery(studentsQueryOptions);
  const { mutateAsync } = useDeleteStudentsMutationFn();

  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [gender, setGender] = useState("");

  const genders = useMemo(() => {
    if (!data) return [];

    return [...new Set(data.map((d) => d.gender))];
  }, [data]);

  const levels = useMemo(() => {
    if (!data) return [];

    return [...new Set(data.map((d) => d.currentLevel))];
  }, [data]);

  const classes = useMemo(() => {
    if (!data) return [];

    return Array.from(
      new Map(
        data.map((d) => [
          d.classId,
          { id: d.classId, name: d.currentClass?.name },
        ]),
      ).values(),
    );
  }, [data]);

  const departments = useMemo(() => {
    if (!data) return [];

    return Array.from(
      new Map(
        data.map((d) => [
          d.departmentId,
          { id: d.departmentId, name: d.department?.name },
        ]),
      ).values(),
    );
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return (
      data.filter((student) => {
        const matchesLevel = !level || student.currentLevel === level;
        const matchesDepartment =
          !department || student.departmentId === department;
        const matchesGender = !gender || student.gender === gender;
        const matchesClass =
          !selectedClass || student.classId === selectedClass;

        return (
          matchesLevel && matchesDepartment && matchesGender && matchesClass
        );
      }) ?? []
    );
  }, [level, department, selectedClass, gender, data]);

  function clearFilters() {
    setSelectedClass("");
    setLevel("");
    setDepartment("");
    setGender("");
  }

  const hasFilters = !!level || !!department || !!gender || !!selectedClass;

  return (
    <>
      {error ? (
        <ErrorComponent error={error.message} />
      ) : (
        <>
          <Card className="shadow-lg p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select
                value={selectedClass}
                onValueChange={(e) => setSelectedClass(e)}>
                <SelectTrigger
                  type="button"
                  aria-label="filter students by classes"
                  className="h-9 w-full sm:w-auto">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent align="center" position="popper">
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id as string}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={department}
                onValueChange={(e) => setDepartment(e)}>
                <SelectTrigger
                  type="button"
                  aria-label="filter students by departments"
                  className="h-9 w-full sm:w-auto">
                  <SelectValue placeholder="Filter by departments" />
                </SelectTrigger>
                <SelectContent align="center" position="popper">
                  {departments.map((dpt) => (
                    <SelectItem key={dpt.id} value={dpt.id as string}>
                      {dpt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={level} onValueChange={(e) => setLevel(e)}>
                <SelectTrigger
                  type="button"
                  aria-label="filter students by year group"
                  className="h-9 w-full sm:w-auto">
                  <SelectValue placeholder="Filter students by year group" />
                </SelectTrigger>
                <SelectContent align="center" position="popper">
                  {levels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level.toString().replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={gender} onValueChange={(e) => setGender(e)}>
                <SelectTrigger
                  type="button"
                  aria-label="filter students by gender"
                  className="h-9 w-full sm:w-auto">
                  <SelectValue placeholder="Filter students by gender" />
                </SelectTrigger>
                <SelectContent align="center" position="popper">
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender.toString()}>
                      {gender.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasFilters && (
              <Button
                onClick={clearFilters}
                variant="destructive"
                type="button"
                aria-label="Clear Class Filters">
                <FilterX className="size-5" />
                Clear Filters
              </Button>
            )}
          </Card>
          <DataTable
            showImportButton={true}
            columns={columns}
            data={filteredData}
            transformer={transformer}
            filename="Students-list"
            exportKey="students"
            onDelete={async (rows) => {
              const ids = rows.map((row) => row.original.id);
              await Promise.try(async () => mutateAsync(ids));
            }}
            renderSubComponent={(row) => <StudentRowDetail row={row} />}
          />
        </>
      )}
    </>
  );
};
