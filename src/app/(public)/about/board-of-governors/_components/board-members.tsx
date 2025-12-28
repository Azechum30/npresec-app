import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BoardMembersProps = {
  id: string;
  name: string;
  role: string;
  affiliation: string | null;
  bio: string | null;
  picture: string | null;
  is_active: boolean;
};

export const BoardMembers = async ({
  id,
  name,
  role,
  affiliation,
  bio,
  picture,
  is_active,
}: BoardMembersProps) => {
  // const slug = await generateToken(id);
  const pictureUrl = picture
    ? picture.startsWith("http") ||
      picture.startsWith("https") ||
      picture.startsWith("/")
      ? picture
      : "/no-avatar.jpg"
    : "/no-avatar.jpg";

  return (
    <div className="sm:last-of-type:col-span-2 flex flex-col gap-3 rounded-md border-border shadow-sm p-4 bg-background">
      <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-accent border-2 p-1">
        <Image
          src={pictureUrl}
          alt={name}
          width={92}
          height={92}
          className="rounded-full object-cover size-22 object-top"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-center pb-5 border-b">{name}</h3>
        <p className="text-sm text-muted-foreground flex justify-between items-center not-last-of-type:mb-2 pt-2">
          <span className="font-semibold">Role: </span>
          <span>
            {role === "ChairPerson"
              ? "Chairperson"
              : role === "ViceChairPerson"
                ? "Vice Chairperson"
                : role}
          </span>
        </p>
        <p className="text-sm text-muted-foreground flex justify-between items-center not-last-of-type:mb-2 last-of-type:border-b last-of-type:pb-2">
          <span className="font-semibold">Afilliation: </span>
          <span>{affiliation}</span>
        </p>
        <Link
          href={`/about/board-of-governors/${id}`}
          className={buttonVariants({ variant: "secondary" })}
        >
          Read More <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
};
