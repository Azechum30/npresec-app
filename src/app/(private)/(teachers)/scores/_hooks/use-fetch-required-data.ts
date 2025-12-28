import { useAuth } from "@/components/customComponents/SessionProvider";
import { CourseResponseType, ClassesResponseType } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchClasses, fetchCourse } from "../_actions/fetch-classes";

export const useFetchRequiredData = () => {
  const [courses, setCourses] = useState<
    Pick<CourseResponseType, "id" | "title">[] | null
  >(null);
  const [classes, setClasses] = useState<
    Pick<ClassesResponseType, "id" | "name">[] | null
  >(null);
  const [fetchError, setFetchError] = useState<string | undefined>();

  const user = useAuth();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      setClasses(null);
      setCourses(null);
      setFetchError(undefined);

      const [classesResult, coursesResult] = await Promise.all([
        fetchClasses(user?.id),
        fetchCourse(user?.id),
      ]);

      if (classesResult.error || coursesResult.error) {
        setFetchError(classesResult.error || coursesResult.error);
        return;
      }
      if (
        classesResult.classes === undefined ||
        coursesResult.courses === undefined
      ) {
        setFetchError(undefined);
        return;
      }

      setFetchError(undefined);
      setClasses(classesResult.classes);
      setCourses(coursesResult.courses);
    };

    fetchData();
  }, [user]);

  return { classes, courses, fetchError };
};
