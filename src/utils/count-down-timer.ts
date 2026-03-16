export const countDownTimer = (date: Date) => {
  const targetTime = new Date(date).getTime();
  const now = new Date().getTime();

  const difference = targetTime - now;
};
