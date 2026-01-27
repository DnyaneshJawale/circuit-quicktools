/**
 * Resistor Color Code Calculator
 * Supports 4-band and 5-band color codes with encode/decode
 */

const COLORS = {
  black: 0,
  brown: 1,
  red: 2,
  orange: 3,
  yellow: 4,
  green: 5,
  blue: 6,
  violet: 7,
  grey: 8,
  gray: 8, // US spelling
  white: 9
};

const TOLERANCE_COLORS = {
  brown: '±1%',
  red: '±2%',
  orange: '±0.05%',
  yellow: '±0.1%',
  green: '±0.5%',
  blue: '±0.25%',
  violet: '±0.1%',
  grey: '±0.05%',
  gray: '±0.05%',
  gold: '±5%',
  silver: '±10%'
};

const TEMP_COEFF_COLORS = {
  brown: '100 ppm/K',
  red: '50 ppm/K',
  orange: '15 ppm/K',
  yellow: '25 ppm/K',
  green: '20 ppm/K',
  blue: '10 ppm/K',
  violet: '5 ppm/K'
};

export interface ColorCodeResult {
  value: number;
  tolerance: string;
  tempCoeff?: string;
  formatted: string;
  bands: string[];
}

export interface EncodeResult {
  colors: string[];
  formatted: string;
  resistance: number;
}

/**
 * Decode 4-band resistor color code
 */
export function decode4Band(colors: string[]): ColorCodeResult {
  if (colors.length < 4) {
    throw new Error('4-band resistor requires exactly 4 colors');
  }

  const band1 = colors[0].toLowerCase();
  const band2 = colors[1].toLowerCase();
  const band3 = colors[2].toLowerCase();
  const band4 = colors[3].toLowerCase();

  // Validate colors
  if (!(band1 in COLORS) || !(band2 in COLORS) || !(band3 in COLORS)) {
    throw new Error('Invalid color in first three bands');
  }

  if (!(band4 in TOLERANCE_COLORS)) {
    throw new Error('Invalid tolerance color');
  }

  // First two bands are significant digits
  const firstDigit = COLORS[band1 as keyof typeof COLORS];
  const secondDigit = COLORS[band2 as keyof typeof COLORS];
  
  if (firstDigit === 0) {
    throw new Error('First band cannot be black');
  }

  // Third band is multiplier (power of 10)
  const multiplier = Math.pow(10, COLORS[band3 as keyof typeof COLORS]);

  // Calculate resistance
  const mantissa = firstDigit * 10 + secondDigit;
  const value = mantissa * multiplier;

  // Get tolerance
  const tolerance = TOLERANCE_COLORS[band4 as keyof typeof TOLERANCE_COLORS];

  return {
    value,
    tolerance,
    formatted: `${value} Ω`,
    bands: colors.map(c => c.toLowerCase())
  };
}

/**
 * Decode 5-band resistor color code
 */
export function decode5Band(colors: string[]): ColorCodeResult {
  if (colors.length < 5) {
    throw new Error('5-band resistor requires exactly 5 colors');
  }

  const band1 = colors[0].toLowerCase();
  const band2 = colors[1].toLowerCase();
  const band3 = colors[2].toLowerCase();
  const band4 = colors[3].toLowerCase();
  const band5 = colors[4].toLowerCase();

  // Validate colors
  if (!(band1 in COLORS) || !(band2 in COLORS) || !(band3 in COLORS) || !(band4 in COLORS)) {
    throw new Error('Invalid color in first four bands');
  }

  if (!(band5 in TOLERANCE_COLORS)) {
    throw new Error('Invalid tolerance color');
  }

  // First three bands are significant digits
  const firstDigit = COLORS[band1 as keyof typeof COLORS];
  const secondDigit = COLORS[band2 as keyof typeof COLORS];
  const thirdDigit = COLORS[band3 as keyof typeof COLORS];
  
  if (firstDigit === 0) {
    throw new Error('First band cannot be black');
  }

  // Fourth band is multiplier (power of 10)
  const multiplier = Math.pow(10, COLORS[band4 as keyof typeof COLORS]);

  // Calculate resistance
  const mantissa = firstDigit * 100 + secondDigit * 10 + thirdDigit;
  const value = mantissa * multiplier;

  // Get tolerance
  const tolerance = TOLERANCE_COLORS[band5 as keyof typeof TOLERANCE_COLORS];

  // Get temp coefficient
  const tempCoeff = TEMP_COEFF_COLORS[band4 as keyof typeof TEMP_COEFF_COLORS];

  return {
    value,
    tolerance,
    tempCoeff,
    formatted: `${value} Ω`,
    bands: colors.map(c => c.toLowerCase())
  };
}

