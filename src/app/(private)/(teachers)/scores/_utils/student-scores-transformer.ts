import { GradeResponseType } from "@/lib/types";
import { AssesessmentSchema, Semester } from "@/lib/validation";
import moment from "moment";

export const studentScoresTransformer = (scores: GradeResponseType) => {
  return {
    "Student Number": scores.student.studentNumber,
    "First Name": scores.student.firstName,
    "Last Name": scores.student.lastName,
    Gender: scores.student.gender,
    Class: scores.student.currentClass?.name || "N/A",
    Department: scores.student.currentClass?.department?.name || "N/A",
    Form: scores.student.currentClass?.level.split("_").join(" ") || "N/A",
    Subject: scores.course.title,
    Score: scores.score,
    "Max Score": scores.maxScore,
    Weight: scores.weight,
    Semester: scores.semester as (typeof Semester)[number],
    "Academic Year": scores.academicYear,
    "Assessment Type":
      scores.assessmentType as (typeof AssesessmentSchema)[number],
    "Date Graded": moment(scores.createdAt).format("DD-MM-YYYY"),
  };
};
