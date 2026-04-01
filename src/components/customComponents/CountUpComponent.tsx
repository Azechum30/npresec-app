"use client";

import CountUp from "react-countup";

type Props = {
  countTo: number;
};

export const CountUpComponent = ({ countTo }: Props) => {
  return <CountUp end={countTo} className="text-4xl font-bold" separator="" />;
};
