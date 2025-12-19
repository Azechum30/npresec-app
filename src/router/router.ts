import {
  bulkdeleteHouses,
  createHouse,
  deleteHouse,
  getHouseById,
  getHouses,
  updateHouse,
} from "./house";
import { getStaff } from "./staff";
import { createRoom, getRooms } from "./room";

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
  },
};
