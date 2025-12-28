"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { client } from "@/lib/orpc";
import { createSafeClient } from "@orpc/client";
import { useEffect, useMemo, useState } from "react";

export const FilterByHouseId = () => {
  const [houses, setHouses] = useState<Awaited<
    ReturnType<typeof client.house.getHouses>
  > | null>(null);

  const safeClient = useMemo(() => createSafeClient(client), []);
  useEffect(() => {
    const fetchHouses = async () => {
      const { data } = await safeClient.house.getHouses();

      if (data) {
        setHouses(data);
      }
    };

    fetchHouses();
  }, [safeClient.house]);

  const handleSearch = () => {};

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="--Select House--" />
      </SelectTrigger>
      <SelectContent>
        {houses &&
          houses.map((house) => (
            <SelectItem key={house.id} value={house.id}>
              {house.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
