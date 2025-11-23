import { FormattedText } from "@/components/customComponents/FormattedText";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BoardMemberResponseType } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import Image from "next/image";

type BoardMemberDetailProps = {
  row: Row<BoardMemberResponseType>;
};

export const BoardMemberDetails = ({ row }: BoardMemberDetailProps) => {
  const { name, role, bio, is_active, affiliation, picture } = row.original;
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          <Badge variant="secondary">{is_active ? "Active" : "Inactive"}</Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          <span>Role: {role}</span> | <span>Affiliation: {affiliation}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={picture ? picture : "/no-avatar.jpg"}
          alt={name}
          width={1200}
          height={1200}
          className="w-full h-[450px] object-cover object-top"
        />

        <FormattedText
          text={bio}
          format="html"
          fallbackText="No Bio Available"
        />
      </CardContent>
    </Card>
  );
};
