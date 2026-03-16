import { DateFormatType, RoomType } from "@/lib/validation";

export const createRoomsDataTransformer =
  (dateFormat: DateFormatType) =>
  (room: RoomType & { house: { id: string; name: string }; code: string }) => ({
    "Room Code": room.code,
    "Assigned House": room.house.name,
    "Assigned Gender":
      room?.rmGender!.charAt(0) + room?.rmGender!.slice(1).toLowerCase(),
    "Bed Capacity": room.capacity,
  });
