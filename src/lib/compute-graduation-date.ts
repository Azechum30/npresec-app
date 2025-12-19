export const computeGraduationDate = (
  entryDate: Date | string,
  semesterCount: number = 6,
  monthsInSemester: number = 4,
  breakMonths: number = 5
): Date => {
  const formattedDate =
    typeof entryDate === "string" ? new Date(entryDate) : entryDate;

  const studyPeriod = semesterCount * monthsInSemester;
  const graduationDate = new Date(formattedDate);
  graduationDate.setMonth(
    graduationDate.getMonth() + studyPeriod + breakMonths
  );
  return graduationDate;
};
