import {
  ClassesResponseType,
  CourseResponseType,
  DepartmentResponseType,
  StaffResponseType,
  StudentResponseType,
} from "@/lib/types";
import { create } from "zustand";

type CreateStoreProps<T, K extends keyof T> = {
  intialState: T[];
  setData: (data: T[]) => void;
  addData: (data: T) => void;
  deleteData: (id: string) => void;
  updateData: (id: string, data: T) => void;
  bulkAddData: (data: T[]) => void;
  bulkDeleteData: (ids: string[]) => void;
};

export const createStore = <T, K extends keyof T>(uniqueKey: K) => {
  return create<CreateStoreProps<T, K>>((set) => ({
    intialState: [],
    setData: (data) => set({ intialState: data }),
    addData: (data) =>
      set((state) => ({ intialState: [...state.intialState, data] })),
    deleteData: (id) =>
      set((state) => ({
        intialState: state.intialState.filter((item) => item[uniqueKey] !== id),
      })),
    updateData: (id, data) =>
      set((state) => ({
        intialState: state.intialState.map((item) =>
          item[uniqueKey] === id ? { ...item, ...data } : item
        ),
      })),
    bulkDeleteData: (ids) =>
      set((state) => ({
        intialState: state.intialState.filter(
          (item) => !ids.includes(item[uniqueKey] as string)
        ),
      })),
    bulkAddData: (data) =>
      set((state) => ({ intialState: [...state.intialState, ...data] })),
  }));
};

export const useClassesStore = createStore<ClassesResponseType, "code">("code");

export const useStaffStore = createStore<StaffResponseType, "employeeId">(
  "employeeId"
);

export const useDepartmentStore = createStore<DepartmentResponseType, "code">(
  "code"
);

export const useCourseStore = createStore<CourseResponseType, "code">("code");
export const useStudentDataStore = createStore<
  StudentResponseType,
  "studentNumber"
>("studentNumber");
