/** biome-ignore-all assist/source/organizeImports:reason */
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
import { useSuspenseQueries } from "@tanstack/react-query";
import { FilterX } from "lucide-react";
import React, { useMemo, useState } from "react";
import { departmentsQueryOptions } from "../../departments/actions/queries";
import { useDeleteClassesMutationFn } from "../actions/mutations";
import { classQueryOptions } from "../actions/queries";
import { classTransformer } from "../utils/class-transformer";
import ClassDetailRow from "./ClassDetailRow";
import { useGetClassesColumns } from "./ClassesColumns";

const RenderClassesDataTable: React.FC = () => {
  const columns = useGetClassesColumns();

  const { preferredDateFormat } = useUserPreferredDateFormat();

  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");

  const { mutateAsync } = useDeleteClassesMutationFn();

  const classDataTransformer = useMemo(
    () => classTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const [classQueryData, departmentsQueryData] = useSuspenseQueries({
    queries: [
      {
        ...classQueryOptions,
      },

      {
        ...departmentsQueryOptions,
      },
    ],
  });

  const levels = useMemo(() => {
    if (!classQueryData.data) return [];

    return [...new Set(classQueryData.data.map((cls) => cls.level))];
  }, [classQueryData.data]);

  const filteredData = useMemo(() => {
    if (!level && !department) return [];
    return (
      classQueryData.data?.filter((cls) => {
        const matchesLevel = !level || cls.level === level;
        const matchesDept = !department || cls.departmentId === department;

        return matchesLevel && matchesDept;
      }) ?? []
    );
  }, [level, department, classQueryData.data]);

  function clearFilters() {
    setLevel("");
    setDepartment("");
  }

  return (
    <React.Fragment>
      {classQueryData.error ? (
        <ErrorComponent error={classQueryData.error.message} />
      ) : null}
      {classQueryData.data && (
        <>
          <Card className="shadow-lg p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select
                value={department}
                onValueChange={(e) => setDepartment(e)}>
                <SelectTrigger
                  type="button"
                  aria-label="filter class by department"
                  className="h-9 w-full sm:w-auto">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent align="center" position="popper">
                  {departmentsQueryData.data.map((dpt) => (
                    <SelectItem key={dpt.id} value={dpt.id}>
                      {dpt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={level} onValueChange={(e) => setLevel(e)}>
                <SelectTrigger
                  type="button"
                  aria-label="filter class by year group"
                  className="h-9 w-full sm:w-auto">
                  <SelectValue placeholder="Filter by year group" />
                </SelectTrigger>
                <SelectContent align="center" position="popper">
                  {levels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level.toString().replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(level || department) && (
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
            columns={columns}
            data={filteredData.length > 0 ? filteredData : classQueryData.data}
            showImportButton={true}
            transformer={classDataTransformer}
            filename="Classes-list"
            exportKey="classes"
            onDelete={async (rows) => {
              const ids = rows.map((row) => row.original.id);
              Promise.try(async () => await mutateAsync({ ids }));
            }}
            renderSubComponent={(row) => <ClassDetailRow row={row} />}
          />
        </>
      )}
    </React.Fragment>
  );
};

export default RenderClassesDataTable;
