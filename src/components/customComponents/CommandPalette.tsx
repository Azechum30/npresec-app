"use client";
import { useOpenCommandPalette } from "@/hooks/use-open-command-palette";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Links } from "./Sidebar";
import { useRouter } from "next/navigation";
import { File } from "lucide-react";
import { useAuth } from "./SessionProvider";

export default function CommandPalette() {
  const { open, onClose } = useOpenCommandPalette();
  const router = useRouter();
  const user = useAuth();

  const role = user?.role?.name;

  const handleCommand = (value: string) => {
    onClose();
    router.push(value);
  };

  const links =
    role === "admin"
      ? Links.ADMIN
      : role === "teacher"
      ? Links.TEACHER
      : Links.STUDENT;

  return (
    <CommandDialog open={open} onOpenChange={onClose}>
      <CommandInput placeholder="Type A Command or Search..." />
      <CommandList>
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
