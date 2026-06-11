import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { FEE_PAYMENT_STATUS, FeeSchema, FeeType } from "@/lib/validation";
import { generateAcademicYears } from "@/utils/generate-academic -years";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type CreateServiceFormProps = {
  onSubmitAction: (data: FeeType) => void;
  id?: string;
  defaultValues?: FeeType;
  isPending: boolean;
};

export const CreateServiceForm = ({
  onSubmitAction,
  defaultValues,
  id,
  isPending,
}: CreateServiceFormProps) => {
  const form = useForm<FeeType>({
    mode: "all",
    resolver: zodResolver(FeeSchema),
    defaultValues: defaultValues ?? {
      name: "",
      academicYear: "",
      capacity: 100,
      currency: "GHS",
      deadline: new Date(),
      price: "",
      status: FEE_PAYMENT_STATUS.OPEN,
    },
  });

  const handleSubmit = (data: FeeType) => {
    onSubmitAction(data);
  };

  const years = generateAcademicYears(2);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 rounded-md border overflow-y-auto max-h-[80vh]">
        <InputWithLabel
          name="name"
          fieldTitle="Service Name"
          placeholder="e.g. Admission Fee, School Fee"
          schema={FeeSchema}
        />
        <SelectWithLabel
          name="academicYear"
          fieldTitle="Academic"
          placeholder="Select academic year"
          data={years}
          schema={FeeSchema}
        />

        <InputWithLabel
          name="price"
          fieldTitle="Price"
          placeholder="e.g. 10.00"
          schema={FeeSchema}
        />
        <SelectWithLabel
          name="currency"
          fieldTitle="Currency"
          placeholder="Select currency e.g GHS, USD"
          data={["GHS", "USD", "NGN"]}
          schema={FeeSchema}
        />

        <InputWithLabel
          name="capacity"
          fieldTitle="Service Limit"
          type="number"
          schema={FeeSchema}
        />

        <DatePickerWithLabel
          name="deadline"
          fieldTitle="Service Expires At"
          startDate={new Date().getFullYear()}
          endDate={new Date().getFullYear()}
          schema={FeeSchema}
        />

        <SelectWithLabel
          name="status"
          fieldTitle="Service Status"
          placeholder="Select currency e.g OPEN"
          data={["OPENED", "CLOSED", "LATE_PAYMENT"]}
          schema={FeeSchema}
        />

        <LoadingButton
          disabled={!form.formState.isValid}
          size="lg"
          loading={isPending}>
          {!!id ? (
            <>{isPending ? "Saving..." : "Save"}</>
          ) : (
            <>{isPending ? "Creating..." : "Create Service"}</>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
