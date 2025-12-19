"use client";

import { CheckboxWithLabel } from "@/components/customComponents/checkbox-with-label";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form, FormDescription } from "@/components/ui/form";
import {
  dateFormatOptions,
  itemsPerPageOptions,
  notificationFrequencyOptions,
  SettingsSchema,
  SettingsType,
  themeOptions,
  TimezoneOption,
  timezoneOptions,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { SwitchEditMode } from "../_components/switch-edit-mode";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Save } from "lucide-react";

type SettingsFormProps = {
  onSubmit: (data: SettingsType) => void;
  defaultValues?: SettingsType;
  isPending?: boolean;
};

export const SettingsForm = ({
  onSubmit,
  defaultValues,
  isPending,
}: SettingsFormProps) => {
  const form = useForm<SettingsType>({
    mode: "onBlur",
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      subscribeToNewsletter: defaultValues?.subscribeToNewsletter ?? false,
      itemsPerPage: defaultValues?.itemsPerPage ?? (10 as const),
      theme: defaultValues?.theme ?? ("system" as const),
      dateFormat: defaultValues?.dateFormat ?? ("DD/MM/YYYY" as const),
      emailNotifications: defaultValues?.emailNotifications ?? {
        announcements: false,
        assignments: false,
        attendance: false,
        grades: false,
        systemUpdates: false,
      },
      notificationFrequency:
        defaultValues?.notificationFrequency ?? ("realtime" as const),
      compactMode: defaultValues?.compactMode ?? false,
      showTips: defaultValues?.showTips ?? false,
      timezone: defaultValues?.timezone ?? ("Africa/Accra" as const),
    },
  });

  const [enableEditing, setEnableEditing] = useState(false);

  // Ensure timezone default is set after form initialization
  useEffect(() => {
    const currentTimezone = form.getValues("timezone");
    // Only set if not already set or if it's undefined/null
    if (!currentTimezone) {
      form.setValue("timezone", "Africa/Accra", {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [form]);

  const handleSettingsFormSubmission = (data: SettingsType) => {
    onSubmit(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSettingsFormSubmission)}
          className="space-y-6 p-4 rounded-md border">
          <div className="flex justify-between items-center">
            <SwitchEditMode
              canEdit={enableEditing}
              setCanEdit={setEnableEditing}
            />
            {enableEditing && (
              <LoadingButton
                className="w-auto"
                size="sm"
                loading={isPending as boolean}>
                {isPending ? (
                  <>
                    <Save /> Saving...
                  </>
                ) : (
                  <>
                    <Save /> Save Changes
                  </>
                )}
              </LoadingButton>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SelectWithLabel
                name="itemsPerPage"
                fieldTitle="Items Per Page"
                data={itemsPerPageOptions as any}
                placeholder="Select items per page"
                disabled={!enableEditing}
              />
            </div>
            <div className="flex-1">
              <SelectWithLabel
                name="theme"
                fieldTitle="Theme"
                data={themeOptions as any}
                placeholder="Select theme"
                disabled={!enableEditing}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SelectWithLabel
                name="dateFormat"
                fieldTitle="Systemwide Date Format"
                data={dateFormatOptions as any}
                placeholder="Select date format"
                disabled={!enableEditing}
              />
            </div>
            <div className="flex-1">
              <SelectWithLabel
                name="timezone"
                fieldTitle="Timezone"
                data={timezoneOptions as any}
                placeholder="Select your timezone"
                valueKey="value"
                selectedKey="label"
                disabled={!enableEditing}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SelectWithLabel
                name="notificationFrequency"
                fieldTitle="Notification Frequency"
                data={notificationFrequencyOptions as any}
                placeholder="Select notification frequency"
                className="max-w-full"
                disabled={!enableEditing}
              />
            </div>
          </div>
          <fieldset className="border p-4 rounded-md">
            <legend className="p-2 rounded-md border text-sm font-bold">
              System Layout and Helpful Tips
            </legend>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <CheckboxWithLabel<SettingsType>
                  name="compactMode"
                  label="Enable Compact Mode"
                  className=""
                  disabled={!enableEditing}
                />
              </div>
              <div className="flex-1">
                <CheckboxWithLabel<SettingsType>
                  name="showTips"
                  label="Show Tips and Tricks"
                  className=""
                  disabled={!enableEditing}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm border p-2 rounded-md font-bold">
              Newsletter & Communications
            </legend>
            <div className="flex flex-col gap-4">
              <CheckboxWithLabel<SettingsType>
                name="subscribeToNewsletter"
                label="Subscribe to our newsletter for updates, new features, and school announcements"
                className=""
                disabled={!enableEditing}
              />
            </div>
          </fieldset>
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm border p-2 rounded-md font-bold">
              Email Notification Preferences
            </legend>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-y-2">
                <CheckboxWithLabel<SettingsType>
                  name="emailNotifications.announcements"
                  label="Receive email notifications for systemwide announcements"
                  className=""
                  disabled={!enableEditing}
                />
                <CheckboxWithLabel<SettingsType>
                  name="emailNotifications.attendance"
                  label="Receive email notifications for attendance tracking"
                  className=""
                  disabled={!enableEditing}
                />
                <CheckboxWithLabel<SettingsType>
                  name="emailNotifications.grades"
                  label="Receive email notifications for students grades change"
                  className=""
                  disabled={!enableEditing}
                />
                <CheckboxWithLabel<SettingsType>
                  name="emailNotifications.assignments"
                  label="Receive email notifications for new assignments or deadlines"
                  className=""
                  disabled={!enableEditing}
                />
                <CheckboxWithLabel<SettingsType>
                  name="emailNotifications.systemUpdates"
                  label="Receive email notifications for system updates and maintenance"
                  className=""
                  disabled={!enableEditing}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </Form>
    </>
  );
};
