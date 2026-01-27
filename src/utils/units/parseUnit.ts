/**
 * Unit Parser for SI Prefixes
 * Robust parsing of engineering values with SI suffixes
 */

export interface ParsedValue {
  value: number;
  unit?: string;
  raw: string;
}

export interface ParseError {
  type: 'error';
  message: string;
  raw: string;
}

export type ParseResult = ParsedValue | ParseError;

// SI prefix multipliers
const SI_PREFIXES: Record<string, number> = {
  'T': 1e12,
  'G': 1e9,
  'M': 1e6,
  'k': 1e3,
  'K': 1e3, // Allow capital K for kilo
  '': 1,
  'm': 1e-3,
  'u': 1e-6,
  'µ': 1e-6,
  'μ': 1e-6, // Greek mu
  'n': 1e-9,
  'p': 1e-12,
  'f': 1e-15,
};

// Unit aliases for common components
const UNIT_ALIASES: Record<string, string> = {
  'ohm': 'Ω',
  'ohms': 'Ω',
  'Ω': 'Ω',
  'R': 'Ω',
  'F': 'F',
  'farad': 'F',
  'farads': 'F',
  'H': 'H',
  'henry': 'H',
  'henries': 'H',
  'henrys': 'H',
  'V': 'V',
  'volt': 'V',
  'volts': 'V',
  'A': 'A',
  'amp': 'A',
  'amps': 'A',
  'ampere': 'A',
  'amperes': 'A',
  'W': 'W',
  'watt': 'W',
  'watts': 'W',
  'Hz': 'Hz',
  'hertz': 'Hz',
};

/**
 * Parse a string value with optional SI prefix and unit
 * Examples: "4.7k", "220nF", "10kΩ", "2.2M", "100"
 */
export function parseValue(input: string): ParseResult {
  const raw = input.trim();
  
  if (!raw) {
    return { type: 'error', message: 'Input cannot be empty', raw };
  }

  // Regex to match number with optional SI prefix and unit
  // Matches: 4.7k, 220nF, 10kΩ, 2.2kohm, 100, 1.5e3, etc.
  const regex = /^([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*([TGMkKmuµμnpf]?)\s*(\w*|Ω)?$/;
  const match = raw.match(regex);

  if (!match) {
    return { 
      type: 'error', 
      message: `Invalid format: "${raw}". Use formats like "4.7k", "220nF", "10kΩ"`, 
      raw 
    };
  }

  const [, numStr, prefix, unitStr] = match;
  const baseValue = parseFloat(numStr);

  if (!Number.isFinite(baseValue)) {
    return { type: 'error', message: 'Value must be a finite number', raw };
  }

  const multiplier = SI_PREFIXES[prefix] ?? 1;
  const value = baseValue * multiplier;

  if (!Number.isFinite(value)) {
    return { type: 'error', message: 'Resulting value is too large or invalid', raw };
  }

  // Normalize unit
  const unit = unitStr ? (UNIT_ALIASES[unitStr.toLowerCase()] || UNIT_ALIASES[unitStr] || unitStr) : undefined;

  return { value, unit, raw };
}

/**
 * Parse multiple comma-separated values
 */
export function parseMultipleValues(input: string): ParseResult[] {
  const parts = input.split(/[,\s]+/).filter(Boolean);
  return parts.map(parseValue);
}

/**
 * Check if a parse result is an error
 */
export function isParseError(result: ParseResult): result is ParseError {
  return 'type' in result && result.type === 'error';
}

/**
 * Format a number with SI prefix for display
 */
export function formatSI(value: number, sigFigs: number = 3, unit: string = ''): string {
  if (!Number.isFinite(value)) {
    return 'Invalid';
  }

  if (value === 0) {
    return `0${unit ? ` ${unit}` : ''}`;
  }

  const absValue = Math.abs(value);
  
  let prefix = '';
  let scaledValue = value;

  if (absValue >= 1e12) {
    prefix = 'T';
    scaledValue = value / 1e12;
  } else if (absValue >= 1e9) {
    prefix = 'G';
    scaledValue = value / 1e9;
  } else if (absValue >= 1e6) {
    prefix = 'M';
    scaledValue = value / 1e6;
  } else if (absValue >= 1e3) {
    prefix = 'k';
    scaledValue = value / 1e3;
  } else if (absValue >= 1) {
    prefix = '';
    scaledValue = value;
  } else if (absValue >= 1e-3) {
    prefix = 'm';
    scaledValue = value * 1e3;
  } else if (absValue >= 1e-6) {
    prefix = 'µ';
    scaledValue = value * 1e6;
  } else if (absValue >= 1e-9) {
    prefix = 'n';
    scaledValue = value * 1e9;
  } else if (absValue >= 1e-12) {
    prefix = 'p';
    scaledValue = value * 1e12;
  } else if (absValue >= 1e-15) {
    prefix = 'f';
    scaledValue = value * 1e15;
  } else {
    // Very small, use scientific notation
    return `${value.toExponential(sigFigs - 1)}${unit ? ` ${unit}` : ''}`;
  }

  // Format with significant figures
  const formatted = Number(scaledValue.toPrecision(sigFigs));
  return `${formatted}${prefix}${unit}`;
}

/**
 * Format raw value with full precision
 */
export function formatRaw(value: number, precision: number = 10): string {
  if (!Number.isFinite(value)) {
    return 'Invalid';
  }
  return value.toPrecision(precision);
}

/**
 * Validate a value is positive
 */
export function validatePositive(value: number, fieldName: string): string | null {
  if (value < 0) {
    return `${fieldName} cannot be negative`;
  }
  if (value === 0) {
    return `${fieldName} cannot be zero`;
  }
  return null;
}

/**
 * Validate a value is non-negative
 */
export function validateNonNegative(value: number, fieldName: string): string | null {
  if (value < 0) {
    return `${fieldName} cannot be negative`;
  }
  return null;
}
