import { DataTableSkeleton } from "./DataTable-Skeleton";

export const FallbackComponent = () => {
  return (
    <DataTableSkeleton
      columnCount={7}
      cellWidths={["10rem", "10rem", "10rem", "6rem", "10rem", "6rem", "6rem"]}
      shrinkZero
      filterCount={2}
    />
  );
};
