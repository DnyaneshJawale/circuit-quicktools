import { describe, it, expect } from 'vitest';
import { parseValue, isParseError, formatSI, parseMultipleValues } from './parseUnit';

describe('Unit Parser', () => {
  describe('parseValue', () => {
    it('should parse plain numbers', () => {
      const result = parseValue('100');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(100);
      }
    });

    it('should parse kilo prefix', () => {
      const result = parseValue('4.7k');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(4700);
      }
    });

    it('should parse mega prefix', () => {
      const result = parseValue('1M');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(1000000);
      }
    });

    it('should parse micro prefix (u)', () => {
      const result = parseValue('100u');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(0.0001);
      }
    });

    it('should parse nano prefix', () => {
      const result = parseValue('220n');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(220e-9);
      }
    });

    it('should parse pico prefix', () => {
      const result = parseValue('100p');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(100e-12);
      }
    });

    it('should parse with unit suffix', () => {
      const result = parseValue('10kΩ');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(10000);
        expect(result.unit).toBe('Ω');
      }
    });

    it('should parse capital K as kilo', () => {
      const result = parseValue('4.7K');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(4700);
      }
    });

    it('should handle scientific notation', () => {
      const result = parseValue('1.5e3');
      expect(isParseError(result)).toBe(false);
      if (!isParseError(result)) {
        expect(result.value).toBe(1500);
      }
    });

    it('should return error for empty input', () => {
      const result = parseValue('');
      expect(isParseError(result)).toBe(true);
    });

    it('should return error for invalid format', () => {
      const result = parseValue('abc');
      expect(isParseError(result)).toBe(true);
    });
  });

  describe('parseMultipleValues', () => {
    it('should parse comma-separated values', () => {
      const results = parseMultipleValues('4.7k, 10k, 2.2k');
      expect(results.length).toBe(3);
      expect(isParseError(results[0])).toBe(false);
      if (!isParseError(results[0])) {
        expect(results[0].value).toBe(4700);
      }
    });
  });

  describe('formatSI', () => {
    it('should format kilo values', () => {
      expect(formatSI(4700, 2, 'Ω')).toBe('4.7kΩ');
    });

    it('should format mega values', () => {
      expect(formatSI(1000000, 2, 'Ω')).toBe('1MΩ');
    });

    it('should format micro values', () => {
      expect(formatSI(0.000001, 2, 'F')).toBe('1µF');
    });

    it('should format nano values', () => {
      expect(formatSI(100e-9, 3, 'F')).toBe('100nF');
    });

    it('should handle zero', () => {
      expect(formatSI(0, 3, 'V')).toBe('0 V');
    });

    it('should handle invalid numbers', () => {
      expect(formatSI(NaN, 3, 'V')).toBe('Invalid');
      expect(formatSI(Infinity, 3, 'V')).toBe('Invalid');
    });
  });
});
