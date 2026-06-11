"use client";

import DataTable from "@/components/customComponents/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { deletePaymentsByIds } from "../_actions/delete-payments-by-ids";
import { usePaymentsColumns } from "../_hooks/use-payments-columns";
import { paymentDataTransformer } from "../_utils/paymentsTransformer";

export type TRenderPayments = {
  payments: {
    id: string;
    amount: string;
    channel: string | null;
    ipAddress: string | null;
    transactionFee: string;
    bank: string | null;
    brand: string | null;
    countryCode: string | null;
    accountName: string | null;
    customerName: string | null;
    customerPhoneNumber: string | null;
    customerCode: string | null;
    customerEmail: string | null;
    currency: string;
    transactionId: bigint | null;
    reference: string | null;
    paymentStatus: string;
    feeId: string | null;
    cardType: string | null;
    orderId: string | null;
    ReceiverBank: string | null;
    ReceiverAccountNumber: string | null;
    metadata: {
      studentId: string;
      name: string;
      serviceName: string;
    };
    paidAt: Date | null;
    fee: {
      id: string;
      name: string;
    } | null;
  }[];
};

const periods = ["Today", "This Week", "This Month", "All Payments"];

export const RenderPaymentsTB = ({ payments }: TRenderPayments) => {
  const services = useMemo(() => {
    const seen = new Map<string, (typeof payments)[number]>();
    for (const p of payments) {
      if (!seen.has(p?.feeId as string)) seen.set(p.feeId as string, p);
    }
    return Array.from(seen.values());
  }, [payments]);

  const [selectedService, setSelectedService] = useState<string>(
    () => services[0]?.fee?.id ?? "",
  );

  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    () => periods[1],
  );

  const filteredPayments = useMemo(
    () => payments.filter((pay) => pay.feeId === selectedService),
    [selectedService, payments],
  );

  const filteredPaymentsByDates = useMemo(() => {
    if (!filteredPayments?.length) return [];

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - dayOfWeek,
    );
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of month
    endOfMonth.setHours(23, 59, 59, 999);

    return filteredPayments.filter((payment) => {
      if (!payment?.paidAt) return false;
      const paidDate =
        payment.paidAt instanceof Date
          ? payment.paidAt
          : new Date(payment.paidAt);

      if (selectedPeriod === "Today") {
        return paidDate >= startOfToday && paidDate <= endOfToday;
      }

      if (selectedPeriod === "This Week") {
        return paidDate >= startOfWeek && paidDate <= endOfWeek;
      }

      if (selectedPeriod === "This Month") {
        return paidDate >= startOfMonth && paidDate <= endOfMonth;
      }

      return true;
    });
  }, [filteredPayments, selectedPeriod]);

  const columns = usePaymentsColumns();

  const handlePaymentsDelete = async (ids: string[]) => {
    const { error, success, count } = await deletePaymentsByIds(ids);

    if (error) return toast.error(error);

    if (success && count) return toast.success(`${count} payment(s) deleted`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-lg font-semibold bg-linear-90 from-primary to-muted-foreground bg-clip-text text-transparent">
          Active Payments
        </h1>
        <div className="flex space-x-2 items-center">
          <span className="flex space-x-1 items-center text-muted-foreground">
            <Filter className="size-4" />
            <span>Filters</span>
          </span>
          <Select
            value={selectedService}
            onValueChange={(val) => setSelectedService(val)}>
            <SelectTrigger>
              <SelectValue placeholder="select service" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {services.map((s) => (
                <SelectItem key={s.fee?.id} value={s.fee?.id as string}>
                  {s.fee?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedPeriod}
            onValueChange={(val) => setSelectedPeriod(val)}>
            <SelectTrigger>
              <SelectValue placeholder="select service" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredPaymentsByDates}
        filename="payments"
        transformer={paymentDataTransformer}
        exportKey="payments"
        onDelete={async (rows) => {
          const ids = rows.map((r) => r.original.id);
          await handlePaymentsDelete(ids);
        }}
      />
    </div>
  );
};
