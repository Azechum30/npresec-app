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
import { useDeleteExeatsRequestMutationFn } from "../_actions/mutations";
import { studentsExeatsRequestQueryOptions } from "../_actions/queries";
import { useGetExeatColumns } from "../_hooks/use-get-exeat-columns";

export const RenderStudentExeatsTable = () => {
  const { data } = useSuspenseQuery(studentsExeatsRequestQueryOptions);
  const columns = useGetExeatColumns();

  const { mutateAsync } = useDeleteExeatsRequestMutationFn();

  const [house, setHouse] = useState("");
  const [klass, setKlass] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const filters = useMemo(() => {
    if (!data) return { houses: [], classes: [], types: [], statuses: [] };
    const houses = [
      ...new Map(data.map((exeat) => [exeat.houseId, exeat.house])).values(),
    ];
    const classes = [
      ...new Map(
        data.map((exeat) => [exeat.classId, exeat.currentClass]),
      ).values(),
    ];
    const types = [...new Set(data.map((exeat) => exeat.type))].map(
      (exeat) => ({ id: exeat, name: toProperCase(exeat) }),
    );
    const statuses = [...new Set(data.map((exeat) => exeat.status))].map(
      (exeat) => ({ id: exeat, name: toProperCase(exeat) }),
    );

    return { houses, classes, types, statuses };
  }, [data]);

  const filterData = useMemo(() => {
    if (!data) return [];

    return data.filter((exeat) => {
      const matchesHouse = !house || exeat.houseId === house;
      const matchesClass = !klass || exeat.classId === klass;
      const matchesType = !type || exeat.type === type;
      const matchesStatus = !status || exeat.status === status;

      return matchesHouse && matchesClass && matchesType && matchesStatus;
    });
  }, [data, house, klass, type, status]);

  const clearFilters = () => {
    setHouse("");
    setKlass("");
    setType("");
    setStatus("");
  };

  return (
    <>
      <Card className="shadow-xs p-4 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Select value={house} onValueChange={(e) => setHouse(e)}>
            <SelectTrigger className="lg:min-w-45.5">
              <SelectValue placeholder="filter by house" />
            </SelectTrigger>
            <SelectContent align="center" position="popper" className="w-fit">
              {filters.houses.map((hs) => (
                <SelectItem key={hs.id} value={hs.id}>
                  {hs.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={klass} onValueChange={(e) => setKlass(e)}>
            <SelectTrigger className="lg:min-w-45.5">
              <SelectValue placeholder="filter by class" />
            </SelectTrigger>
            <SelectContent align="center" position="popper" className="w-fit">
              {filters.classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(e) => setType(e)}>
            <SelectTrigger className="lg:min-w-45.5">
              <SelectValue placeholder="filter by exeat type" />
            </SelectTrigger>
            <SelectContent align="center" position="popper" className="w-fit">
              {filters.types.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(e) => setStatus(e)}>
            <SelectTrigger className="lg:min-w-45.5">
              <SelectValue placeholder="filter by status" />
            </SelectTrigger>
            <SelectContent align="center" position="popper" className="w-fit">
              {filters.statuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="destructive"
          disabled={!house && !klass && !type && !status}
          onClick={clearFilters}>
          <X className="size-5" />
          Clear Filters
        </Button>
      </Card>
      <DataTable
        columns={columns}
        data={filterData}
        onDelete={async (rows) => {
          const rowIds = rows.map((row) => row.original.id);
          await Promise.try(async () => await mutateAsync(rowIds));
        }}
      />
    </>
  );
};
