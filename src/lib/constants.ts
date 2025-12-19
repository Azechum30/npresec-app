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
