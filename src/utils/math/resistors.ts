/**
 * Resistor Calculations
 * Pure mathematical functions for resistor circuit analysis
 */

export interface DerivationStep {
  description: string;
  formula: string;
  result: number;
  formatted: string;
}

export interface ResistorResult {
  value: number;
  steps: DerivationStep[];
  tolerance?: { min: number; max: number };
}

/**
 * Calculate series resistance
 * R_total = R1 + R2 + ... + Rn
 */
export function sumSeries(resistors: number[]): ResistorResult {
  if (resistors.length === 0) {
    return { value: 0, steps: [] };
  }

  // Validate inputs
  for (const r of resistors) {
    if (r < 0) {
      throw new Error('Resistor values cannot be negative');
    }
    if (!Number.isFinite(r)) {
      throw new Error('Resistor values must be finite numbers');
    }
  }

  const steps: DerivationStep[] = [];
  let runningSum = 0;

  if (resistors.length === 1) {
    return {
      value: resistors[0],
      steps: [{
        description: 'Single resistor',
        formula: `R = ${resistors[0]}Ω`,
        result: resistors[0],
        formatted: `${resistors[0]}Ω`
      }]
    };
  }

  // Build the formula string
  const formulaParts = resistors.map((r, i) => `R${i + 1}`).join(' + ');
  const valueParts = resistors.map(r => `${r}`).join(' + ');

  steps.push({
    description: 'Series resistors add directly',
    formula: `R_total = ${formulaParts}`,
    result: 0,
    formatted: ''
  });

  steps.push({
    description: 'Substitute values',
    formula: `R_total = ${valueParts}`,
    result: 0,
    formatted: ''
  });

  runningSum = resistors.reduce((sum, r) => sum + r, 0);

  steps.push({
    description: 'Calculate sum',
    formula: `R_total = ${runningSum}Ω`,
    result: runningSum,
    formatted: `${runningSum}Ω`
  });

  return { value: runningSum, steps };
}

/**
 * Calculate parallel resistance
 * 1/R_total = 1/R1 + 1/R2 + ... + 1/Rn
 */
export function parallel(resistors: number[]): ResistorResult {
  if (resistors.length === 0) {
    return { value: 0, steps: [] };
  }

  // Validate inputs
  for (const r of resistors) {
    if (r < 0) {
      throw new Error('Resistor values cannot be negative');
    }
    if (!Number.isFinite(r)) {
      throw new Error('Resistor values must be finite numbers');
    }
  }

  // Check for zero values - parallel with 0Ω = 0Ω
  if (resistors.some(r => r === 0)) {
    return {
      value: 0,
      steps: [{
        description: 'Any resistor at 0Ω shorts the parallel combination',
        formula: 'R_total = 0Ω',
        result: 0,
        formatted: '0Ω'
      }]
    };
  }

  const steps: DerivationStep[] = [];

  if (resistors.length === 1) {
    return {
      value: resistors[0],
      steps: [{
        description: 'Single resistor',
        formula: `R = ${resistors[0]}Ω`,
        result: resistors[0],
        formatted: `${resistors[0]}Ω`
      }]
    };
  }

  // Build formula
  const formulaParts = resistors.map((_, i) => `1/R${i + 1}`).join(' + ');
  const valueParts = resistors.map(r => `1/${r}`).join(' + ');

  steps.push({
    description: 'For parallel resistors, reciprocals add',
    formula: `1/R_total = ${formulaParts}`,
    result: 0,
    formatted: ''
  });

  steps.push({
    description: 'Substitute values',
    formula: `1/R_total = ${valueParts}`,
    result: 0,
    formatted: ''
  });

  const reciprocalSum = resistors.reduce((sum, r) => sum + (1 / r), 0);
  
  steps.push({
    description: 'Calculate sum of reciprocals',
    formula: `1/R_total = ${reciprocalSum.toFixed(6)}`,
    result: reciprocalSum,
    formatted: `${reciprocalSum.toFixed(6)}`
  });

  const result = 1 / reciprocalSum;

  steps.push({
    description: 'Take reciprocal for final result',
    formula: `R_total = 1/${reciprocalSum.toFixed(6)} = ${result.toFixed(2)}Ω`,
    result: result,
    formatted: `${result.toFixed(2)}Ω`
  });

  return { value: result, steps };
}

/**
 * Calculate resistance with tolerance bounds
 */
export function withTolerance(
  resistance: number,
  tolerancePercent: number
): { nominal: number; min: number; max: number } {
  const factor = tolerancePercent / 100;
  return {
    nominal: resistance,
    min: resistance * (1 - factor),
    max: resistance * (1 + factor)
  };
}

/**
 * Calculate power dissipation
 * P = V²/R or P = I²R
 */
export function powerDissipation(
  resistance: number,
  voltage?: number,
  current?: number
): number {
  if (voltage !== undefined) {
    return (voltage * voltage) / resistance;
  }
  if (current !== undefined) {
    return current * current * resistance;
  }
  throw new Error('Either voltage or current must be provided');
}

/**
 * Suggest minimum wattage rating (2x safety margin)
 */
export function suggestWattage(powerDissipated: number): number {
  const safetyFactor = 2;
  const targetPower = powerDissipated * safetyFactor;
  
  // Standard wattage values
  const standardWattages = [0.0625, 0.125, 0.25, 0.5, 1, 2, 3, 5, 10, 25, 50];
  
  for (const w of standardWattages) {
    if (w >= targetPower) {
      return w;
    }
  }
  
  return standardWattages[standardWattages.length - 1];
}
