import { Row, Table } from "@tanstack/react-table";
import { FC } from "react";
import { Checkbox } from "../ui/checkbox";

type RowSelectionsProps = {
  table?: Table<any>;
  isHeader: boolean;
  row?: Row<any>;
};

export const RowSelections: FC<RowSelectionsProps> = ({
  table,
  isHeader,
  row,
}) => {
  return (
    <>
      <Checkbox
        checked={
          isHeader ? table?.getIsAllRowsSelected() : row?.getIsSelected()
        }
        onCheckedChange={
          isHeader
            ? () => table?.toggleAllRowsSelected()
            : () => row?.toggleSelected()
        }
      />
    </>
  );
};
