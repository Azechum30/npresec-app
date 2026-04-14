import { steps } from "@/lib/constants";
import {
  AcademicHistoryType,
  BioDataType,
  Gender,
  ParentOrGuardianType,
  ProgramSelectionType,
  StudentEnrollmentType,
} from "@/lib/validation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type StudentEnrollmentStoreProps = {
  currentStep: number;
  studentId: string | null;
  bioData: BioDataType;
  academicHistory: AcademicHistoryType;
  parentOrGuardian: ParentOrGuardianType;
  programmeSelection: ProgramSelectionType;
  actions: {
    setCurrentStep: (step: number) => void;
    prevStep: () => void;
    nextStep: () => void;
    setBioData: (data: Partial<BioDataType>) => void;
    setAcademicHistory: (data: Partial<AcademicHistoryType>) => void;
    setParentOrGuardian: (data: Partial<ParentOrGuardianType>) => void;
    setProgrammeSelection: (data: Partial<ProgramSelectionType>) => void;
    resetForm: () => void;
    loadData: (data: StudentEnrollmentType & { id: string }) => void;
    getData: () => {
      bioData: BioDataType;
      academicHistory: AcademicHistoryType;
      parentOrGuardianInfo: ParentOrGuardianType;
      programmeSelection: ProgramSelectionType;
    } & { id: string };
  };
};

const customStorage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    if (item) {
      try {
        const data = JSON.parse(item);
        if (data.state?.bioData?.birthDate) {
          data.state.bioData.birthDate = new Date(data.state.bioData.birthDate);
        }

        if (data.state?.bioData?.gender) {
          data.state.bioData.gender = data.state.bioData.gender as Gender;
        }

        return data;
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

export const useStudentEnrollmentStore = create<StudentEnrollmentStoreProps>()(
  persist(
    (set, get) => {
      const initialState = {
        bioData: {
          lastName: "",
          otherNames: "",
          birthDate: new Date(),
          gender: "",
          phone: "",
          email: "",
          hometown: "",
          primaryAddress: "",
        } satisfies BioDataType,
        academicHistory: {
          enrollmentCode: "",
          jhsIndexNumber: "",
          jhsAttended: "",
          aggregateScore: undefined,
          district: "",
          schoolLocation: "",
          schoolRegion: "",
        } satisfies AcademicHistoryType,
        parentOrGuardian: {
          guardianEmail: "",
          guardianName: "",
          guardianPhoneNumber: "",
          guardianRelation: "",
        } satisfies ParentOrGuardianType,
        programmeSelection: {
          classId: "",
          programme: "",
          className: "",
          departmentId: "",
        } satisfies ProgramSelectionType,
      };

      return {
        currentStep: 1,
        studentId: null,
        ...initialState,
        actions: {
          setCurrentStep: (step) => {
            set({ currentStep: step });
          },
          nextStep: () => {
            const { currentStep } = get();

            if (currentStep < steps.length + 1) {
              set((state) => ({
                ...state,
                currentStep: state.currentStep + 1,
              }));
            }
          },
          prevStep: () => {
            const { currentStep } = get();

            if (currentStep > 1) {
              set((state) => ({
                ...state,
                currentStep: state.currentStep - 1,
              }));
            }
          },
          setBioData: (data) => {
            set((state) => ({
              ...state,
              bioData: { ...state.bioData, ...data },
            }));
          },
          setAcademicHistory: (data) => {
            set((state) => ({
              ...state,
              academicHistory: { ...state.academicHistory, ...data },
            }));
          },
          setParentOrGuardian: (data) => {
            set((state) => ({
              ...state,
              parentOrGuardian: { ...state.parentOrGuardian, ...data },
            }));
          },
          setProgrammeSelection: (data) => {
            set((state) => ({
              ...state,
              programmeSelection: { ...state.programmeSelection, ...data },
            }));
          },
          getData: () => ({
            id: get().studentId || "",
            academicHistory: { ...get().academicHistory },
            bioData: { ...get().bioData },
            parentOrGuardianInfo: { ...get().parentOrGuardian },
            programmeSelection: { ...get().programmeSelection },
          }),

          loadData: (student) => {
            set((state) => ({
              ...state,
              currentStep: 1,
              studentId: student.id,
              bioData: {
                lastName: student.lastName,
                otherNames: student.otherNames,
                gender: student.gender,
                email: student.email,
                birthDate: student.birthDate,
                hometown: student.hometown,
                phone: student.phone,
                primaryAddress: student.primaryAddress,
              } satisfies BioDataType,
              academicHistory: {
                enrollmentCode: student.enrollmentCode,
                jhsAttended: student.jhsAttended,
                jhsIndexNumber: student.jhsIndexNumber,
                aggregateScore: student.aggregateScore,
                district: student.district,
                schoolLocation: student.schoolLocation,
                schoolRegion: student.schoolRegion,
              } satisfies AcademicHistoryType,
              parentOrGuardian: {
                guardianName: student.guardianName,
                guardianRelation: student.guardianRelation,
                guardianEmail: student.guardianEmail,
                guardianPhoneNumber: student.guardianPhoneNumber,
              } satisfies ParentOrGuardianType,
              programmeSelection: {
                classId: student.classId,
                programme: student.programme,
                className: student.className,
                departmentId: student.departmentId,
              } satisfies ProgramSelectionType,
            }));
          },

          resetForm: () => {
            localStorage.removeItem("student-enrollment-form");
            set(() => ({ ...initialState, currentStep: 1, studentId: null }));
          },
        },
      };
    },
    {
      name: "student-enrollment-form",
      storage: customStorage,
      partialize: (state) => {
        const { actions, ...persistedState } = state;
        return persistedState;
      },
    },
  ),
);
