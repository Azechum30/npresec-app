const RETIREMENT_AGE = 60;
const MONTHS_IN_YEAR = 12;
const RETIREMENT_AGE_MONTHS = 0;

export function yearsAndMonthsUntilRetirement(birthDate: Date): {
  remainingYears: number;
  remainingMonths: number;
} {
  const bornDate = new Date(birthDate);
  const today = new Date();

  let ageYears = today.getFullYear() - bornDate.getFullYear();
  let ageMonths = today.getMonth() - bornDate.getMonth();

  if (today.getDate() < bornDate.getDate()) {
    ageMonths--;
  }

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += MONTHS_IN_YEAR;
  }

  let remainingYears = RETIREMENT_AGE - ageYears;
  let remainingMonths = RETIREMENT_AGE_MONTHS - ageMonths;

  if (remainingMonths < 0) {
    remainingYears--;
    remainingMonths += MONTHS_IN_YEAR;
  }

  if (remainingYears < 0 || (remainingYears === 0 && remainingMonths <= 0)) {
    return { remainingYears: 0, remainingMonths: 0 };
  }

  return { remainingYears, remainingMonths };
}
