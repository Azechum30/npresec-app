/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toProperCase } from "@/lib/to-proper-case";
import { useSuspenseQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { exportHouseAllocationsTransformer } from "../_actions/export-house-allocations-transformer";
import { useDeleteAllocationsMutationFn } from "../_actions/mutations";
import { allocationsQueryOptions } from "../_actions/queries";
import { useGetAllocationsColumns } from "../hooks/use-get-allocation-columns";

export const RenderAllocationsTable = () => {
  const columns = useGetAllocationsColumns();
  const { mutateAsync } = useDeleteAllocationsMutationFn();

  const [house, setHouse] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const { data } = useSuspenseQuery(allocationsQueryOptions(house));

  const filteredData = useMemo(() => {
    if (!data) return { houses: [], genders: [], levels: [], statuses: [] };
    const houses = [
      ...new Map(data.map((al) => [al.house.id, al.house])).values(),
    ];
    const genders = [
      ...new Set(data.map((al) => toProperCase(al.student.gender))),
    ];
    const levels = [
      ...new Set(data.map((al) => al.student.currentLevel.toString())),
    ];
    const statuses = [...new Set(data.map((al) => al.status.toString()))];

    return { houses, genders, levels, statuses };
  }, [data]);

  const filteredAllocations = useMemo(() => {
    if (!data) return [];

    return data.filter((al) => {
      const matchesGender =
        !gender || gender.toLowerCase() === al.student.gender.toLowerCase();
      const matchesLevel = !level || level === al.student.currentLevel;
      const matchesStatus = !status || status === al.status;

      return matchesGender && matchesLevel && matchesStatus;
    });
  }, [data, gender, level, status]);

  const clearFilters = () => {
    setHouse("");
    setGender("");
    setLevel("");
    setStatus("");
  };

  return (
    <>
      <Card className="p-4 shadow-xs mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Select value={house} onValueChange={(e) => setHouse(e)}>
            <SelectTrigger className="w-full lg:min-w-42.5">
              <SelectValue placeholder="Filter by house" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {filteredData.houses
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((hs) => (
                  <SelectItem value={hs.id} key={hs.id}>
                    {hs.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={gender} onValueChange={(e) => setGender(e)}>
            <SelectTrigger className="w-full lg:min-w-42.5">
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {filteredData.genders.map((gender) => (
                <SelectItem value={gender} key={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={(e) => setLevel(e)}>
            <SelectTrigger className="w-full lg:min-w-42.5">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {filteredData.levels.map((level) => (
                <SelectItem value={level} key={level}>
                  {toProperCase(level)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(e) => setStatus(e)}>
            <SelectTrigger className="w-full lg:min-w-42.5">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {filteredData.statuses.map((status) => (
                <SelectItem value={status} key={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={!house && !gender && !level && !status}
          type="button"
          variant="destructive"
          onClick={clearFilters}>
          <X className="size-5" />
          Clear Filters
        </Button>
      </Card>
      <DataTable
        filename={
          house
            ? `${filteredData.houses[0].name} Allocations`
            : "House Allocations"
        }
        transformer={exportHouseAllocationsTransformer}
        columns={columns}
        data={filteredAllocations}
        onDelete={async (rows) => {
          const rowIds = rows.map((r) => r.original.id);
          await Promise.try(async () => await mutateAsync(rowIds));
        }}
      />
    </>
  );
};
