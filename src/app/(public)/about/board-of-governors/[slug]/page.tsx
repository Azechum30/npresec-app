/** biome-ignore-all assist/source/organizeImports: reason */
import {
  getBoardOfGovernors,
  getBoardOfGovernorsById,
} from "../actions/server";

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { FormattedText } from "@/components/customComponents/FormattedText";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/lib/server-only-actions/validate-env";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

type BoardOfGovernorsSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async () => {
  const { boardMembers } = await getBoardOfGovernors();
  if (!boardMembers) return [];
  return boardMembers.map((member) => ({ slug: member.id }));
};

export const generateMetadata = async ({
  params,
}: BoardOfGovernorsSlugPageProps): Promise<Metadata> => {
  const { slug } = await params;

  const { boardMember } = await getBoardOfGovernorsById(slug);

  if (!boardMember) {
    return {
      title: "Board Member Not Found",
      description: "The requested board member could not be found.",
      robots: { index: false },
    };
  }

  const fullName = boardMember.name;
  const position = boardMember.role || "Board Member";

  return {
    title: fullName,
    description: `${fullName} - ${position} at Presbyterian Senior High Technical School (NPRESEC). ${boardMember.bio?.substring(0, 160) || "Distinguished member of the Board of Governors."}`,

    keywords: [
      fullName,
      position,
      "NPRESEC Board",
      "Board of Governors",
      "Presbyterian Senior High Technical School",
      "Nakpanduri",
      "School Leadership Ghana",
    ],

    openGraph: {
      title: `${fullName} - ${position}`,
      description:
        boardMember.bio?.substring(0, 200) ||
        `Distinguished ${position} at NPRESEC.`,
      url: `${env.NEXT_PUBLIC_URL}/about/board-of-governors/${slug}`,
      images: [
        {
          url: boardMember.picture || "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${fullName} - ${position}`,
        },
      ],
      type: "profile",
      siteName: "NPRESEC MIS",
    },

    twitter: {
      card: "summary_large_image",
      title: `${fullName} - ${position}`,
      description: boardMember.bio?.substring(0, 160) || "",
      images: [boardMember.picture || "/opengraph-image"],
    },

    alternates: {
      canonical: `${env.NEXT_PUBLIC_URL}/about/board-of-governors/${slug}`,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
};

export default function BoardOfGovernorsSlugPage({
  params,
}: BoardOfGovernorsSlugPageProps) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <RenderBoardMemberDetails params={params} />
    </Suspense>
  );
}

const RenderBoardMemberDetails = async ({
  params,
}: BoardOfGovernorsSlugPageProps) => {
  await connection();
  const { slug } = await params;

  if (!slug) return redirect("/about/board-of-governors");

  const { boardMember } = await getBoardOfGovernorsById(slug);

  if (!boardMember) {
    notFound();
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
              className="w-full h-112.5 object-cover object-top rounded-md"
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
};
