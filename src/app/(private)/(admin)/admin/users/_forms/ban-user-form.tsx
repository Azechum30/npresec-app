/** biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { GenericSelectWithLabel } from "@/components/customComponents/generic-select-with-label";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Form } from "@/components/ui/form";
import { BAN_REASONS, BAN_USER_DURATIONS } from "@/lib/constants";
import { BanUserSchema, type BanUserType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldBan } from "lucide-react";
import type { FC } from "react";
import { useForm } from "react-hook-form";

interface IBanUserFormProps {
  onSubmitAction: (data: BanUserType) => Promise<void>;
  userId: string;
  isPending: boolean;
  defaultValues?: BanUserType;
}

export const BanUserForm: FC<IBanUserFormProps> = ({
  onSubmitAction,
  userId,
  isPending,
  defaultValues,
}) => {
  const form = useForm<BanUserType>({
    resolver: zodResolver(BanUserSchema),
    mode: "onSubmit",
    defaultValues: defaultValues ?? {
      userId: userId,
      banReason: "",
      duration: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="p-4 space-y-4 border rounded-md">
        <div className="sr-only">
          <InputWithLabel name="userId" fieldTitle="User ID" disabled />
        </div>
        <GenericSelectWithLabel
          name="banReason"
          fieldTitle="Reason For Ban"
          data={BAN_REASONS.map((reason) => ({
            id: reason.toString(),
            name: reason,
          }))}
          selectedKey="name"
          valueKey="id"
        />
        <GenericSelectWithLabel
          name="duration"
          fieldTitle="Duration of Ban"
          data={BAN_USER_DURATIONS.map((duration) => ({
            id: duration.time.toString(),
            name: duration.description,
          }))}
          selectedKey="name"
          valueKey="id"
        />

        <LoadingButton loading={isPending}>
          <ShieldBan className="size-5" />
          {isPending ? "Processing request" : "Proceed"}
        </LoadingButton>
      </form>
    </Form>
  );
};
