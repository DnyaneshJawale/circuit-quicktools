/**
 * Series/Parallel RLC Equivalent Calculator
 * Calculate equivalent resistance, capacitance, and inductance for series/parallel combinations
 */

export interface RLCResult {
  value: number;
  unit: string;
  formatted: string;
  steps: string[];
}

/**
 * Calculate equivalent resistance for series connection
 * R_eq = R1 + R2 + ... + Rn
 */
export function equivalentResistanceSeries(resistances: number[]): RLCResult {
  if (resistances.length === 0) {
    throw new Error('At least one resistance value required');
  }

  const sum = resistances.reduce((acc, r) => {
    if (r < 0 || !Number.isFinite(r)) {
      throw new Error('Resistance values must be positive finite numbers');
    }
    return acc + r;
  }, 0);

  return {
    value: sum,
    unit: 'Ω',
    formatted: `${sum.toFixed(4)} Ω`,
    steps: [
      `Sum of all resistances: ${resistances.join(' + ')} = ${sum.toFixed(4)} Ω`
    ]
  };
}

/**
 * Calculate equivalent resistance for parallel connection
 * 1/R_eq = 1/R1 + 1/R2 + ... + 1/Rn
 */
export function equivalentResistanceParallel(resistances: number[]): RLCResult {
  if (resistances.length === 0) {
    throw new Error('At least one resistance value required');
  }

  if (resistances.some(r => r === 0)) {
    throw new Error('Resistance values cannot be zero');
  }

  const reciprocalSum = resistances.reduce((acc, r) => {
    if (r < 0 || !Number.isFinite(r)) {
      throw new Error('Resistance values must be positive finite numbers');
    }
    return acc + (1 / r);
  }, 0);

  const value = 1 / reciprocalSum;

  return {
    value,
    unit: 'Ω',
    formatted: `${value.toFixed(4)} Ω`,
    steps: [
      `Reciprocal sum: ${resistances.map(r => `1/${r}`).join(' + ')}`,
      `1/R_eq = ${reciprocalSum.toFixed(6)}`,
      `R_eq = ${value.toFixed(4)} Ω`
    ]
  };
}

/**
 * Calculate equivalent capacitance for series connection
 * 1/C_eq = 1/C1 + 1/C2 + ... + 1/Cn
 */
export function equivalentCapacitanceSeries(capacitances: number[]): RLCResult {
  if (capacitances.length === 0) {
    throw new Error('At least one capacitance value required');
  }

  if (capacitances.some(c => c === 0)) {
    throw new Error('Capacitance values cannot be zero');
  }

  const reciprocalSum = capacitances.reduce((acc, c) => {
    if (c < 0 || !Number.isFinite(c)) {
      throw new Error('Capacitance values must be positive finite numbers');
    }
    return acc + (1 / c);
  }, 0);

  const value = 1 / reciprocalSum;

  return {
    value,
    unit: 'F',
    formatted: `${formatScientific(value)} F`,
    steps: [
      `Series capacitances (reciprocals add):`,
      `1/C_eq = ${reciprocalSum.toFixed(6)}`,
      `C_eq = ${formatScientific(value)} F`
    ]
  };
}

/**
 * Calculate equivalent capacitance for parallel connection
 * C_eq = C1 + C2 + ... + Cn
 */
export function equivalentCapacitanceParallel(capacitances: number[]): RLCResult {
  if (capacitances.length === 0) {
    throw new Error('At least one capacitance value required');
  }

  const sum = capacitances.reduce((acc, c) => {
    if (c < 0 || !Number.isFinite(c)) {
      throw new Error('Capacitance values must be positive finite numbers');
    }
    return acc + c;
  }, 0);

  return {
    value: sum,
    unit: 'F',
    formatted: `${formatScientific(sum)} F`,
    steps: [
      `Parallel capacitances add directly:`,
      `C_eq = ${capacitances.join(' + ')} = ${formatScientific(sum)} F`
    ]
  };
}

/**
 * Calculate equivalent inductance for series connection
 * L_eq = L1 + L2 + ... + Ln
 */
export function equivalentInductanceSeries(inductances: number[]): RLCResult {
  if (inductances.length === 0) {
    throw new Error('At least one inductance value required');
  }

  const sum = inductances.reduce((acc, l) => {
    if (l < 0 || !Number.isFinite(l)) {
      throw new Error('Inductance values must be positive finite numbers');
    }
    return acc + l;
  }, 0);

  return {
    value: sum,
    unit: 'H',
    formatted: `${formatScientific(sum)} H`,
    steps: [
      `Series inductances add directly (no mutual inductance):`,
      `L_eq = ${inductances.map(l => formatScientific(l)).join(' + ')} = ${formatScientific(sum)} H`
    ]
  };
}

/**
 * Calculate equivalent inductance for parallel connection
 * 1/L_eq = 1/L1 + 1/L2 + ... + 1/Ln
 */
export function equivalentInductanceParallel(inductances: number[]): RLCResult {
  if (inductances.length === 0) {
    throw new Error('At least one inductance value required');
  }

  if (inductances.some(l => l === 0)) {
    throw new Error('Inductance values cannot be zero');
  }

  const reciprocalSum = inductances.reduce((acc, l) => {
    if (l < 0 || !Number.isFinite(l)) {
      throw new Error('Inductance values must be positive finite numbers');
    }
    return acc + (1 / l);
  }, 0);

  const value = 1 / reciprocalSum;

  return {
    value,
    unit: 'H',
    formatted: `${formatScientific(value)} H`,
    steps: [
      `Parallel inductances (reciprocals add, no mutual inductance):`,
      `1/L_eq = ${reciprocalSum.toFixed(6)}`,
      `L_eq = ${formatScientific(value)} H`
    ]
  };
}

/**
 * Helper function to format very small/large numbers in scientific notation
 */
function formatScientific(value: number): string {
  if (value === 0) return '0';
  
  const absValue = Math.abs(value);
  
  // Use scientific notation for very small or very large numbers
  if (absValue < 1e-6 || absValue > 1e6) {
    return value.toExponential(4).replace(/e\+?/, ' × 10^').replace(/e-/, ' × 10^-');
  }
  
  // Otherwise use regular notation
  return value.toFixed(4);
}
