export const isUserOlderThan36Days = (date: Date | string): boolean => {
  const createdDate = new Date(date);
  const now = new Date();

  const THREE_MONTHS_IN_MS = 1000 * 24 * 30 * 60 * 60 * 3;

  return now.getTime() - createdDate.getTime() > THREE_MONTHS_IN_MS;
};
