import { useEffect, useState } from "react";

const AssessmentTimeLineCountDown = ({
  date,
  countdownLabel,
}: {
  date: Date;
  countdownLabel: string;
}) => {
  // Helper to calculate time left
  const calculateTimeLeft = (targetDate: Date) => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {} as {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [date]);

  return (
    <div>
      <TimerDisplay time={timeLeft} label={countdownLabel} />
    </div>
  );
};

export default AssessmentTimeLineCountDown;

const TimerDisplay = ({
  time,
  label,
}: {
  time: { days: number; hours: number; minutes: number; seconds: number };
  label: string;
}) => (
  <div className="flex items-center gap-4">
    <h3 className="font-semibold uppercase">{label}:</h3>
    <div className="rounded-md bg-card border p-3 flex">
      <span className="font-bold text-base bg-gradient-to-b from-primary to-secondary text-transparent bg-clip-text p-1.5 not-last-of-type:border-r">
        {time.days}d{" "}
      </span>
      <span className="font-bold text-base bg-gradient-to-b from-primary to-secondary text-transparent bg-clip-text p-1.5 not-last-of-type:border-r">
        {time.hours}h{" "}
      </span>
      <span className="font-bold text-base bg-gradient-to-b from-primary to-secondary text-transparent bg-clip-text p-1.5 not-last-of-type:border-r">
        {time.minutes}m{" "}
      </span>
      <span className="font-bold text-base bg-gradient-to-b from-primary to-secondary text-transparent bg-clip-text p-1.5 not-last-of-type:border-r">
        {time.seconds}s
      </span>
    </div>
  </div>
);
