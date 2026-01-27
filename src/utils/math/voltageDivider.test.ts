import { describe, it, expect } from 'vitest';
import { voltageDivider, voltageDividerWithLoad } from './voltageDivider';

describe('Voltage Divider', () => {
  describe('voltageDivider (unloaded)', () => {
    it('should calculate 50% divider', () => {
      const result = voltageDivider(12, 10000, 10000);
      expect(result.vOut).toBe(6);
    });

    it('should calculate asymmetric divider', () => {
      const result = voltageDivider(10, 9000, 1000);
      expect(result.vOut).toBe(1); // 10 * 1k / (9k + 1k) = 1V
    });

    it('should throw for negative voltage', () => {
      expect(() => voltageDivider(-5, 1000, 1000)).toThrow('Input voltage cannot be negative');
    });

    it('should throw for zero resistance', () => {
      expect(() => voltageDivider(5, 0, 1000)).toThrow('Resistor values must be positive');
    });
  });

  describe('voltageDividerWithLoad', () => {
    it('should calculate loaded divider', () => {
      const result = voltageDividerWithLoad(12, 10000, 10000, 100000);
      expect(result.vOut).toBe(6); // Unloaded
      expect(result.vOutLoaded).toBeDefined();
      expect(result.vOutLoaded!).toBeLessThan(6); // Load pulls down
    });

    it('should warn when load is too low', () => {
      const result = voltageDividerWithLoad(12, 10000, 10000, 5000);
      expect(result.loadWarning).toBeDefined();
    });

    it('should not warn when load is sufficient', () => {
      const result = voltageDividerWithLoad(12, 1000, 1000, 100000);
      expect(result.loadWarning).toBeUndefined();
    });

    it('should calculate load effect percentage', () => {
      const result = voltageDividerWithLoad(12, 10000, 10000, 100000);
      expect(result.loadEffect).toBeDefined();
      expect(result.loadEffect!).toBeGreaterThan(0);
    });
  });
});
