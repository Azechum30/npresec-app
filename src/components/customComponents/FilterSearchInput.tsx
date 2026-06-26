/**biome-ignore-all assist/source/organizeImports: reason */
import { cn } from "@/lib/utils";
import type { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

type FilterSearchInputProps = {
  table: Table<any>;
  className?: string;
};

export default function FilterSearchInput({
  table,
  className,
}: FilterSearchInputProps) {
  const [filter, setFilter] = useState<string>("");
  const pathname = usePathname().split("/").pop();

  useEffect(() => {
    const handleSearch = setTimeout(() => {
      table.setGlobalFilter(filter);
    }, 1000);

    return () => clearTimeout(handleSearch);
  }, [filter, table]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  return (
    <div className={cn("relative w-full ", className)}>
      <Input
        placeholder={`Search ${pathname === "teachers" ? "Students" : pathname}`}
        className="w-full pe-8"
        onChange={handleChange}
      />
      <SearchIcon className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground size-5 z-10" />
    </div>
  );
}
