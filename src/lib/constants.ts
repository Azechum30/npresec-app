import { Column, Row, Table } from "@tanstack/react-table";

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
