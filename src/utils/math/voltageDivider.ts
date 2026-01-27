/**
 * Voltage Divider Calculator
 * Includes load impedance effects
 */

import { DerivationStep } from './resistors';

export interface VoltageDividerResult {
  vOut: number;
  vOutLoaded?: number;
  loadEffect?: number;
  loadWarning?: string;
  steps: DerivationStep[];
}

/**
 * Calculate unloaded voltage divider output
 * Vout = Vin × R2 / (R1 + R2)
 */
export function voltageDivider(
  vIn: number,
  r1: number,
  r2: number
): VoltageDividerResult {
  const steps: DerivationStep[] = [];

  // Validate inputs
  if (vIn < 0) {
    throw new Error('Input voltage cannot be negative');
  }
  if (r1 <= 0 || r2 <= 0) {
    throw new Error('Resistor values must be positive');
  }
  if (!Number.isFinite(r1) || !Number.isFinite(r2)) {
    throw new Error('Resistor values must be finite numbers');
  }

  steps.push({
    description: 'Voltage divider formula',
    formula: 'V_out = V_in × R2 / (R1 + R2)',
    result: 0,
    formatted: ''
  });

  steps.push({
    description: 'Substitute values',
    formula: `V_out = ${vIn}V × ${r2}Ω / (${r1}Ω + ${r2}Ω)`,
    result: 0,
    formatted: ''
  });

  const dividerRatio = r2 / (r1 + r2);
  steps.push({
    description: 'Calculate divider ratio',
    formula: `R2 / (R1 + R2) = ${r2} / ${r1 + r2} = ${dividerRatio.toFixed(4)}`,
    result: dividerRatio,
    formatted: dividerRatio.toFixed(4)
  });

  const vOut = vIn * dividerRatio;
  steps.push({
    description: 'Calculate output voltage',
    formula: `V_out = ${vIn}V × ${dividerRatio.toFixed(4)} = ${vOut.toFixed(4)}V`,
    result: vOut,
    formatted: `${vOut.toFixed(4)}V`
  });

  return { vOut, steps };
}

/**
 * Calculate voltage divider with load resistance
 * R2_effective = R2 || R_load
 * Vout = Vin × R2_eff / (R1 + R2_eff)
 */
export function voltageDividerWithLoad(
  vIn: number,
  r1: number,
  r2: number,
  rLoad: number
): VoltageDividerResult {
  const steps: DerivationStep[] = [];

  // Validate inputs
  if (vIn < 0) {
    throw new Error('Input voltage cannot be negative');
  }
  if (r1 <= 0 || r2 <= 0 || rLoad <= 0) {
    throw new Error('All resistance values must be positive');
  }

  // First calculate unloaded
  steps.push({
    description: 'Unloaded divider formula',
    formula: 'V_out(unloaded) = V_in × R2 / (R1 + R2)',
    result: 0,
    formatted: ''
  });

  const vOutUnloaded = vIn * r2 / (r1 + r2);
  steps.push({
    description: 'Unloaded output voltage',
    formula: `V_out(unloaded) = ${vIn}V × ${r2}Ω / ${r1 + r2}Ω = ${vOutUnloaded.toFixed(4)}V`,
    result: vOutUnloaded,
    formatted: `${vOutUnloaded.toFixed(4)}V`
  });

  steps.push({
    description: 'With load, R2 is in parallel with R_load',
    formula: 'R2_eff = R2 || R_load = (R2 × R_load) / (R2 + R_load)',
    result: 0,
    formatted: ''
  });

  const r2Effective = (r2 * rLoad) / (r2 + rLoad);
  steps.push({
    description: 'Calculate effective R2',
    formula: `R2_eff = (${r2}Ω × ${rLoad}Ω) / (${r2}Ω + ${rLoad}Ω) = ${r2Effective.toFixed(2)}Ω`,
    result: r2Effective,
    formatted: `${r2Effective.toFixed(2)}Ω`
  });

  steps.push({
    description: 'Loaded divider formula',
    formula: 'V_out(loaded) = V_in × R2_eff / (R1 + R2_eff)',
    result: 0,
    formatted: ''
  });

  const vOutLoaded = vIn * r2Effective / (r1 + r2Effective);
  steps.push({
    description: 'Calculate loaded output voltage',
    formula: `V_out(loaded) = ${vIn}V × ${r2Effective.toFixed(2)}Ω / ${(r1 + r2Effective).toFixed(2)}Ω = ${vOutLoaded.toFixed(4)}V`,
    result: vOutLoaded,
    formatted: `${vOutLoaded.toFixed(4)}V`
  });

  // Calculate load effect percentage
  const loadEffect = ((vOutUnloaded - vOutLoaded) / vOutUnloaded) * 100;
  steps.push({
    description: 'Load effect (voltage drop)',
    formula: `Effect = (${vOutUnloaded.toFixed(4)}V - ${vOutLoaded.toFixed(4)}V) / ${vOutUnloaded.toFixed(4)}V × 100% = ${loadEffect.toFixed(2)}%`,
    result: loadEffect,
    formatted: `${loadEffect.toFixed(2)}%`
  });

  // Check load ratio (rule of thumb: load should be >10× R2)
  const loadRatio = rLoad / r2;
  let loadWarning: string | undefined;

  if (loadRatio < 10) {
    loadWarning = `⚠️ Load resistance (${rLoad}Ω) is less than 10× R2 (${r2}Ω). Consider using a buffer or lower divider impedance.`;
    steps.push({
      description: 'Load ratio warning',
      formula: `R_load / R2 = ${loadRatio.toFixed(2)} (recommended: >10)`,
      result: loadRatio,
      formatted: `${loadRatio.toFixed(2)}×`
    });
  } else {
    steps.push({
      description: 'Load ratio (good if >10)',
      formula: `R_load / R2 = ${loadRatio.toFixed(2)} ✓`,
      result: loadRatio,
      formatted: `${loadRatio.toFixed(2)}×`
    });
  }

  return {
    vOut: vOutUnloaded,
    vOutLoaded,
    loadEffect,
    loadWarning,
    steps
  };
}
