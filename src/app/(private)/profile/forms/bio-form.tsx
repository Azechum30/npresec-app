"use client";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SwitchEditMode } from "../_components/switch-edit-mode";
import { useEffect, useRef, useState } from "react";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BioSchema, BioType } from "@/lib/validation";

type BioFormValues = {
  onSubmit: (data: BioType) => void;
  defaultValues?: BioType;
  isPending?: boolean;
};

export const BioForm = ({
  onSubmit,
  defaultValues,
  isPending,
}: BioFormValues) => {
  const form = useForm<BioType>({
    mode: "onBlur",
    resolver: zodResolver(BioSchema),
    defaultValues: defaultValues ?? {
      username: "",
      email: "",
      fullName: "",
      role: "",
      picture: undefined,
      subscribeToNewsletter: false,
      bio: "",
      social: {
        x: "",
        linkedIn: "",
        github: "",
        facebook: "",
        instagram: "",
      },
    },
  });

  const [enableEditing, setEnableEditing] = useState(false);
  const ImageRef = useRef<HTMLInputElement | null>(null);
  const [ProfilePicturePrevious, setProfilePicturePrevious] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (defaultValues) {
      setProfilePicturePrevious(
        defaultValues.picture
          ? (defaultValues.picture as string)
          : "/no-avatar.jpg"
      );
    }
  }, [defaultValues]);

  const handleSubmit = (data: BioType) => {
    onSubmit(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 rounded-md border p-4">
          <div className="flex justify-center items-center">
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      role="button"
                      className="rounded-full h-32 w-32 border-4 border-primary hover:cursor-pointer shadow-lg flex justify-center items-center overflow-hidden relative">
                      <Input
                        ref={ImageRef}
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file && file.size > 5 * 1024 * 1024) {
                            form.setError("picture", {
                              type: "validate",
                              message:
                                "File is too large. Maximum size should be 5MB",
                            });

                            e.target.value = "";
                            return;
                          }

                          if (
                            file &&
                            file.type !== "image/png" &&
                            file.type !== "image/jpg" &&
                            file.type !== "image/jpeg"
                          ) {
                            form.setError("picture", {
                              type: "validate",
                              message:
                                "File type not supported. Only PNG and JPEG are allowed",
                            });

                            e.target.value = "";
                            return;
                          }

                          if (file) {
                            setProfilePicturePrevious(
                              URL.createObjectURL(file)
                            );
                          } else {
                            setProfilePicturePrevious(null);
                          }

                          field.onChange(file);
                        }}
                      />

                      {ProfilePicturePrevious && (
                        <Image
                          src={ProfilePicturePrevious}
                          alt="User profile image"
                          width={126}
                          height={126}
                          className="size-30 rounded-full object-top object-cover"
                        />
                      )}
                      <Button
                        onClick={() => ImageRef.current?.click()}
                        disabled={!enableEditing}
                        type="button"
                        size="sm"
                        className="absolute -bottom-1 disabled:hidden">
                        <Camera className="size-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col-reverse gap-y-3 md:flex-row md:gap-x-0 md:justify-between md:items-center gap-x-8">
            <div>
              <InputWithLabel
                name="username"
                fieldTitle=""
                disabled={!!defaultValues}
                className="w-full"
              />
            </div>
            <div className="flex gap-x-2 items-center">
              <div>
                <SwitchEditMode
                  canEdit={enableEditing}
                  setCanEdit={setEnableEditing}
                />
              </div>
              <div>
                {enableEditing && (
                  <LoadingButton
                    type="submit"
                    size="sm"
                    className="w-auto"
                    loading={isPending as boolean}>
                    {isPending ? (
                      <>
                        <Save className="size-4" />
                        Saving Changes....
                      </>
                    ) : (
                      <>
                        <Save />
                        Save Changes
                      </>
                    )}
                  </LoadingButton>
                )}
              </div>
            </div>
          </div>
          <InputWithLabel<BioType>
            name="fullName"
            fieldTitle="Full Name"
            className="max-w-full"
            disabled={!enableEditing}
          />
          <div className="w-full flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1">
              <InputWithLabel<BioType>
                name="email"
                fieldTitle="Email"
                className="w-full"
                type="email"
                disabled={!!defaultValues}
              />
            </div>
            <div className="flex-1">
              <InputWithLabel<BioType>
                name="role"
                fieldTitle="Role"
                className="w-full"
                disabled={!!defaultValues}
              />
            </div>
          </div>
          <TextAreaWithLabel<BioType>
            name="bio"
            fieldTitle="Bio"
            className="max-w-full"
            disabled={!enableEditing}
          />
          <InputWithLabel<BioType>
            name="social.linkedIn"
            fieldTitle="LinkedIn URL"
            className="max-w-full"
            disabled={!enableEditing}
          />
          <InputWithLabel<BioType>
            name="social.x"
            fieldTitle="X (Twitter) URL"
            className="max-w-full"
            disabled={!enableEditing}
          />
          <InputWithLabel<BioType>
            name="social.instagram"
            fieldTitle="Instagram URL"
            className="max-w-full"
            disabled={!enableEditing}
          />
          <InputWithLabel<BioType>
            name="social.github"
            fieldTitle="Github URL"
            className="max-w-full"
            disabled={!enableEditing}
          />
          <InputWithLabel<BioType>
            name="social.facebook"
            fieldTitle="Facebook URL"
            className="max-w-full"
            disabled={!enableEditing}
          />
          <FormField
            control={form.control}
            name="subscribeToNewsletter"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    disabled={!enableEditing}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>
                  Subscribe to our Newsletter for up-to-date updates and news of
                  new features launched to improve your overall expeerience
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};
