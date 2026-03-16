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
import { CircleCheck } from "lucide-react";
import Image from "next/image";

type BoardMemberDetailProps = {
  row: Row<BoardMemberResponseType>;
};

export const BoardMemberDetails = ({ row }: BoardMemberDetailProps) => {
  const { name, role, bio, is_active, affiliation, picture } = row.original;
  return (
    <Card className="max-w-">
      <CardHeader className="border-b ">
        <div className="relative p-3 rounded-lg flex items-center space-x-2 bg-gradient-to-r from-primary/15 to-accent/15 dark:from-secondary/50 dark:to-accent/80 hover:scale-101 transition-transform duration-300">
          <div className="size-40 border-gradient rounded-full flex justify-center items-center">
            <Image
              src={picture ? picture : "/no-avatar.jpg"}
              alt={name}
              width={38}
              height={38}
              className="size-38 rounded-full object-cover object-top mx-auto"
            />
          </div>
          <div className="flex flex-col gap-2">
            <CardTitle className="flex items-center justify-between">
              <span>{name}</span>
              <Badge variant="secondary" className="absolute top-1/2 right-8">
                {is_active && <CircleCheck className="size-4 text-primary" />}
                {is_active ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              <span>Role: {role}</span> |{" "}
              <span>Affiliation: {affiliation}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FormattedText
          text={bio}
          format="html"
          fallbackText="No Bio Available"
          className="text-wrap"
          splitBy="sentences"
        />
      </CardContent>
    </Card>
  );
};
