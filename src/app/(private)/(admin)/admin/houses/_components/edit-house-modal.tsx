/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { HouseType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CreateHouseForm } from "../_forms/create-house";
import { useUpdateHouseMutationFn } from "../mutations";
import { getHouseQueryOptions } from "../queries";

export const EditHouseModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateHouseMutationFn();
  const router = useRouter();

  const validId = id ?? null;
  const isOpen = !!dialogs["edit-house"];
  const { data } = useQuery({
    ...getHouseQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleHouseUpdate = (data: HouseType) => {
    Promise.try(async () => {
      await mutateAsync({ id: id as string, ...data });
      onClose("edit-house");
      router.refresh();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-house")}>
      <DialogContent>
        {isOpen && validId && data ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit House Profile</DialogTitle>
              <DialogDescription>
                Kindly make changes and save in realtime
              </DialogDescription>
            </DialogHeader>
            <CreateHouseForm
              onSubmit={handleHouseUpdate}
              isPending={isPending}
              defaultValues={{
                houseGender: data.houseGender,
                houseMasterId: data.houseMasterId,
                name: data.name,
                occupancy: data.occupancy,
                residencyType: data.residencyType,
              }}
              id={validId}
            />
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle> Data is Loading...</DialogTitle>
              <DialogDescription>
                Kindly wait while data is loading
              </DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
