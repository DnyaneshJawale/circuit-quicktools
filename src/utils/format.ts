import { formatSI } from './units/parseUnit';

export interface FormatOptions {
  unit?: string;
  sigfigs?: number;
  raw?: boolean; // If true, show raw value with full precision
}

/**
 * Format a number with SI units (e.g., 10M, 8k, 2.2µ)
 * Shows engineering notation with SI prefix automatically selected
 * @param value - The numeric value to format
 * @param opts - Format options (unit, sigfigs, raw)
 * @returns Formatted string with SI prefix and unit
 */
export function formatNumber(value: number, opts: FormatOptions = {}): string {
  const { unit = '', sigfigs = 3, raw = false } = opts;
  
  if (raw) {
    return formatRaw(value);
  }
  
  return formatSI(value, sigfigs, unit);
}

/**
 * Format a value with full precision (no SI prefix)
 * @param value - The numeric value to format
 * @returns Full precision string
 */
export function formatRaw(value: number): string {
  if (!Number.isFinite(value)) {
    return 'Invalid';
  }
  
  // Use toPrecision for consistent output
  const formatted = parseFloat(value.toPrecision(10));
  
  // Remove trailing zeros after decimal point
  return formatted.toString();
}
