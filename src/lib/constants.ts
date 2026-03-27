import { Column, Row, Table } from "@tanstack/react-table";
import { DateFormatType } from "./validation";

export const steps = [
  { title: "Personal", step: 1 },
  { title: "Academic", step: 2 },
  { title: "Guardian", step: 3 },
  { title: "Review", step: 4 },
];

export const Levels = ["Year_One", "Year_Two", "Year_Three"] as const;

export type ComponentProps = {
  table?: Table<any>;
  isHeader: boolean;
  row?: Row<any>;
  column?: Column<any>;
  title?: string;
};

export const formatMap = {
  "DD/MM/YYYY": {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  } as Intl.DateTimeFormatOptions,
  "MM/DD/YYYY": {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  } as Intl.DateTimeFormatOptions,
  "YYYY-MM-DD": {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  } as Intl.DateTimeFormatOptions,
  "DD MMM YYYY": {
    day: "2-digit",
    month: "short",
    year: "numeric",
  } as Intl.DateTimeFormatOptions,
};

export const localeMap: Record<DateFormatType, string> = {
  "DD/MM/YYYY": "en-GB",
  "MM/DD/YYYY": "en-US",
  "YYYY-MM-DD": "en-CA",
  "DD MMM YYYY": "en-GB",
};

export const RANKS = {
  teaching: [
    "Senior Superintendent II",
    "Senior Superintendent I",
    "Principal Superintendent (PS)",
    "Assistant Director II (AD II)",
    "Assistant Director I (AD I)",
    "Deputy Director",
    "Director II",
    "Director I",
    "Deputy Director-General",
    "Director-General",
  ],

  administrative: [
    "Chief Accountant",
    "Chief Accountant II",
    "Deputy Chief Accountant",
    "Deputy Chief Accountant II",
    "Principal Accountant (Chartered)",
    "Principal Accountant (Unit Head)",
    "Principal Accountant (Base Grade)",
    "Senior Accountant",
    "Accountant",
    "Assistant Accountant",
    "Chief Administrative Officer",
    "Chief Administrative Officer II",
    "Deputy Chief Administrative Officer",
    "Deputy Chief Administrative Officer II",
    "Principal Administrative Officer (Chartered)",
    "Principal Administrative Officer (Unit Head)",
    "Principal Administrative Officer (Base Grade)",
    "Senior Administrative Officer",
    "Administrative Officer",
    "Chief Supply Officer",
    "Deputy Chief Supply Officer",
    "Principal Supply Officer (Base Grade)",
    "Senior Supply Officer",
    "Supply Officer",
    "Assistant Supply Officer",
    "Chief Private Secretary",
    "Deputy Chief Private Secretary",
    "Principal Private Secretary",
    "Senior Private Secretary",
    "Private Secretary",
    "Assistant Private Secretary",
    "Chief Driver",
    "Deputy Chief Driver",
    "Principal Dirver",
    "Senior Driver",
    "Driver",
    "Assistant Driver",
    "Chief Security Officer",
    "Deputy Security Officer",
    "Principal Security Officer",
    "Senior Security Officer",
    "Security Officer",
    "Assistant Security Officer",
    "Chief Librarian",
    "Deputy Chief Librarian",
    "Principal Librarian",
    "Senior Librarian",
    "Librarian",
    "Assistant Librarian",
  ],
};

export const ASSESSMENT_WEIGHTS: Record<string, number> = {
  Assignment: 0.1,
  Midterm: 0.3,
  Project: 0.2,
  Examination: 0.4,
};

export const GRADING_SCALE = [
  { min: 80, letter: "A1", point: 4.0 },
  { min: 70, letter: "B2", point: 3.5 },
  { min: 60, letter: "B3", point: 3.0 },
  { min: 55, letter: "C4", point: 2.5 },
  { min: 50, letter: "C5", point: 2.0 },
  { min: 45, letter: "C6", point: 1.5 },
  { min: 40, letter: "D7", point: 1.0 },
  { min: 35, letter: "E8", point: 0.5 },
  { min: 0, letter: "F9", point: 0.0 },
];
export const GRADING_SYSTEM = [
  { range: "80 - 100", grade: "A1", remark: "Excellent" },
  { range: "70 - 79", grade: "B2", remark: "Very Good" },
  { range: "60 - 69", grade: "B3", remark: "Good" },
  { range: "55 - 59", grade: "C4", remark: "Credit" },
  { range: "50 - 54", grade: "C5", remark: "Credit" },
  { range: "45 - 49", grade: "C6", remark: "Credit" },
  { range: "40 - 44", grade: "D7", remark: "Pass" },
  { range: "35 - 39", grade: "E8", remark: "Pass" },
  { range: "00 - 34", grade: "F9", remark: "Fail" },
];

export const getGradeInfo = (score: number) =>
  GRADING_SCALE.find((grade) => score >= grade.min) ||
  GRADING_SCALE[GRADING_SCALE.length - 1];
