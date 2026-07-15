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
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FilterX } from "lucide-react";
import { useMemo, useState } from "react";
import { useDeleteRoomsMutationFn } from "../_actions/mutations";
import { roomsQueryOptions } from "../_actions/queries";
import { useGetRoomsColumns } from "../_hooks/use-get-rooms-columns";
import { createRoomsDataTransformer } from "../_utils/rooms-transformer";
import { RoomDetailsComponent } from "./room-details-component";

export const RenderRoomDataTable = () => {
  const columns = useGetRoomsColumns();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const roomsTransformer = useMemo(
    () => createRoomsDataTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const { mutateAsync } = useDeleteRoomsMutationFn();

  const handleRoomsDeleteByIds = async (ids: string[]) => {
    Promise.try(async () => await mutateAsync({ ids }));
  };

  const [houseId, setShouseId] = useState("");
  const [gender, setGender] = useState("");

  const { data } = useSuspenseQuery(roomsQueryOptions(houseId));

  const houses = useMemo(() => {
    if (!data) return [];

    return [
      ...new Map(
        data.map((rm) => [rm.houseId, { id: rm.houseId, name: rm.house.name }]),
      ).values(),
    ];
  }, [data]);

  const genders = useMemo(() => {
    if (!data) return [];

    return [
      ...new Set(
        data.map((rm) => rm.rmGender).filter((rm) => rm !== undefined),
      ),
    ];
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((rm) => {
      const matchesGender = !gender || rm.rmGender === gender;

      return matchesGender;
    });
  }, [data, gender]);

  const hasFilters = !!houseId || !!gender;

  const clearFilters = () => {
    setShouseId("");
    setGender("");
  };

  return (
    <>
      <Card className="shadow-lg p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={houseId} onValueChange={(e) => setShouseId(e)}>
            <SelectTrigger
              type="button"
              aria-label="filter rooms by houses"
              className="h-9 w-full sm:w-auto">
              <SelectValue placeholder="Filter by house" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {houses.map((hs) => (
                <SelectItem key={hs.id} value={hs.id as string}>
                  {hs.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={gender} onValueChange={(e) => setGender(e)}>
            <SelectTrigger
              type="button"
              aria-label="filter rooms by gender"
              className="h-9 w-full sm:w-auto">
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {genders.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
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
        filename={
          houseId ? `${filteredData[0].house.name} Rooms List` : "rooms-list"
        }
        transformer={roomsTransformer}
        exportKey="rooms"
        data={filteredData}
        columns={columns}
        onDelete={async (rows) => {
          const rowIds = rows.map((row) => row.original.id);
          await handleRoomsDeleteByIds(rowIds);
        }}
        renderSubComponent={(row) => <RoomDetailsComponent row={row} />}
      />
    </>
  );
};
