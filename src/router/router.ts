import {
  createAllocation,
  deleteAllocation,
  deleteAllocations,
  getAllocation,
  getAllocations,
  studentsWithAllocations,
  updateAllocation,
} from "./allocation";
import {
  approveExeatRequest,
  confirmExeatDepartureOrReturnRequest,
  createExeatRequest,
  deleteExeatRequest,
  deleteExeatsRequest,
  getExeatRequest,
  getExeatsRequest,
  getStudentsToAssignExeatRequest,
  updateExeatRequest,
} from "./exeats";
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
import {
  createDocumentTemplate,
  deleteTemplate,
  deleteTemplates,
  getTemplateById,
  listTemplates,
  updateTemplate,
} from "./template";
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

  allocation: {
    createAllocation,
    getAllocations,
    getAllocation,
    deleteAllocation,
    deleteAllocations,
    updateAllocation,
    studentsWithAllocations,
  },

  exeat: {
    getStudentsToAssignExeatRequest,
    getExeatsRequest,
    createExeatRequest,
    getExeatRequest,
    updateExeatRequest,
    deleteExeatRequest,
    deleteExeatsRequest,
    approveExeatRequest,
    confirmExeatDepartureOrReturnRequest,
  },

  template: {
    createDocumentTemplate,
    listTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
    deleteTemplates,
  },

  user: {
    updatePassword: updatePassword,
  },
};
