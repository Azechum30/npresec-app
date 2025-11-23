"use client";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useFetchRequiredData } from "../_hooks/use-fetch-required-data";
import { AssesessmentSchema, Semester } from "@/lib/validation";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const formSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  semester: z.string().min(1, "Semester is required"),
  academicYear: z.string().min(1, "Academic Year is required"),
  assessmentType: z.string().min(1, "Assessment Type is required"),
});

export const SearchQueryForm = () => {
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: searchParams.get("classId") || "",
      courseId: searchParams.get("courseId") || "",
      semester: searchParams.get("semester") || "",
      academicYear: searchParams.get("academicYear") || "",
      assessmentType: searchParams.get("assessmentType") || "",
    },
  });

  const { classes, courses, fetchError } = useFetchRequiredData();
  const selectedClass = useWatch({
    control: form.control,
    name: "classId",
  });
  const selectedCourse = useWatch({
    control: form.control,
    name: "courseId",
  });
  const selectedSemester = useWatch({
    control: form.control,
    name: "semester",
  });
  const selectedAcademicYear = useWatch({
    control: form.control,
    name: "academicYear",
  });
  const selectedAssessmentType = useWatch({
    control: form.control,
    name: "assessmentType",
  });

  const router = useRouter();
  const pathname = usePathname();

  const debouncedNavigate = useDebouncedCallback((params) => {
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    const allParamsPresent =
      selectedClass &&
      selectedCourse &&
      selectedSemester &&
      selectedAcademicYear &&
      selectedAssessmentType;
    if (!allParamsPresent) return;

    const params = new URLSearchParams();
    params.set("classId", selectedClass);
    params.set("courseId", selectedCourse);
    params.set("semester", selectedSemester);
    params.set("academicYear", selectedAcademicYear);
    params.set("assessmentType", selectedAssessmentType);

    debouncedNavigate(params);
  }, [
    selectedClass,
    selectedCourse,
    selectedSemester,
    selectedAcademicYear,
    selectedAssessmentType,
    debouncedNavigate,
  ]);

  const years = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  }, []);

  return (
    <Form {...form}>
      <form className="border rounded-md p-4  my-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
        <div className="w-full md:last-of-type:col-span-2 lg:last-of-type:col-span-1">
          <SelectWithLabel<z.infer<typeof formSchema>>
            name="classId"
            fieldTitle="Class"
            data={classes || []}
            valueKey="id"
            selectedKey="name"
            schema={formSchema}
            placeholder="Select Class"
            className="text-xs"
          />
        </div>
        <div className="w-full md:last-of-type:col-span-2 lg:last-of-type:col-span-1">
          <SelectWithLabel<z.infer<typeof formSchema>>
            name="courseId"
            fieldTitle="Course"
            data={courses || []}
            valueKey="id"
            selectedKey="title"
            schema={formSchema}
            placeholder="Select Course"
            className="text-xs"
          />
        </div>
        <div className="w-full md:last-of-type:col-span-2 lg:last-of-type:col-span-1">
          <SelectWithLabel<z.infer<typeof formSchema>>
            name="semester"
            fieldTitle="Semester"
            data={Semester as any}
            schema={formSchema}
            placeholder="Select Semester"
            className="text-xs"
          />
        </div>
        <div className="w-full md:last-of-type:col-span-2 lg:last-of-type:col-span-1">
          <SelectWithLabel<z.infer<typeof formSchema>>
            name="academicYear"
            fieldTitle="Academic Year"
            data={years}
            schema={formSchema}
            placeholder="Select Year"
            className="text-xs"
          />
        </div>
        <div className="w-full md:last-of-type:col-span-2 lg:last-of-type:col-span-1">
          <SelectWithLabel<z.infer<typeof formSchema>>
            name="assessmentType"
            fieldTitle="Assessment Type"
            data={AssesessmentSchema as any}
            schema={formSchema}
            placeholder="Select Type"
            className="text-xs"
          />
        </div>
      </form>
    </Form>
  );
};
