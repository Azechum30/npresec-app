import { prisma } from "@/lib/prisma";
import { RoomSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedRooms = async (houseId?: string) => {
  "use cache";
  cacheTag("rooms-list");
  cacheLife("max");

  const rooms = await prisma.room.findMany({
    where: houseId ? { houseId } : {},
    select: RoomSelect,
  });

  return rooms;
};
