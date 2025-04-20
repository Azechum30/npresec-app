import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
type FileUploadInputProps<T> = {
  name: keyof T & string;
  fieldTitle: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FileUploadInput<T>({
  name,
  fieldTitle,
  className,
  ...props
}: FileUploadInputProps<T>) {
  const form = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold" htmlFor={name}>
            {fieldTitle}
          </FormLabel>
          <FormControl>
            <div
              tabIndex={0}
              role="button"
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  inputRef.current?.click();
                }
                if (e.key === "Escape") {
                  inputRef.current?.blur();
                }
              }}
              className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg p-4 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-neutral-900  dark:via-neutral-900 dark:to-indigo-950 relative flex justify-center items-center cursor-pointer transition-all duration-200 hover:shadow-lg">
              <Input
                ref={inputRef}
                id={name}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file && file.size > 5 * 1024 * 1024) {
                    form.setError(name, {
                      type: "manual",
                      message: "File is too large. Maximum size should be 5MB",
                    });

                    e.target.value = "";
                    return;
                  }

                  if (
                    file &&
                    file.type !== "image/png" &&
                    file.type !== "image/jpeg"
                  ) {
                    form.setError(name, {
                      type: "manual",
                      message:
                        "File type not supported. Only PNG and JPEG are allowed",
                    });

                    e.target.value = "";
                    return;
                  }

                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  } else {
                    setPreview(null);
                  }

                  field.onChange(file);
                }}
              />

              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="size-48 rounded-lg border border-indigo-500 "
                />
              ) : (
                <div className="flex flex-col justify-center items-center gap-y-2">
                  <UploadCloud className="size-10 text-indigo-400" />
                  <span className="text-base text-gray-600 dark:text-gray-300">
                    Drag or Click to upload
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG or JPEG up to 5MB
                  </span>
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
