import { describe, it, expect } from 'vitest';
import { ledResistor, nearestE24 } from './led';

describe('LED Resistor Calculator', () => {
  describe('nearestE24', () => {
    it('should find nearest E24 value for 150', () => {
      expect(nearestE24(150)).toBe(150);
    });

    it('should find nearest E24 value for 155', () => {
      expect(nearestE24(155)).toBe(150);
    });

    it('should find nearest E24 value for 4700', () => {
      expect(nearestE24(4700)).toBe(4700);
    });

    it('should handle values requiring rounding up', () => {
      expect(nearestE24(175)).toBe(180);
    });

    it('should return 0 for invalid input', () => {
      expect(nearestE24(0)).toBe(0);
      expect(nearestE24(-100)).toBe(0);
    });
  });

  describe('ledResistor', () => {
    it('should calculate resistor for 5V, 2V LED, 20mA', () => {
      const result = ledResistor(5, 2, 0.02);
      expect(result.resistorValue).toBe(150); // (5-2)/0.02 = 150Ω
      expect(result.nearestE24).toBe(150);
    });

    it('should calculate power dissipation', () => {
      const result = ledResistor(5, 2, 0.02);
      expect(result.powerDissipation).toBeCloseTo(0.06, 2); // 3V * 20mA = 60mW
    });

    it('should suggest appropriate wattage with 2x margin', () => {
      const result = ledResistor(5, 2, 0.02);
      // 60mW * 2 = 120mW, so 0.125W or 0.25W should be suggested
      expect(result.suggestedWattage).toBe(0.125);
    });

    it('should throw for Vf >= Vsource', () => {
      expect(() => ledResistor(3, 5, 0.02)).toThrow('Forward voltage must be less than source voltage');
    });

    it('should throw for negative current', () => {
      expect(() => ledResistor(5, 2, -0.02)).toThrow('Target current must be positive');
    });

    it('should generate derivation steps', () => {
      const result = ledResistor(5, 2, 0.02);
      expect(result.steps.length).toBeGreaterThan(0);
    });
  });
});
