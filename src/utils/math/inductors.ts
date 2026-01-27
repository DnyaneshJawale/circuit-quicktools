/**
 * Inductor Calculations
 * Pure mathematical functions for inductor circuit analysis
 */

import { DerivationStep } from './resistors';

export interface InductorResult {
  value: number;
  steps: DerivationStep[];
}

/**
 * Calculate series inductance
 * L_total = L1 + L2 + ... + Ln
 * (Same as resistors)
 */
export function seriesInductance(inductors: number[]): InductorResult {
  if (inductors.length === 0) {
    return { value: 0, steps: [] };
  }

  // Validate inputs
  for (const l of inductors) {
    if (l < 0) {
      throw new Error('Inductor values cannot be negative');
    }
    if (!Number.isFinite(l)) {
      throw new Error('Inductor values must be finite numbers');
    }
  }

  const steps: DerivationStep[] = [];

  if (inductors.length === 1) {
    return {
      value: inductors[0],
      steps: [{
        description: 'Single inductor',
        formula: `L = ${inductors[0]}H`,
        result: inductors[0],
        formatted: `${inductors[0]}H`
      }]
    };
  }

  const formulaParts = inductors.map((_, i) => `L${i + 1}`).join(' + ');
  const valueParts = inductors.map(l => `${l}`).join(' + ');

  steps.push({
    description: 'Series inductors add directly (assuming no mutual coupling)',
    formula: `L_total = ${formulaParts}`,
    result: 0,
    formatted: ''
  });

  steps.push({
    description: 'Substitute values',
    formula: `L_total = ${valueParts}`,
    result: 0,
    formatted: ''
  });

  const result = inductors.reduce((sum, l) => sum + l, 0);

  steps.push({
    description: 'Calculate sum',
    formula: `L_total = ${result.toExponential(4)}H`,
    result: result,
    formatted: `${result.toExponential(4)}H`
  });

  return { value: result, steps };
}

/**
 * Calculate parallel inductance
 * 1/L_total = 1/L1 + 1/L2 + ... + 1/Ln
 * (Same as resistors)
 */
export function parallelInductance(inductors: number[]): InductorResult {
  if (inductors.length === 0) {
    return { value: 0, steps: [] };
  }

  // Validate inputs
  for (const l of inductors) {
    if (l < 0) {
      throw new Error('Inductor values cannot be negative');
    }
    if (!Number.isFinite(l)) {
      throw new Error('Inductor values must be finite numbers');
    }
    if (l === 0) {
      throw new Error('Inductor values cannot be zero');
    }
  }

  const steps: DerivationStep[] = [];

  if (inductors.length === 1) {
    return {
      value: inductors[0],
      steps: [{
        description: 'Single inductor',
        formula: `L = ${inductors[0]}H`,
        result: inductors[0],
        formatted: `${inductors[0]}H`
      }]
    };
  }

  const formulaParts = inductors.map((_, i) => `1/L${i + 1}`).join(' + ');
  const valueParts = inductors.map(l => `1/${l}`).join(' + ');

  steps.push({
    description: 'For parallel inductors, reciprocals add',
    formula: `1/L_total = ${formulaParts}`,
    result: 0,
    formatted: ''
  });

  steps.push({
    description: 'Substitute values',
    formula: `1/L_total = ${valueParts}`,
    result: 0,
    formatted: ''
  });

  const reciprocalSum = inductors.reduce((sum, l) => sum + (1 / l), 0);

  steps.push({
    description: 'Calculate sum of reciprocals',
    formula: `1/L_total = ${reciprocalSum.toExponential(4)}`,
    result: reciprocalSum,
    formatted: `${reciprocalSum.toExponential(4)}`
  });

  const result = 1 / reciprocalSum;

  steps.push({
    description: 'Take reciprocal for final result',
    formula: `L_total = ${result.toExponential(4)}H`,
    result: result,
    formatted: `${result.toExponential(4)}H`
  });

  return { value: result, steps };
}
