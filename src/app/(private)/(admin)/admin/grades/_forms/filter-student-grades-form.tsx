"use client";

import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import {
  Semester,
  StudentGradesFilterSchema,
  StudentGradesFilterType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { getClassesAction } from "../../classes/actions/server-actions";

const START_YEAR = new Date().getFullYear() - 5;

export const FilterStudentGradesForm = () => {
  const searchParams = useSearchParams();
  const form = useForm<StudentGradesFilterType>({
    resolver: zodResolver(StudentGradesFilterSchema),
    mode: "onBlur",
    defaultValues: {
      academicYear: searchParams.get("academicYear")
        ? parseInt(searchParams.get("academicYear") as string)
        : undefined,
      semester:
        (searchParams.get("semester") as (typeof Semester)[number]) ||
        undefined,
      classId: searchParams.get("classId") || undefined,
    },
  });

  const router = useRouter();
  const pathname = usePathname();

  const [classes, setClasses] = useState<
    { id: string; name: string }[] | undefined
  >();

  const classId = useWatch({
    control: form.control,
    name: "classId",
  });

  const academicYear = useWatch({
    control: form.control,
    name: "academicYear",
  });

  const semester = useWatch({
    control: form.control,
    name: "semester",
  });

  useEffect(() => {
    if (
      pathname !==
      `/admin/grades?classId=${classId}&academicYear=${academicYear}&semester=${semester}`
    ) {
      form.reset({
        classId: "",
        semester: "" as (typeof Semester)[number],
        academicYear: new Date().getFullYear(),
      });
    }
  }, [pathname, form]);

  const debouncedNavigate = useDebouncedCallback((params) => {
    const allPresent = classId && academicYear && semester;

    if (allPresent) {
      router.push(`${pathname}?${params.toString()}` as Route);
    }
  }, 300);

  useEffect(() => {
    const fetchClasses = () => {
      startTransition(async () => {
        const rs = await getClassesAction();
        if (rs.error) {
          toast.error(rs.error);
        }
        setClasses(rs.data);
      });
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const allParamsPresent = classId && academicYear && semester;

    if (!allParamsPresent) return;

    const currentParams = new URLSearchParams();

    const isMatch =
      currentParams.get("classId") === classId &&
      currentParams.get("academicYear") === academicYear?.toString() &&
      currentParams.get("semester") === semester;
    if (isMatch) return;

    const params = new URLSearchParams();
    params.set("classId", classId);
    params.set("academicYear", academicYear.toString());
    params.set("semester", semester);

    debouncedNavigate(params);
  }, [classId, academicYear, semester, debouncedNavigate]);

  return (
    <Form {...form}>
      <form className="p-4 border rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectWithLabel
            name="classId"
            fieldTitle="Class"
            data={classes ?? []}
            schema={StudentGradesFilterSchema}
            valueKey="id"
            selectedKey="name"
            placeholder="--Select class--"
          />
          <SelectWithLabel
            name="semester"
            fieldTitle="Semester"
            data={Semester as any}
            schema={StudentGradesFilterSchema}
            placeholder="--Select semester--"
          />
          <SelectWithLabel
            name="academicYear"
            fieldTitle="Academic Year"
            data={Array.from({ length: 6 }, (_, i) => START_YEAR + i)}
            schema={StudentGradesFilterSchema}
            placeholder="--Select academic year--"
          />
        </div>
      </form>
    </Form>
  );
};
