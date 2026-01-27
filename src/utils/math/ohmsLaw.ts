/**
 * Ohm's Law & Power Calculator
 * V = I × R, P = V × I = V²/R = I²R
 */

import { DerivationStep } from './resistors';

export interface OhmsLawResult {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
  steps: DerivationStep[];
}

type KnownValues = 
  | { voltage: number; current: number }
  | { voltage: number; resistance: number }
  | { current: number; resistance: number }
  | { voltage: number; power: number }
  | { current: number; power: number }
  | { resistance: number; power: number };

/**
 * Calculate all electrical values from any two known values
 */
export function ohmsLaw(known: KnownValues): OhmsLawResult {
  const steps: DerivationStep[] = [];
  let voltage: number;
  let current: number;
  let resistance: number;
  let power: number;

  if ('voltage' in known && 'current' in known) {
    voltage = known.voltage;
    current = known.current;

    if (voltage < 0 || current < 0) {
      throw new Error('Voltage and current must be non-negative');
    }

    steps.push({
      description: 'Given voltage and current',
      formula: `V = ${voltage}V, I = ${current}A`,
      result: 0,
      formatted: ''
    });

    resistance = current > 0 ? voltage / current : Infinity;
    steps.push({
      description: 'Calculate resistance (Ohm\'s Law)',
      formula: `R = V / I = ${voltage}V / ${current}A = ${resistance.toFixed(4)}Ω`,
      result: resistance,
      formatted: `${resistance.toFixed(4)}Ω`
    });

    power = voltage * current;
    steps.push({
      description: 'Calculate power',
      formula: `P = V × I = ${voltage}V × ${current}A = ${power.toFixed(4)}W`,
      result: power,
      formatted: `${power.toFixed(4)}W`
    });
  } else if ('voltage' in known && 'resistance' in known) {
    voltage = known.voltage;
    resistance = known.resistance;

    if (voltage < 0 || resistance <= 0) {
      throw new Error('Voltage must be non-negative, resistance must be positive');
    }

    steps.push({
      description: 'Given voltage and resistance',
      formula: `V = ${voltage}V, R = ${resistance}Ω`,
      result: 0,
      formatted: ''
    });

    current = voltage / resistance;
    steps.push({
      description: 'Calculate current (Ohm\'s Law)',
      formula: `I = V / R = ${voltage}V / ${resistance}Ω = ${current.toFixed(6)}A`,
      result: current,
      formatted: `${current.toFixed(6)}A`
    });

    power = (voltage * voltage) / resistance;
    steps.push({
      description: 'Calculate power',
      formula: `P = V² / R = ${voltage}² / ${resistance} = ${power.toFixed(4)}W`,
      result: power,
      formatted: `${power.toFixed(4)}W`
    });
  } else if ('current' in known && 'resistance' in known) {
    current = known.current;
    resistance = known.resistance;

    if (current < 0 || resistance <= 0) {
      throw new Error('Current must be non-negative, resistance must be positive');
    }

    steps.push({
      description: 'Given current and resistance',
      formula: `I = ${current}A, R = ${resistance}Ω`,
      result: 0,
      formatted: ''
    });

    voltage = current * resistance;
    steps.push({
      description: 'Calculate voltage (Ohm\'s Law)',
      formula: `V = I × R = ${current}A × ${resistance}Ω = ${voltage.toFixed(4)}V`,
      result: voltage,
      formatted: `${voltage.toFixed(4)}V`
    });

    power = current * current * resistance;
    steps.push({
      description: 'Calculate power',
      formula: `P = I² × R = ${current}² × ${resistance} = ${power.toFixed(4)}W`,
      result: power,
      formatted: `${power.toFixed(4)}W`
    });
  } else if ('voltage' in known && 'power' in known) {
    voltage = known.voltage;
    power = known.power;

    if (voltage <= 0 || power < 0) {
      throw new Error('Voltage must be positive, power must be non-negative');
    }

    steps.push({
      description: 'Given voltage and power',
      formula: `V = ${voltage}V, P = ${power}W`,
      result: 0,
      formatted: ''
    });

    current = power / voltage;
    steps.push({
      description: 'Calculate current',
      formula: `I = P / V = ${power}W / ${voltage}V = ${current.toFixed(6)}A`,
      result: current,
      formatted: `${current.toFixed(6)}A`
    });

    resistance = (voltage * voltage) / power;
    steps.push({
      description: 'Calculate resistance',
      formula: `R = V² / P = ${voltage}² / ${power} = ${resistance.toFixed(4)}Ω`,
      result: resistance,
      formatted: `${resistance.toFixed(4)}Ω`
    });
  } else if ('current' in known && 'power' in known) {
    current = known.current;
    power = known.power;

    if (current <= 0 || power < 0) {
      throw new Error('Current must be positive, power must be non-negative');
    }

    steps.push({
      description: 'Given current and power',
      formula: `I = ${current}A, P = ${power}W`,
      result: 0,
      formatted: ''
    });

    voltage = power / current;
    steps.push({
      description: 'Calculate voltage',
      formula: `V = P / I = ${power}W / ${current}A = ${voltage.toFixed(4)}V`,
      result: voltage,
      formatted: `${voltage.toFixed(4)}V`
    });

    resistance = power / (current * current);
    steps.push({
      description: 'Calculate resistance',
      formula: `R = P / I² = ${power} / ${current}² = ${resistance.toFixed(4)}Ω`,
      result: resistance,
      formatted: `${resistance.toFixed(4)}Ω`
    });
  } else if ('resistance' in known && 'power' in known) {
    resistance = known.resistance;
    power = known.power;

    if (resistance <= 0 || power < 0) {
      throw new Error('Resistance must be positive, power must be non-negative');
    }

    steps.push({
      description: 'Given resistance and power',
      formula: `R = ${resistance}Ω, P = ${power}W`,
      result: 0,
      formatted: ''
    });

    voltage = Math.sqrt(power * resistance);
    steps.push({
      description: 'Calculate voltage',
      formula: `V = √(P × R) = √(${power} × ${resistance}) = ${voltage.toFixed(4)}V`,
      result: voltage,
      formatted: `${voltage.toFixed(4)}V`
    });

    current = Math.sqrt(power / resistance);
    steps.push({
      description: 'Calculate current',
      formula: `I = √(P / R) = √(${power} / ${resistance}) = ${current.toFixed(6)}A`,
      result: current,
      formatted: `${current.toFixed(6)}A`
    });
  } else {
    throw new Error('Must provide exactly two known values');
  }

  return { voltage, current, resistance, power, steps };
}
