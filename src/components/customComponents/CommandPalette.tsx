"use client";
import { useOpenCommandPalette } from "@/hooks/use-open-command-palette";
import { File } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useAuth } from "./SessionProvider";
import { Links } from "./Sidebar";

export default function CommandPalette() {
  const { open, onClose } = useOpenCommandPalette();
  const router = useRouter();
  const user = useAuth();

  const role =
    user?.roles?.flatMap((r) => (r.role?.name ? [r.role.name] : []))?.[0] ||
    "student";

  const handleCommand = (value: string) => {
    onClose();
    router.push(value as Route);
  };

  const links =
    role === "admin"
      ? Links.ADMIN
      : role === "teaching_staff"
        ? Links.TEACHING_STAFF
        : Links.STUDENT;

  return (
    <CommandDialog open={open} onOpenChange={onClose}>
      <CommandInput placeholder="Type A Command or Search..." />
      <CommandList className="scrollbar-thin">
        <CommandEmpty>No results found.</CommandEmpty>
        {links.map((link) => (
          <CommandGroup key={link.section} heading={link.section}>
            {link.Links.map((innerLink) => (
              <CommandItem
                key={innerLink.href}
                onSelect={() => handleCommand(innerLink.href)}>
                <File className="size-4" />
                {innerLink.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
