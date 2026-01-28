/**
 * Battery Life Estimator
 * Calculate estimated runtime based on battery capacity and load current
 */

export interface BatteryLifeResult {
  hours: number;
  minutes: number;
  days: number;
  formatted: string;
  steps: string[];
}

export const COMMON_BATTERIES = {
  'AA (alkaline)': { capacity: 2500, voltage: 1.5 },
  'AA (NiMH)': { capacity: 2000, voltage: 1.2 },
  'AAA (alkaline)': { capacity: 1000, voltage: 1.5 },
  'AAA (NiMH)': { capacity: 750, voltage: 1.2 },
  'C (alkaline)': { capacity: 8000, voltage: 1.5 },
  'D (alkaline)': { capacity: 18000, voltage: 1.5 },
  'PP3 (9V)': { capacity: 500, voltage: 9.0 },
  'CR2032': { capacity: 220, voltage: 3.0 },
  'LiPo 1S': { capacity: 1000, voltage: 3.7 },
  'LiPo 2S': { capacity: 1000, voltage: 7.4 },
  '18650 Li-ion': { capacity: 2600, voltage: 3.7 }
};

/**
 * Calculate battery runtime
 * Runtime (hours) = Capacity (mAh) / Load (mA)
 * 
 * Optional efficiency factor reduces actual runtime:
 * Actual Runtime = Theoretical Runtime × Efficiency
 */
export function calculateBatteryLife(
  capacityMah: number,
  loadCurrentMa: number,
  efficiency: number = 100
): BatteryLifeResult {
  if (capacityMah <= 0) {
    throw new Error('Battery capacity must be greater than 0 mAh');
  }

  if (loadCurrentMa <= 0) {
    throw new Error('Load current must be greater than 0 mA');
  }

  if (efficiency <= 0 || efficiency > 100) {
    throw new Error('Efficiency must be between 0 and 100 percent');
  }

  // Calculate theoretical runtime
  const theoreticalHours = capacityMah / loadCurrentMa;

  // Apply efficiency factor
  const efficiencyFactor = efficiency / 100;
  const actualHours = theoreticalHours * efficiencyFactor;

  // Convert to hours, minutes, days
  const days = Math.floor(actualHours / 24);
  const remainingHoursAfterDays = actualHours - (days * 24);
  const hours = Math.floor(remainingHoursAfterDays);
  const minutes = Math.round((remainingHoursAfterDays - hours) * 60);

  // Format output
  let formatted = '';
  if (days > 0) {
    formatted = `${days} day${days > 1 ? 's' : ''} ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else {
    formatted = `${minutes}m`;
  }

  const steps = [
    `Battery Capacity: ${capacityMah} mAh`,
    `Load Current: ${loadCurrentMa} mA`,
    `Theoretical Runtime: ${capacityMah} mAh ÷ ${loadCurrentMa} mA = ${theoreticalHours.toFixed(2)} hours`,
  ];

  if (efficiency < 100) {
    steps.push(`Efficiency Factor: ${efficiency}%`);
    steps.push(`Actual Runtime: ${theoreticalHours.toFixed(2)} h × ${efficiencyFactor} = ${actualHours.toFixed(2)} hours`);
  }

  steps.push(`Final Runtime: ${formatted}`);

  return {
    hours: Math.floor(actualHours),
    minutes: Math.round((actualHours % 1) * 60),
    days,
    formatted,
    steps
  };
}

/**
 * Calculate required battery capacity for desired runtime
 * Capacity (mAh) = Load (mA) × Runtime (hours)
 */
export function calculateRequiredCapacity(
  loadCurrentMa: number,
  runtimeHours: number,
  efficiency: number = 100
): number {
  if (loadCurrentMa <= 0) {
    throw new Error('Load current must be greater than 0 mA');
  }

  if (runtimeHours <= 0) {
    throw new Error('Runtime must be greater than 0 hours');
  }

  if (efficiency <= 0 || efficiency > 100) {
    throw new Error('Efficiency must be between 0 and 100 percent');
  }

  // Account for efficiency losses
  const efficiencyFactor = efficiency / 100;
  const requiredCapacity = (loadCurrentMa * runtimeHours) / efficiencyFactor;

  return requiredCapacity;
}

/**
 * Calculate maximum load current for a given battery and runtime
 * Load (mA) = Capacity (mAh) / Runtime (hours)
 */
export function calculateMaxLoadCurrent(
  capacityMah: number,
  runtimeHours: number,
  efficiency: number = 100
): number {
  if (capacityMah <= 0) {
    throw new Error('Battery capacity must be greater than 0 mAh');
  }

  if (runtimeHours <= 0) {
    throw new Error('Runtime must be greater than 0 hours');
  }

  if (efficiency <= 0 || efficiency > 100) {
    throw new Error('Efficiency must be between 0 and 100 percent');
  }

  // Account for efficiency losses
  const efficiencyFactor = efficiency / 100;
  const maxLoadCurrent = (capacityMah * efficiencyFactor) / runtimeHours;

  return maxLoadCurrent;
}
