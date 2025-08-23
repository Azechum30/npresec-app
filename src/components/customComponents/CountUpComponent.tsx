"use client";

import CountUp from "react-countup";

type Props = {
  countTo: number;
};

export const CountUpComponent = ({ countTo }: Props) => {
  return <CountUp end={countTo} enableScrollSpy separator="" />;
};
