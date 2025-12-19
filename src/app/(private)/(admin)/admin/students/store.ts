import { steps } from "@/lib/constants";
import {
  AcademicInfoType,
  GuardianInfoType,
  PersonalInfoType,
  status,
  StudentType,
} from "@/lib/validation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  setItem: (name: string, value: any) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};

type StudentStoreProps = {
  currentStep: number;
  isEditing: boolean;
  studentId: string | null;
  personalInfo: PersonalInfoType;
  academicInfo: AcademicInfoType;
  guardianInfo: GuardianInfoType;
  actions: {
    setCurrentStep: (step: number) => void;
    NextStep: () => void;
    PrevStep: () => void;
    setPersonalInfo: (data: Partial<PersonalInfoType>) => void;
    setAcademicInfo: (data: Partial<AcademicInfoType>) => void;
    setGuardianInfo: (data: Partial<GuardianInfoType>) => void;
    loadStudentData: (student: StudentType & { id: string }) => void;
    resetForm: () => void;
    getStudentData: () => StudentType & { id: string };
  };
};

export const useStudentStore = create<StudentStoreProps>()(
  persist(
    (set, get) => {
      const initialState = {
        personalInfo: {
          firstName: "",
          lastName: "",
          middleName: "",
          birthDate: new Date(),
          gender: "",
          email: "",
          phone: "",
          address: "",
          nationality: "",
          religion: "",
          photoURL: "",
        },
        academicInfo: {
          classId: "",
          dateEnrolled: new Date(),
          graduationDate: undefined,
          currentLevel: "",
          status: "Active" as (typeof status)[number],
          departmentId: "",
          previousSchool: "",
        },
        guardianInfo: {
          guardianName: "",
          guardianPhone: "",
          guardianEmail: "",
          guardianAddress: "",
          guardianRelation: "",
        },
      };

      return {
        currentStep: 1,
        isEditing: false,
        studentId: null,
        ...initialState,
        actions: {
          setCurrentStep: (step) => {
            set({ currentStep: step });
          },
          NextStep: () => {
            const { currentStep } = get();
            if (currentStep < steps.length) {
              set((state) => ({
                ...state,
                currentStep: state.currentStep + 1,
              }));
            }
          },
          PrevStep: () => {
            const { currentStep } = get();
            if (currentStep > 1) {
              set((state) => ({
                ...state,
                currentStep: state.currentStep - 1,
              }));
            }
          },
          setPersonalInfo: (data) =>
            set((state) => ({
              ...state,
              personalInfo: { ...state.personalInfo, ...data },
            })),
          setAcademicInfo: (data) =>
            set((state) => ({
              ...state,
              academicInfo: { ...state.academicInfo, ...data },
            })),
          setGuardianInfo: (data) =>
            set((state) => ({
              ...state,
              guardianInfo: { ...state.guardianInfo, ...data },
            })),
          loadStudentData: (student) =>
            set((state) => ({
              ...state,
              isEditing: true,
              studentId: student.id,
              currentStep: 1,
              personalInfo: {
                firstName: student.firstName,
                lastName: student.lastName,
                middleName: student.middleName,
                birthDate: student.birthDate,
                gender: student.gender,
                email: student.email,
                phone: student.phone,
                nationality: student.nationality,
                religion: student.religion,
                address: student.address,
                photoURL: student.photoURL,
              },
              academicInfo: {
                currentLevel: student.currentLevel,
                dateEnrolled: student.dateEnrolled,
                status: student.status,
                previousSchool: student.previousSchool,
                departmentId: student.departmentId,
                graduationDate: student.graduationDate,
                classId: student.classId,
              },
              guardianInfo: {
                guardianName: student.guardianName,
                guardianPhone: student.guardianPhone,
                guardianRelation: student.guardianRelation,
                guardianAddress: student.guardianAddress,
                guardianEmail: student.guardianEmail,
              },
            })),
          resetForm: () => {
            localStorage.removeItem("student-form-store");
            set({ ...initialState, currentStep: 1, isEditing: false });
          },
          getStudentData: () => ({
            id: get().studentId || "",
            ...get().personalInfo,
            ...get().academicInfo,
            ...get().guardianInfo,
          }),
        },
      };
    },
    {
      name: "student-form-store",
      storage: customStorage,
      partialize: (state) => {
        const { actions, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);

export const useCurrentStep = () =>
  useStudentStore((state) => state.currentStep);
export const usePersonalInfo = () =>
  useStudentStore((state) => state.personalInfo);
export const useAcademicInfo = () =>
  useStudentStore((state) => state.academicInfo);
export const useGuardianInfo = () =>
  useStudentStore((state) => state.guardianInfo);
export const useStudentStoreActions = () =>
  useStudentStore((state) => state.actions);
