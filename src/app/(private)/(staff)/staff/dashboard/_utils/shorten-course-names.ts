export const shortenCourseNames = (name: string) => {
  let cleaned = name.replace(/^['"]|['"]$/g, "");

  // 2. Map of common long words to short abbreviations
  const dictionary: Record<string, string> = {
    Mathematics: "Math",
    Elective: "Elec",
    Core: "Cor",
    English: "Eng",
    Science: "Sci",
    Integrated: "Int",
    Information: "Info",
    Technology: "Tech",
    Language: "Lang",
    Geography: "Geog",
    Government: "Gov't",
    Economics: "Econs",
    Social: "Soc",
    Studies: "Stu",
  };

  Object.keys(dictionary).forEach((key) => {
    const regex = new RegExp(`\\b${key}\\b`, "gi");
    cleaned = cleaned.replace(regex, dictionary[key]);
  });

  return cleaned;
};
