/** biome-ignore-all assist/source/organizeImports: reason */
import { AvatarComponent } from "@/components/customComponents/avatar-component";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GradeResponseType } from "@/lib/types";
import type { Row } from "@tanstack/react-table";
import moment from "moment";

type StudentScoreDetailProps = {
  row: Row<GradeResponseType>;
};

export const StudentScoreDetail = ({ row }: StudentScoreDetailProps) => {
  const {
    student,
    score,
    maxScore,
    staff,
    course,
    createdAt,
    academicYear,
    semester,
    assessmentType,
  } = row.original;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="relative flex justify-start items-center gap-3">
          <AvatarComponent
            image={student.user?.image ?? undefined}
            fallback={`${student.lastName} ${student.firstName}`}
          />
          <div className="flex flex-col items-start">
            <h1 className="text-base">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-xs text-muted-foreground font-normal">
              Student ID: {student.studentNumber} | Sex: {student.gender}
            </p>
            <p className="text-xs text-muted-foreground font-normal">
              Level: {student.currentClass?.level.split("_").join(" ")} |
              Department: {student.currentClass?.department?.name}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="absolute right-0 top-1/2 -translate-y-1/2">
            Class: {student.currentClass?.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset className="border px-6 py-3 rounded-md">
          <legend className="text-sm font-medium">Assessment Details</legend>
          <div className="flex flex-col gap-4 ">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm">Assessment Type:</p>
                <p className="text-sm text-muted-foreground">
                  {assessmentType}
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">Semester:</p>
                <p className="text-sm text-muted-foreground">{semester}</p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">Subject:</p>
                <p className="text-sm text-muted-foreground">{course?.title}</p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">Maximum (Overall) Score:</p>
                <p className="text-sm text-muted-foreground">{maxScore}</p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">Score:</p>
                <p className="text-sm text-muted-foreground">{score}</p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm">Academic Year:</p>
                <p className="text-sm text-muted-foreground">{academicYear}</p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">Date Captured:</p>
                <p className="text-sm text-muted-foreground">
                  {moment(createdAt).format("DD-MM-YYYY: HH:mm")}
                </p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium">Teacher:</p>
                <p className="text-sm text-muted-foreground">
                  {staff?.firstName} {staff?.lastName}
                </p>
              </div>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
};
