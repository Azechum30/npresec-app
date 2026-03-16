export const isArrayOfString = (data: any): boolean => {
  return (
    Array.isArray(data) && data.every((value) => typeof value === "string")
  );
};
