import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Route } from "next";

export default function SearchComponent() {
  const router = useRouter();
  const pathname = usePathname().split("/").pop();
  const [query, setQuery] = useState<string>("");

  function handleSubmit(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value.trim() ?? undefined;
    setQuery(q);

    if (q === undefined || q === "") {
      router.push(pathname?.split("?")[0] as Route);
    }
    router.push(`/${pathname}?q=${q}` as Route);
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative">
      <Input
        name="q"
        placeholder="Search"
        className="pe-4"
        value={query}
        onChange={handleSubmit}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center gap-x-1">
        <Search className="size-4 " />
      </span>
    </form>
  );
}
