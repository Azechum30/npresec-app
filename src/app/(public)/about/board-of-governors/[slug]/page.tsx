import { verifyToken } from "@/lib/jwt";
import { getBoardOfGovernorsById } from "../actions/server";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedText } from "@/components/customComponents/FormattedText";
import Image from "next/image";
import { redirect } from "next/navigation";

type BoardOfGovernorsSlugPageProps = {
  params: {
    slug: Promise<string>;
  };
};

export default async function BoardOfGovernorsSlugPage({
  params,
}: BoardOfGovernorsSlugPageProps) {
  const { slug } = await params;

  try {
    const userId = await verifyToken(await slug);

    // If token is invalid or expired, redirect immediately
    if (!userId) {
      redirect("/about/board-of-governors");
    }

    const { boardMember, error } = await getBoardOfGovernorsById(userId);

    // If there's an error fetching the board member, redirect
    if (error) {
      redirect("/about/board-of-governors");
    }

    // If board member not found, redirect
    if (!boardMember) {
      redirect("/about/board-of-governors");
    }

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl text-primary font-semibold relative after:absolute after:top-full after:w-1/12 after:inset-0 after:h-[1.5px] after:bg-primary after:flex after:items-center">
          Board Member Details
        </h2>
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex justify-between items-center">
              <span>{boardMember.name}</span>
              <Badge variant="secondary">
                {boardMember.is_active ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
            <CardDescription>
              <span className="text-xs">
                Role:{" "}
                {boardMember.role === "ChairPerson"
                  ? "Chairperson"
                  : boardMember.role === "ViceChairPerson"
                    ? "Vice Chairperson"
                    : boardMember.role}
              </span>{" "}
              |{" "}
              <span className="text-xs">
                Affiliation: {boardMember.affiliation}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Image
                src={
                  boardMember.picture
                    ? boardMember.picture.startsWith("http") ||
                      boardMember.picture.startsWith("https") ||
                      boardMember.picture.startsWith("/")
                      ? boardMember.picture
                      : "/no-avatar.jpg"
                    : "/no-avatar.jpg"
                }
                alt={boardMember.name}
                width={1200}
                height={1200}
                className="w-full h-[450px] object-cover object-top rounded-md"
              />
            </div>
            <FormattedText
              text={boardMember.bio}
              format="markdown"
              splitBy="paragraphs"
              fallbackText="No bio available"
              className="mt-4 text-justify text-sm"
            />
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    // If any unexpected error occurs, redirect to board of governors page
    redirect("/about/board-of-governors");
  }
}
