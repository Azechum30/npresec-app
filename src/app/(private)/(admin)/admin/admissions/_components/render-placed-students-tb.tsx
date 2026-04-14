"use client";

import DataTable from "@/components/customComponents/data-table";
import { Notification } from "@/components/customComponents/notification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { PlacementListType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReactNode, useMemo } from "react";
import { toast } from "sonner";
import z from "zod";
import { bulkDeletePlacedStudentsByIds } from "../_actions/server-only-actions";
import { useGetAdmittedStudentsColumns } from "../_hooks/use-get-admitted-students-columns ";
import { useGetPlacedStudentsColumns } from "../_hooks/use-get-placed-students-columns";
import { admittedListTransformer } from "../_utils/admitted-list-transformer";
import { placementListTransformer } from "../_utils/placement-list-transformer";

type Props = {
  data?: PlacementListType[];
};

export const RenderPlacedStudentsTb = ({ data }: Props) => {
  const columns = useGetPlacedStudentsColumns();
  const registeredColumns = useGetAdmittedStudentsColumns();
  const { preferredDateFormat } = useUserPreferredDateFormat();

  const placementTransformer = useMemo(
    () => placementListTransformer(preferredDateFormat),
    [preferredDateFormat],
  );
  const admittedTransformer = useMemo(
    () => admittedListTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const handleBulkPlacementDelete = async (ids: z.ZodCUID[]) => {
    const { error, success, count } = await bulkDeletePlacedStudentsByIds(ids);

    if (error) {
      return toast.error(error);
    }

    if (success && count) {
      return toast.success(`${count} placed student(s) has/have been removed`);
    }
  };

  const registered = data
    ? data.filter((student) => student.admissionStatus === "ADMITTED")
    : [];
  const unregistered = data
    ? data.filter((student) => student.admissionStatus === "PENDING")
    : [];

  return (
    <>
      {data && data.length > 0 ? (
        <TabsSwitch
          registeredCount={registered.length}
          unregisteredCount={unregistered.length}
          registered={
            <DataTable
              data={registered}
              columns={registeredColumns}
              transformer={admittedTransformer}
              filename="admitted-list"
              onDelete={async (rows) => {
                const ids = rows.map((row) => row.original.id);
                await handleBulkPlacementDelete(
                  ids as (typeof z.ZodCUID.prototype)[],
                );
              }}
            />
          }
          unregistered={
            <DataTable
              data={unregistered}
              columns={columns}
              transformer={placementTransformer}
              filename="placement-list"
              showImportButton={true}
              onDelete={async (rows) => {
                const ids = rows.map((row) => row.original.id);
                await handleBulkPlacementDelete(
                  ids as (typeof z.ZodCUID.prototype)[],
                );
              }}
            />
          }
        />
      ) : (
        <Notification description="No student found in the placement list" />
      )}
    </>
  );
};

type TabsProps = {
  unregisteredCount: number;
  unregistered: ReactNode;
  registered: ReactNode;
  registeredCount: number;
};

const TabsSwitch = ({
  unregistered,
  unregisteredCount = 0,
  registered,
  registeredCount = 0,
}: TabsProps) => {
  return (
    <Tabs defaultValue="unregistered" className="w-full">
      <TabsList
        className="group-data-[variant=line]/tabs-list w-full justify-start rounded-none border-b-2 bg-transparent p-0 h-auto"
        data-variant="line">
        <TabsTrigger
          className={cn(
            "data-active:bg-transparent data-active:shadow-none",
            "h-11.5 hover:cursor-pointer relative rounded-none border-none px-4 pb-3 pt-2 font-semibold transition-none",
            "data-active:border-foreground data-active:text-foreground",
          )}
          value="registered">
          Registered ({registeredCount})
        </TabsTrigger>
        <TabsTrigger
          className={cn(
            "data-active:bg-transparent data-active:shadow-none",
            "relative hover:cursor-pointer h-11.5 rounded-none border-none px-4 pb-3 pt-2 font-semibold transition-none",
            "data-active:border-foreground data-active:text-foreground",
          )}
          value="unregistered">
          Unregistered ({unregisteredCount})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="registered">{registered}</TabsContent>
      <TabsContent value="unregistered">{unregistered}</TabsContent>
    </Tabs>
  );
};
