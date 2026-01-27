/**
 * RC Circuit Calculator
 * Time constant, cutoff frequency, and step response
 */

import { DerivationStep } from './resistors';

export interface RCResult {
  timeConstant: number;
  cutoffFrequency: number;
  riseTimes: {
    percent: number;
    time: number;
    voltage: number;
  }[];
  steps: DerivationStep[];
}

/**
 * Calculate RC time constant and cutoff frequency
 * τ = R × C
 * f_c = 1 / (2π × R × C)
 */
export function rcTimeConstant(
  resistance: number,
  capacitance: number,
  vIn: number = 1
): RCResult {
  const steps: DerivationStep[] = [];

  // Validate inputs
  if (resistance <= 0) {
    throw new Error('Resistance must be positive');
  }
  if (capacitance <= 0) {
    throw new Error('Capacitance must be positive');
  }
  if (!Number.isFinite(resistance) || !Number.isFinite(capacitance)) {
    throw new Error('Values must be finite numbers');
  }

  steps.push({
    description: 'Time constant formula',
    formula: 'τ = R × C',
    result: 0,
    formatted: ''
  });

  const timeConstant = resistance * capacitance;
  steps.push({
    description: 'Calculate time constant',
    formula: `τ = ${resistance}Ω × ${capacitance}F = ${timeConstant.toExponential(4)}s`,
    result: timeConstant,
    formatted: `${timeConstant.toExponential(4)}s`
  });

  steps.push({
    description: 'Cutoff frequency formula (−3dB point)',
    formula: 'f_c = 1 / (2π × τ)',
    result: 0,
    formatted: ''
  });

  const cutoffFrequency = 1 / (2 * Math.PI * timeConstant);
  steps.push({
    description: 'Calculate cutoff frequency',
    formula: `f_c = 1 / (2π × ${timeConstant.toExponential(4)}s) = ${cutoffFrequency.toFixed(2)}Hz`,
    result: cutoffFrequency,
    formatted: `${cutoffFrequency.toFixed(2)}Hz`
  });

  // Step response percentages
  steps.push({
    description: 'Step response: V(t) = V_in × (1 − e^(−t/τ))',
    formula: 'At t = nτ, voltage reaches specific percentages',
    result: 0,
    formatted: ''
  });

  const riseTimes = [
    { multiplier: 1, percent: 63.2 },
    { multiplier: 2, percent: 86.5 },
    { multiplier: 3, percent: 95.0 },
    { multiplier: 4, percent: 98.2 },
    { multiplier: 5, percent: 99.3 },
  ].map(({ multiplier, percent }) => {
    const time = timeConstant * multiplier;
    const voltage = vIn * (1 - Math.exp(-multiplier));
    return { percent, time, voltage };
  });

  riseTimes.forEach(({ percent, time }, i) => {
    steps.push({
      description: `At t = ${i + 1}τ`,
      formula: `V = ${percent.toFixed(1)}% of V_in (t = ${time.toExponential(3)}s)`,
      result: time,
      formatted: `${percent.toFixed(1)}%`
    });
  });

  return {
    timeConstant,
    cutoffFrequency,
    riseTimes,
    steps
  };
}

/**
 * Calculate voltage at a specific time during step response
 */
export function rcVoltageAtTime(
  resistance: number,
  capacitance: number,
  time: number,
  vIn: number = 1
): number {
  const tau = resistance * capacitance;
  return vIn * (1 - Math.exp(-time / tau));
}

/**
 * Calculate time to reach a specific voltage
 */
export function rcTimeToVoltage(
  resistance: number,
  capacitance: number,
  targetVoltage: number,
  vIn: number = 1
): number {
  if (targetVoltage >= vIn) {
    return Infinity; // Never reaches or exceeds input
  }
  const tau = resistance * capacitance;
  return -tau * Math.log(1 - targetVoltage / vIn);
}
