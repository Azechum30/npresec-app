"use client";

import FileUploadInput from "@/components/customComponents/FileUploadInput";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { BoardOfGovernorsSchema, BoardOfGovernorsType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

type CreateBoardMemberFormProps = {
  onSubmit: (data: BoardOfGovernorsType) => Promise<void>;
  id?: string;
  onDelete?: () => Promise<void>;
  defaultValues?: BoardOfGovernorsType;
  isCreating?: boolean;
  isDeleting?: boolean;
};

const BoardRole = [
  "Member",
  "ChairPerson",
  "ViceChairPerson",
  "Secretary",
] as const;

export const CreateBoardMemberForm = ({
  onSubmit,
  id,
  onDelete,
  isCreating,
  isDeleting,
  defaultValues,
}: CreateBoardMemberFormProps) => {
  const form = useForm<BoardOfGovernorsType>({
    resolver: zodResolver(BoardOfGovernorsSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          name: "",
          role: undefined,
          affiliation: "",
          bio: "",
          photo_url: undefined,
          is_active: false,
        },
  });

  const { confirmDelete, ConfirmDeleteComponent } = useConfirmDelete();

  const handleFormSubmit = async (values: BoardOfGovernorsType) => {
    await onSubmit(values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4 w-full h-full text-left rounded-md border p-4 overflow-auto">
          <InputWithLabel
            fieldTitle="Full Name"
            name="name"
            schema={BoardOfGovernorsSchema as any}
          />

          <SelectWithLabel
            fieldTitle="Role"
            name="role"
            data={BoardRole as any}
          />
          <InputWithLabel
            fieldTitle="Afilliation"
            name="affiliation"
            schema={BoardOfGovernorsSchema as any}
          />
          <TextAreaWithLabel fieldTitle="Bio" name="bio" />

          <FileUploadInput
            fieldTitle="Photo URL"
            name="photo_url"
            isEditing={defaultValues && true}
            photoURL={defaultValues ? (defaultValues.photo_url as string) : ""}
          />

          <div>
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex space-x-2">
                  <FormControl>
                    <Checkbox
                      id="is_active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="is_active"
                    className=" hover:cursor-pointer">
                    Kindly indicate whether the person is an active member by
                    clicking on the chcekbox.
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <LoadingButton className="hover:cursor-pointer" loading={false}>
              {id ? (
                <>
                  {isCreating ? (
                    <>
                      Saving Changes <Loader2 className="animate-spin size-6" />
                    </>
                  ) : (
                    <>
                      <Save /> Save Changes
                    </>
                  )}
                </>
              ) : (
                <>
                  {isCreating ? (
                    <>
                      Creating member...
                      <Loader2 className="animate-spin size-6" />
                    </>
                  ) : (
                    <>
                      <PlusCircle /> Create Member
                    </>
                  )}
                </>
              )}
            </LoadingButton>

            {id && (
              <LoadingButton
                type="button"
                variant="destructive"
                className="hover:cursor-pointer"
                loading={isDeleting as boolean}
                onClick={async () => {
                  const ok = await confirmDelete();
                  if (ok) {
                    await onDelete?.();
                  }
                }}>
                {isDeleting ? (
                  <>
                    Deleting Member...{" "}
                    <Loader2 className="animate-spin size-6" />
                  </>
                ) : (
                  <>
                    {" "}
                    <Trash2 /> Delete Member
                  </>
                )}
              </LoadingButton>
            )}
          </div>
        </form>
      </Form>
      <ConfirmDeleteComponent />
    </>
  );
};
