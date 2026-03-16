import {
  bulkdeleteHouses,
  createHouse,
  deleteHouse,
  getHouseById,
  getHouses,
  updateHouse,
} from "./house";
import {
  createRoom,
  deleteRoomById,
  deleteRoomsByIds,
  getRoomById,
  getRooms,
  updateRoomById,
} from "./room";
import { getStaff } from "./staff";
import { updatePassword } from "./user";

export const router = {
  house: {
    createHouse: createHouse,
    getHouses: getHouses,
    deleteHouse: deleteHouse,
    getHouseById: getHouseById,
    updateHouse: updateHouse,
    bulkDeleteHouses: bulkdeleteHouses,
  },
  staff: {
    getStaff: getStaff,
  },
  room: {
    createRoom: createRoom,
    getRooms: getRooms,
    getRoomById: getRoomById,
    updateRoomById: updateRoomById,
    deleteRoomById: deleteRoomById,
    deleteRoomsByIds: deleteRoomsByIds,
  },
  user: {
    updatePassword: updatePassword,
  },
};
