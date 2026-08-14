/** biome-ignore-all assist/source/organizeImports: reason */

import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import { Suspense } from "react";
import { getStudentExeatRequestQueryOptions } from "../../_actions/queries";
import { ConfirmExeatCheckinOrCheckout } from "./_forms/confirm-exeat-checkin-or-checkout";

type Props = {
  params: Promise<{ exeatId: string }>;
};

export default function CheckOutOrCheckInPage({ params }: Props) {
  return (
    <Suspense fallback={<DotMatrixLoader />}>
      <RenderExeatCheckinOrCheckout params={params} />
    </Suspense>
  );
}

const RenderExeatCheckinOrCheckout = async ({ params }: Props) => {
  await connection();

  const { exeatId } = await params;
  const queryClient = getQueryClient();
  await queryClient.ensureQueryData(
    getStudentExeatRequestQueryOptions(exeatId),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConfirmExeatCheckinOrCheckout exeatId={exeatId} />
    </HydrationBoundary>
  );
};
