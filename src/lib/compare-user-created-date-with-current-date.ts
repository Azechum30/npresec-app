export const isUserOlderThanTwelveMonths = (date: Date | string): boolean => {
  const createdDate = new Date(date);
  const now = new Date();

  const TWELVE_MONTHS_IN_MS = 60 * 60 * 24 * 365 * 1000;

  const timeDifference = now.getTime() - createdDate.getTime();

  return timeDifference > TWELVE_MONTHS_IN_MS;
};
