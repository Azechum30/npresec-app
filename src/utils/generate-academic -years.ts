export const generateAcademicYears = (length: number) => {
  const years = [];

  const currentYear = new Date().getFullYear();

  const startBase = currentYear - 1;
  for (let a = 0; a < length; a++) {
    const start = startBase + a;
    const next = start + 1;

    years.push(`${start}/${next}`);
  }

  return years;
};
