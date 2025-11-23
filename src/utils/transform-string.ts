export const transformString = (input: string) => {
  return input
    .split(/[-_ ]+/) // Split by hyphen, underscore, or space
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
