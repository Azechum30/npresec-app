/** biome-ignore-all assist/source/organizeImports: reason */

import { env } from "@/lib/server-only-actions/validate-env";
import type { MetadataRoute } from "next";
import { getBoardOfGovernors } from "./(public)/about/board-of-governors/actions/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { boardMembers } = await getBoardOfGovernors();

  const siteMapEntries = boardMembers?.map(({ id }) => ({
    url: `${env.NEXT_PUBLIC_URL}/about/board-of-governors/${id}`,
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  return [
    {
      url: `${env.NEXT_PUBLIC_URL}/`,
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_URL}/about`,
      priority: 0.9,
    },
    {
      url: `${env.NEXT_PUBLIC_URL}/about/board-of-governors`,
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_URL}/about/vision-mission`,
      priority: 0.9,
    },

    ...siteMapEntries,
  ];
}
