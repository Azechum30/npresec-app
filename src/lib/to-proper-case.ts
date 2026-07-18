export const toProperCase = (val: string | number): string => {
  return String(val)
    .replace(/([A-Z])/g, " $1")
    .replaceAll(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
