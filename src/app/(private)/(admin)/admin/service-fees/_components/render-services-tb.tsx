"use client";

import DataTable from "@/components/customComponents/data-table";
import { Notification } from "@/components/customComponents/notification";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { FEE_PAYMENT_STATUS } from "@/lib/validation";
import { useMemo } from "react";
import { toast } from "sonner";
import { deleteServicesByIds } from "../_actions/delete-services-by-ids";
import { serviceDataTransformer } from "../_utils/service-data-transformer";
import { useGetServiceColumns } from "../hooks/use-services-columns";
import { ServiceSummary } from "./service-summary";

export type TServiceOutput = {
  id: string;
  status: FEE_PAYMENT_STATUS;
  name: string;
  payments: {
    id: string;
    amount: string;
    bank: string | null;
    countryCode: string | null;
    accountName: string | null;
    customerName: string | null;
    RequestedAmount: string;
    paidAt: Date | null;
    transactionFee: string;
    transactionId: string;
  }[];
  academicYear: string;
  price: string;
  count: number;
  capacity: number | null;
  deadline: Date;
};

type TRenderServices = {
  services?: TServiceOutput[];
};

export const RenderServicesTB = ({ services }: TRenderServices) => {
  const columns = useGetServiceColumns();
  const { preferredDateFormat } = useUserPreferredDateFormat();

  const serviceTransformer = useMemo(
    () => serviceDataTransformer(preferredDateFormat),
    [preferredDateFormat],
  );

  const handleServicesDeleteByIds = async (ids: string[]) => {
    const { error, success, count } = await deleteServicesByIds(ids);

    if (error) {
      return toast.error(error);
    } else if (success && count) {
      return toast.success(`${count} record(s) deleted!`);
    }
  };

  return (
    <>
      {services ? (
        <>
          <DataTable
            columns={columns}
            filename="services"
            transformer={serviceTransformer}
            exportKey="service-fees"
            data={services}
            onDelete={async (rows) => {
              const ids = rows.map((row) => row.original.id);
              await handleServicesDeleteByIds(ids);
            }}
            renderSubComponent={(row) => <ServiceSummary row={row} />}
          />
        </>
      ) : (
        <>
          <Notification description="No services found!" />
        </>
      )}
    </>
  );
};
