"use client";

import { ErrorComponent } from "@/components/customComponents/ErrorComponent";

export default function ErrorPage(error: any) {
  return <ErrorComponent error={error.error.message} />;
}
