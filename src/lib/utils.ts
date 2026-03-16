import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GRADING_SCALE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGradeInfo = (score: number) =>
  GRADING_SCALE.find((grade) => score >= grade.min) ||
  GRADING_SCALE[GRADING_SCALE.length - 1];
