"use client";

import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const itemsPerPageOptions = [10, 25, 50, 100] as const;

export const ItemsPerPageSchema = z.object({
  itemsPerPage: z.union([
    z.literal(10),
    z.literal(25),
    z.literal(50),
    z.literal(100),
  ]),
});

export const ItemsPerPage = ({
  value,
  onPageSizeChangeAction,
}: {
  value: number;
  onPageSizeChangeAction?: (newPageSize: number) => void;
}) => {
  return (
    <Select
      value={String(value)}
      onValueChange={(value) => onPageSizeChangeAction?.(Number(value))}>
      <SelectTrigger>
        <SelectValue placeholder="Select the number of rows per page" />
      </SelectTrigger>
      <SelectContent align="center" position="popper">
        {itemsPerPageOptions.map((option) => (
          <SelectItem key={option} value={option.toString()}>
            {`${option} rows`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