/**
 * Encode resistance value to 4-band color code
 */
export function encode4Band(resistance: number, tolerance: string): EncodeResult {
  // Normalize tolerance to match our keys
  const tolKey = Object.keys(TOLERANCE_COLORS).find(
    k => TOLERANCE_COLORS[k as keyof typeof TOLERANCE_COLORS] === tolerance
  );

  if (!tolKey) {
    throw new Error('Invalid tolerance value');
  }

  // Find the best representation (two significant digits)
  let exponent = 0;
  let mantissa = resistance;

  while (mantissa >= 100 && exponent < 7) {
    mantissa /= 10;
    exponent++;
  }

  while (mantissa < 10 && exponent > 0) {
    mantissa *= 10;
    exponent--;
  }

  const firstDigit = Math.floor(mantissa / 10);
  const secondDigit = Math.floor(mantissa % 10);

  if (firstDigit === 0) {
    throw new Error('Cannot encode resistance value with 4-band colors');
  }

  // Find color names
  const colorNames = Object.entries(COLORS).reduce((acc, [name, val]) => {
    acc[val] = name;
    return acc;
  }, {} as Record<number, string>);

  const band1 = colorNames[firstDigit];
  const band2 = colorNames[secondDigit];
  const band3 = colorNames[exponent];
  const band4 = tolKey;

  return {
    colors: [band1, band2, band3, band4],
    formatted: `${band1}-${band2}-${band3}-${band4}`,
    resistance
  };
}

/**
 * Encode resistance value to 5-band color code
 */
export function encode5Band(resistance: number, tolerance: string): EncodeResult {
  // Normalize tolerance to match our keys
  const tolKey = Object.keys(TOLERANCE_COLORS).find(
    k => TOLERANCE_COLORS[k as keyof typeof TOLERANCE_COLORS] === tolerance
  );

  if (!tolKey) {
    throw new Error('Invalid tolerance value');
  }

  // Find the best representation (three significant digits)
  let exponent = 0;
  let mantissa = resistance;

  while (mantissa >= 1000 && exponent < 7) {
    mantissa /= 10;
    exponent++;
  }

  while (mantissa < 100 && exponent > 0) {
    mantissa *= 10;
    exponent--;
  }

  const firstDigit = Math.floor(mantissa / 100);
  const secondDigit = Math.floor((mantissa % 100) / 10);
  const thirdDigit = Math.floor(mantissa % 10);

  if (firstDigit === 0) {
    throw new Error('Cannot encode resistance value with 5-band colors');
  }

  // Find color names
  const colorNames = Object.entries(COLORS).reduce((acc, [name, val]) => {
    acc[val] = name;
    return acc;
  }, {} as Record<number, string>);

  const band1 = colorNames[firstDigit];
  const band2 = colorNames[secondDigit];
  const band3 = colorNames[thirdDigit];
  const band4 = colorNames[exponent];
  const band5 = tolKey;

  return {
    colors: [band1, band2, band3, band4, band5],
    formatted: `${band1}-${band2}-${band3}-${band4}-${band5}`,
    resistance
  };
}

export function isValidColor(color: string): boolean {
  return color.toLowerCase() in COLORS || color.toLowerCase() in TOLERANCE_COLORS;
}

export function getColorList(): string[] {
  return Object.keys(COLORS);
}

export function getTolerantColorList(): string[] {
  return Object.keys(TOLERANCE_COLORS);
}
