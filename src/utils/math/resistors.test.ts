import { describe, it, expect } from 'vitest';
import { sumSeries, parallel, withTolerance, powerDissipation, suggestWattage } from './resistors';

describe('Resistor Calculations', () => {
  describe('sumSeries', () => {
    it('should add resistors in series', () => {
      const result = sumSeries([4700, 10000, 2200]);
      expect(result.value).toBe(16900);
    });

    it('should handle single resistor', () => {
      const result = sumSeries([1000]);
      expect(result.value).toBe(1000);
    });

    it('should handle empty array', () => {
      const result = sumSeries([]);
      expect(result.value).toBe(0);
    });

    it('should throw for negative values', () => {
      expect(() => sumSeries([-100, 200])).toThrow('Resistor values cannot be negative');
    });

    it('should throw for non-finite values', () => {
      expect(() => sumSeries([Infinity, 200])).toThrow('Resistor values must be finite numbers');
    });

    it('should generate derivation steps', () => {
      const result = sumSeries([100, 200, 300]);
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.value).toBe(600);
    });
  });

  describe('parallel', () => {
    it('should calculate parallel resistance for equal values', () => {
      const result = parallel([1000, 1000]);
      expect(result.value).toBe(500);
    });

    it('should handle single resistor', () => {
      const result = parallel([1000]);
      expect(result.value).toBe(1000);
    });

    it('should return 0 when any resistor is 0', () => {
      const result = parallel([0, 1000]);
      expect(result.value).toBe(0);
    });

    it('should handle multiple parallel resistors', () => {
      const result = parallel([100, 100, 100]);
      expect(result.value).toBeCloseTo(33.333, 2);
    });

    it('should throw for negative values', () => {
      expect(() => parallel([-100, 200])).toThrow('Resistor values cannot be negative');
    });

    it('should generate derivation steps', () => {
      const result = parallel([1000, 2000]);
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.value).toBeCloseTo(666.67, 0);
    });
  });

  describe('withTolerance', () => {
    it('should calculate tolerance bounds', () => {
      const result = withTolerance(1000, 5);
      expect(result.nominal).toBe(1000);
      expect(result.min).toBe(950);
      expect(result.max).toBe(1050);
    });

    it('should handle 1% tolerance', () => {
      const result = withTolerance(4700, 1);
      expect(result.min).toBe(4653);
      expect(result.max).toBe(4747);
    });
  });

  describe('powerDissipation', () => {
    it('should calculate power from voltage', () => {
      const power = powerDissipation(100, 10); // 10V across 100Ω
      expect(power).toBe(1); // P = V²/R = 100/100 = 1W
    });

    it('should calculate power from current', () => {
      const power = powerDissipation(100, undefined, 0.1); // 100mA through 100Ω
      expect(power).toBeCloseTo(1, 10); // P = I²R = 0.01 * 100 = 1W
    });

    it('should throw without voltage or current', () => {
      expect(() => powerDissipation(100)).toThrow('Either voltage or current must be provided');
    });
  });

  describe('suggestWattage', () => {
    it('should suggest 0.25W for small dissipation', () => {
      expect(suggestWattage(0.05)).toBe(0.125);
    });

    it('should suggest 0.5W for ~0.2W dissipation', () => {
      expect(suggestWattage(0.2)).toBe(0.5);
    });

    it('should suggest higher wattage for larger dissipation', () => {
      expect(suggestWattage(2)).toBe(5);
    });
  });
});
