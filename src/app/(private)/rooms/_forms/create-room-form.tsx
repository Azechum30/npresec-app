/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { RoomSchema, type RoomType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { Plus, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { housesQueryOptions } from "../../(admin)/admin/houses/queries";
import { roomsQueryOptions } from "../_actions/queries";

type CreateRoomFormProps = {
  onSubmitAction: (data: RoomType) => void;
  id?: string;
  isPending: boolean;
  defaultValues?: RoomType;
};

type GenderAggregate = { roomCount: number; bedCount: number };
type RoomAggregates = Record<"MALE" | "FEMALE", GenderAggregate>;

const GENDER_OPTIONS = ["MALE", "FEMALE", "BOTH"];

export const CreateRoomForm = ({
  onSubmitAction: onSubmit,
  id,
  isPending,
  defaultValues,
}: CreateRoomFormProps) => {
  const { dialogs } = useGenericDialog();
  const isOpen = !!dialogs["create-room"] || !!dialogs["edit-rooms"];

  const form = useForm<RoomType>({
    mode: "onSubmit",
    resolver: zodResolver(RoomSchema),
    defaultValues: defaultValues ?? {
      houseId: "",
      rmGender: undefined,
      capacity: 0,
    },
  });

  const [housesQueryData, roomsQueryData] = useQueries({
    queries: [
      { ...housesQueryOptions, enabled: isOpen },
      { ...roomsQueryOptions(), enabled: isOpen },
    ],
  });

  const selectedHouse = useWatch({ control: form.control, name: "houseId" });
  const bedCapacity = useWatch({ control: form.control, name: "capacity" });
  const houseGender = useWatch({ control: form.control, name: "rmGender" });

  const filteredHouse = useMemo(
    () =>
      housesQueryData.data?.find((house) => house.id === selectedHouse) ?? null,
    [housesQueryData.data, selectedHouse],
  );

  const currentRoomId = id ?? null;

  const aggregates = useMemo<RoomAggregates | null>(() => {
    if (!roomsQueryData.data) return null;
    const base: RoomAggregates = {
      MALE: { roomCount: 0, bedCount: 0 },
      FEMALE: { roomCount: 0, bedCount: 0 },
    };
    roomsQueryData.data.forEach((room) => {
      if (currentRoomId && room.id === currentRoomId) return;

      if (room.rmGender === "MALE" || room.rmGender === "BOTH") {
        base.MALE.roomCount += 1;
        base.MALE.bedCount += room.capacity;
      }
      if (room.rmGender === "FEMALE" || room.rmGender === "BOTH") {
        base.FEMALE.roomCount += 1;
        base.FEMALE.bedCount += room.capacity;
      }
    });
    return base;
  }, [roomsQueryData.data, currentRoomId]);

  useEffect(() => {
    if (!houseGender || !filteredHouse) {
      form.clearErrors("rmGender");
      return;
    }
    if (
      filteredHouse.houseGender !== "BOTH" &&
      filteredHouse.houseGender !== houseGender
    ) {
      form.setError("rmGender", {
        type: "validate",
        message:
          "The gender for this room does not apply to the selected house",
      });
      form.setFocus("rmGender", { shouldSelect: true });
      return;
    }
    form.clearErrors("rmGender");
  }, [houseGender, filteredHouse, form]);

  useEffect(() => {
    if (!filteredHouse || !houseGender) {
      form.clearErrors("capacity");
      return;
    }

    const { isDirty, dirtyFields } = form.formState;
    const numericBedCapacity = Number(bedCapacity) || 0;

    if (defaultValues && !dirtyFields.capacity) {
      form.clearErrors("capacity");
      return;
    }

    if (!isDirty && numericBedCapacity === 0) {
      form.clearErrors("capacity");
      return;
    }

    const plan =
      houseGender === "FEMALE"
        ? filteredHouse.occupancy.femaleOccupancy
        : filteredHouse.occupancy.maleOccupancy;

    if (!plan) {
      form.setError("capacity", {
        type: "validate",
        message: "House occupancy plan missing for the selected gender",
      });
      return;
    }

    const aggregatesForGender =
      houseGender === "FEMALE" ? aggregates?.FEMALE : aggregates?.MALE;

    const nextRoomCount = (aggregatesForGender?.roomCount ?? 0) + 1;
    if (typeof plan.roomCount === "number" && nextRoomCount > plan.roomCount) {
      form.setError("capacity", {
        type: "validate",
        message: "Room count limit reached for the selected gender",
      });
      return;
    }

    const nextBedTotals =
      (aggregatesForGender?.bedCount ?? 0) + numericBedCapacity;

    if (
      typeof plan.roomCapacity === "number" &&
      nextBedTotals > plan.roomCapacity
    ) {
      form.setError("capacity", {
        type: "validate",
        message: `Bed capacity currently exceeds the maximum capacity (${plan.roomCapacity}) specified for this gender`,
      });
      return;
    }

    form.clearErrors("capacity");
  }, [
    filteredHouse,
    houseGender,
    bedCapacity,
    aggregates,
    form,
    defaultValues,
  ]);

  if (housesQueryData.isLoading || roomsQueryData.isLoading) {
    return <ShowLoadingState />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded-md">
        <SelectWithLabel
          name="houseId"
          fieldTitle="House"
          data={housesQueryData.data ?? []}
          selectedKey="name"
          valueKey="id"
          schema={RoomSchema}
          placeholder="Select house that the room is assigned"
        />

        <SelectWithLabel
          name="rmGender"
          fieldTitle="Assigned Gender"
          data={GENDER_OPTIONS}
          schema={RoomSchema}
          placeholder="Select gender to which room is assigned"
        />

        <InputWithLabel
          name="capacity"
          fieldTitle="Bed Capacity"
          schema={RoomSchema}
          type="number"
          min={0}
        />

        <LoadingButton
          disabled={!form.formState.isValid || isPending}
          loading={isPending}>
          <span className="flex items-center gap-2">
            {id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {id
              ? isPending
                ? "Saving..."
                : "Update Room"
              : isPending
                ? "Creating..."
                : "Create Room"}
          </span>
        </LoadingButton>
      </form>
    </Form>
  );
};
