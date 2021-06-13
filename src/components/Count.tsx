import React from 'react';
import CountUp from 'react-countup';

// Types
interface CountProps {
  start?: number;
  end: number;
  prefix: string;
  suffix: string;
  duration?: number;
  decimals?: number;
}

function Count({
  start = 0,
  end,
  prefix,
  suffix,
  duration = 3,
  decimals = 0,
}: CountProps) {
  return (
    <CountUp
      start={start}
      end={end}
      duration={duration}
      separator=","
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      useEasing
    />
  );
}

export default Count;
