"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { client } from "@/lib/orpc";
import { RoomSchema, RoomType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

type CreateRoomFormProps = {
  onSubmit: (data: RoomType) => void;
  id?: string;
  isPending: boolean;
  defaultValues?: RoomType;
};

export const CreateRoomForm = ({
  onSubmit,
  id,
  isPending,
  defaultValues,
}: CreateRoomFormProps) => {
  const safeClient = useMemo(() => createSafeClient(client), []);
  const form = useForm<RoomType>({
    mode: "onBlur",
    resolver: zodResolver(RoomSchema),
    defaultValues: defaultValues ?? {
      houseId: "",
      rmGender: undefined,
      capacity: 0,
    },
  });

  const [houses, setHouses] = useState<Awaited<
    ReturnType<typeof client.house.getHouses>
  > | null>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      const { error, data } = await safeClient.house.getHouses();

      if (isDefinedError(error)) {
        toast.error(error.message);
        return;
      } else if (error) {
        toast.error(error.message);
        return;
      } else {
        setHouses(data);
      }
    };

    fetchHouses();
  }, [safeClient]);

  const selectedHouse = useWatch({
    control: form.control,
    name: "houseId",
  });

  const bedCapacity = useWatch({
    control: form.control,
    name: "capacity",
  });

  const houseGender = useWatch({
    control: form.control,
    name: "rmGender",
  });

  const [filteredHouse, setFilteredHouse] = useState<Awaited<
    ReturnType<typeof client.house.getHouseById>
  > | null>(null);

  type GenderAggregate = { roomCount: number; bedCount: number };
  type RoomAggregates = Record<"MALE" | "FEMALE", GenderAggregate>;
  type RoomRecord = RoomType & {
    id: string;
    house: { id: string; name: string };
  };

  const [roomAggregates, setRoomAggregates] = useState<RoomAggregates | null>(
    null
  );

  useEffect(() => {
    const nextHouse =
      houses?.find((house) => house.id === selectedHouse) ?? null;
    setFilteredHouse(nextHouse);

    if (!houseGender || !nextHouse) {
      form.clearErrors("rmGender");
      return;
    }

    if (
      nextHouse.houseGender !== "BOTH" &&
      nextHouse.houseGender !== houseGender
    ) {
      form.setError("rmGender", {
        type: "validate",
        message:
          "The gender for this room does not apply to the selected house",
      });
      form.setFocus("rmGender", {
        shouldSelect: true,
      });
      return;
    }

    form.clearErrors("rmGender");
  }, [selectedHouse, houseGender, houses, form]);

  useEffect(() => {
    if (!selectedHouse) {
      setRoomAggregates(null);
      return;
    }

    let isMounted = true;

    const fetchRooms = async () => {
      const roomClient = (
        safeClient as typeof safeClient & {
          room: {
            getRooms: (input: { houseId?: string }) => Promise<{
              data?: RoomRecord[];
              error?: { message?: string };
            }>;
          };
        }
      ).room;

      const { error, data } = await roomClient.getRooms({
        houseId: selectedHouse,
      });

      if (!isMounted) return;

      if (isDefinedError(error)) {
        toast.error(error.message);
        setRoomAggregates(null);
        return;
      } else if (error) {
        toast.error(error.message);
        setRoomAggregates(null);
        return;
      }

      const base: RoomAggregates = {
        MALE: { roomCount: 0, bedCount: 0 },
        FEMALE: { roomCount: 0, bedCount: 0 },
      };

      data?.forEach((room: RoomRecord) => {
        if (room.rmGender === "MALE" || room.rmGender === "BOTH") {
          base.MALE.roomCount += 1;
          base.MALE.bedCount += room.capacity;
        }

        if (room.rmGender === "FEMALE" || room.rmGender === "BOTH") {
          base.FEMALE.roomCount += 1;
          base.FEMALE.bedCount += room.capacity;
        }
      });

      setRoomAggregates(base);
    };

    fetchRooms();

    return () => {
      isMounted = false;
    };
  }, [selectedHouse, safeClient]);

  useEffect(() => {
    if (!filteredHouse || !houseGender) {
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
      houseGender === "FEMALE" ? roomAggregates?.FEMALE : roomAggregates?.MALE;

    const nextRoomCount = (aggregatesForGender?.roomCount ?? 0) + 1;
    if (typeof plan.roomCount === "number" && nextRoomCount > plan.roomCount) {
      form.setError("capacity", {
        type: "validate",
        message: "Room count limit reached for the selected gender",
      });
      return;
    }

    const nextBedTotals = (aggregatesForGender?.bedCount ?? 0) + bedCapacity;
    if (
      typeof plan.roomCapacity === "number" &&
      nextBedTotals > plan.roomCapacity
    ) {
      form.setError("capacity", {
        type: "validate",
        message:
          "Bed capacity currently exceeds the capacity specified for this gender",
      });
      return;
    }

    form.clearErrors("capacity");
  }, [filteredHouse, houseGender, bedCapacity, roomAggregates, form]);

  const handleSubmit = (data: RoomType) => {
    onSubmit(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 border p-4 rounded-md">
          <SelectWithLabel
            name="houseId"
            fieldTitle="House"
            data={houses ?? []}
            selectedKey="name"
            valueKey="id"
            schema={RoomSchema}
            placeholder="Select house that the room is assigned"
          />

          <SelectWithLabel
            name="rmGender"
            fieldTitle="Assigned Gender"
            data={["MALE", "FEMALE", "BOTH"]}
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
            loading={isPending as boolean}>
            {id ? (
              <>
                {isPending ? (
                  <>
                    <Save /> Saving...
                  </>
                ) : (
                  <>
                    <Save /> Update Room
                  </>
                )}
              </>
            ) : (
              <>
                {isPending ? (
                  <>
                    <Plus /> Creating...
                  </>
                ) : (
                  <>
                    <Plus /> Create Room
                  </>
                )}
              </>
            )}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
