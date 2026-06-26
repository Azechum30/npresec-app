/**biome-ignore-all assist/source/organizeImports: reason */
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getStudentQueryOptions } from "../../actions/queries";
import { RenderStudentEdit } from "../../components/RenderStudentEdit";

export const ViewStudentDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.ensureQueryData(getStudentQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderStudentEdit studentId={id} />
    </HydrationBoundary>
  );
};
