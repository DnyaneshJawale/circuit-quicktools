/**
 * Capacitor Calculations
 * Pure mathematical functions for capacitor circuit analysis
 */

import { DerivationStep } from './resistors';

export interface CapacitorResult {
  value: number;
  steps: DerivationStep[];
}

/**
 * Calculate series capacitance
 * 1/C_total = 1/C1 + 1/C2 + ... + 1/Cn
 * (Note: opposite of resistors!)
 */
export function seriesCapacitance(capacitors: number[]): CapacitorResult {
  if (capacitors.length === 0) {
    return { value: 0, steps: [] };
  }

  // Validate inputs
  for (const c of capacitors) {
    if (c < 0) {
      throw new Error('Capacitor values cannot be negative');
    }
    if (!Number.isFinite(c)) {
      throw new Error('Capacitor values must be finite numbers');
    }
    if (c === 0) {
      throw new Error('Capacitor values cannot be zero (would block DC)');
    }
  }

  const steps: DerivationStep[] = [];

  if (capacitors.length === 1) {
    return {
      value: capacitors[0],
      steps: [{
        description: 'Single capacitor',
        formula: `C = ${capacitors[0]}F`,
        result: capacitors[0],
        formatted: `${capacitors[0]}F`
      }]
    };
  }

  const formulaParts = capacitors.map((_, i) => `1/C${i + 1}`).join(' + ');
  const valueParts = capacitors.map(c => `1/${c}`).join(' + ');

  steps.push({
    description: 'For series capacitors, reciprocals add',
    formula: `1/C_total = ${formulaParts}`,
    result: 0,
    formatted: ''
  });

  steps.push({
    description: 'Substitute values',
    formula: `1/C_total = ${valueParts}`,
    result: 0,
    formatted: ''
  });

  const reciprocalSum = capacitors.reduce((sum, c) => sum + (1 / c), 0);

  steps.push({
    description: 'Calculate sum of reciprocals',
    formula: `1/C_total = ${reciprocalSum.toExponential(4)}`,
    result: reciprocalSum,
    formatted: `${reciprocalSum.toExponential(4)}`
  });

  const result = 1 / reciprocalSum;

  steps.push({
    description: 'Take reciprocal for final result',
    formula: `C_total = ${result.toExponential(4)}F`,
    result: result,
    formatted: `${result.toExponential(4)}F`
  });

  return { value: result, steps };
}

/**
 * Calculate parallel capacitance
 * C_total = C1 + C2 + ... + Cn
 * (Note: opposite of resistors!)
 */
export function parallelCapacitance(capacitors: number[]): CapacitorResult {
  if (capacitors.length === 0) {
    return { value: 0, steps: [] };
  }

  // Validate inputs
  for (const c of capacitors) {
    if (c < 0) {
      throw new Error('Capacitor values cannot be negative');
    }
    if (!Number.isFinite(c)) {
      throw new Error('Capacitor values must be finite numbers');
    }
  }

  const steps: DerivationStep[] = [];

  if (capacitors.length === 1) {
    return {
      value: capacitors[0],
      steps: [{
        description: 'Single capacitor',
        formula: `C = ${capacitors[0]}F`,
        result: capacitors[0],
        formatted: `${capacitors[0]}F`
      }]
    };
  }

  const formulaParts = capacitors.map((_, i) => `C${i + 1}`).join(' + ');
  const valueParts = capacitors.map(c => `${c}`).join(' + ');

  steps.push({
    description: 'Parallel capacitors add directly',
    formula: `C_total = ${formulaParts}`,
    result: 0,
    formatted: ''
  });

  steps.push({
    description: 'Substitute values',
    formula: `C_total = ${valueParts}`,
    result: 0,
    formatted: ''
  });

  const result = capacitors.reduce((sum, c) => sum + c, 0);

  steps.push({
    description: 'Calculate sum',
    formula: `C_total = ${result.toExponential(4)}F`,
    result: result,
    formatted: `${result.toExponential(4)}F`
  });

  return { value: result, steps };
}
