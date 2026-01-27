/**
 * LED Resistor Calculator
 * Calculate current-limiting resistor for LEDs
 */

import { DerivationStep } from './resistors';

export interface LEDResult {
  resistorValue: number;
  nearestE24: number;
  powerDissipation: number;
  suggestedWattage: number;
  actualCurrent: number;
  steps: DerivationStep[];
}

// E24 series values (multiplied by decade)
const E24_VALUES = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];

/**
 * Find nearest E24 standard resistor value
 */
export function nearestE24(value: number): number {
  if (value <= 0 || !Number.isFinite(value)) {
    return 0;
  }

  // Find the decade
  const decade = Math.floor(Math.log10(value));
  const multiplier = Math.pow(10, decade);
  const normalized = value / multiplier;

  // Find nearest E24 value
  let nearest = E24_VALUES[0];
  let minDiff = Math.abs(normalized - nearest);

  for (const e24 of E24_VALUES) {
    const diff = Math.abs(normalized - e24);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = e24;
    }
  }

  // Also check next decade down
  for (const e24 of E24_VALUES) {
    const scaledE24 = e24 * 10;
    const diff = Math.abs(normalized - scaledE24);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = scaledE24;
    }
  }

  return nearest * multiplier;
}

/**
 * Calculate LED current-limiting resistor
 * @param vSource - Source voltage (V)
 * @param vForward - LED forward voltage (V)
 * @param targetCurrent - Target LED current (A)
 */
export function ledResistor(
  vSource: number,
  vForward: number,
  targetCurrent: number
): LEDResult {
  const steps: DerivationStep[] = [];

  // Validate inputs
  if (vSource <= 0) {
    throw new Error('Source voltage must be positive');
  }
  if (vForward < 0) {
    throw new Error('Forward voltage cannot be negative');
  }
  if (vForward >= vSource) {
    throw new Error('Forward voltage must be less than source voltage');
  }
  if (targetCurrent <= 0) {
    throw new Error('Target current must be positive');
  }

  steps.push({
    description: 'Apply Kirchhoff\'s voltage law',
    formula: 'V_source = V_resistor + V_LED',
    result: 0,
    formatted: ''
  });

  const vResistor = vSource - vForward;
  steps.push({
    description: 'Calculate voltage across resistor',
    formula: `V_R = ${vSource}V - ${vForward}V = ${vResistor.toFixed(2)}V`,
    result: vResistor,
    formatted: `${vResistor.toFixed(2)}V`
  });

  steps.push({
    description: 'Apply Ohm\'s law to find resistance',
    formula: 'R = V_R / I',
    result: 0,
    formatted: ''
  });

  const resistorValue = vResistor / targetCurrent;
  const currentmA = targetCurrent * 1000;
  steps.push({
    description: 'Calculate resistance value',
    formula: `R = ${vResistor.toFixed(2)}V / ${currentmA.toFixed(1)}mA = ${resistorValue.toFixed(1)}Ω`,
    result: resistorValue,
    formatted: `${resistorValue.toFixed(1)}Ω`
  });

  const nearestE24Value = nearestE24(resistorValue);
  steps.push({
    description: 'Select nearest E24 standard value',
    formula: `R_E24 = ${nearestE24Value}Ω`,
    result: nearestE24Value,
    formatted: `${nearestE24Value}Ω`
  });

  // Calculate actual current with E24 resistor
  const actualCurrent = vResistor / nearestE24Value;
  const actualCurrentmA = actualCurrent * 1000;
  steps.push({
    description: 'Calculate actual current with standard resistor',
    formula: `I_actual = ${vResistor.toFixed(2)}V / ${nearestE24Value}Ω = ${actualCurrentmA.toFixed(2)}mA`,
    result: actualCurrent,
    formatted: `${actualCurrentmA.toFixed(2)}mA`
  });

  // Calculate power dissipation
  const powerDissipation = vResistor * actualCurrent;
  steps.push({
    description: 'Calculate power dissipated in resistor',
    formula: `P = V × I = ${vResistor.toFixed(2)}V × ${actualCurrentmA.toFixed(2)}mA = ${(powerDissipation * 1000).toFixed(2)}mW`,
    result: powerDissipation,
    formatted: `${(powerDissipation * 1000).toFixed(2)}mW`
  });

  // Suggest wattage with 2x safety margin
  const suggestedWattage = getSuggestedWattage(powerDissipation);
  steps.push({
    description: 'Recommended resistor wattage (2× safety margin)',
    formula: `P_rated ≥ ${(powerDissipation * 2 * 1000).toFixed(1)}mW → Use ${suggestedWattage}W`,
    result: suggestedWattage,
    formatted: `${suggestedWattage}W`
  });

  return {
    resistorValue,
    nearestE24: nearestE24Value,
    powerDissipation,
    suggestedWattage,
    actualCurrent,
    steps
  };
}

function getSuggestedWattage(power: number): number {
  const safetyFactor = 2;
  const targetPower = power * safetyFactor;
  
  const standardWattages = [0.0625, 0.125, 0.25, 0.5, 1, 2, 3, 5, 10];
  
  for (const w of standardWattages) {
    if (w >= targetPower) {
      return w;
    }
  }
  
  return standardWattages[standardWattages.length - 1];
}
