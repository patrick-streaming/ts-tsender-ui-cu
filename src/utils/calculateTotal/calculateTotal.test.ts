// calculateTotal.test.ts
import { describe, expect, it } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
    it('should work with newlines', () => {
        expect(calculateTotal('100\n200')).toBe(300);
        expect(calculateTotal('100\n200\n300')).toBe(600);
    });

    it('should handle mixed delimiters', () => {
        expect(calculateTotal('100,200\n300')).toBe(600);
        expect(calculateTotal('1.5\n2.5,3.5')).toBe(7.5);
        expect(calculateTotal('200,,300\n\n400,')).toBe(900);
    });

    it('should handle empty input', () => {
        expect(calculateTotal('')).toBe(0);
        expect(calculateTotal(',\n,   ')).toBe(0);
    });

    it('should ignore invalid numbers', () => {
        expect(calculateTotal('abc,100')).toBe(100);
        expect(calculateTotal('12three\n45')).toBe(57);
        expect(calculateTotal('123.45.67')).toBe(123.45);
    });

    it('should handle decimal numbers', () => {
        expect(calculateTotal('1.1\n2.2,3.3')).toBeCloseTo(6.6);
        expect(calculateTotal('99.99,0.01')).toBe(100);
    });

    it('should handle whitespace', () => {
        expect(calculateTotal('  100  \n  200  ')).toBe(300);
        expect(calculateTotal('  , 150  ,  ')).toBe(150);
        expect(calculateTotal('\t123\n\r456')).toBe(579);
    });

    it('should handle complex combinations', () => {
        expect(calculateTotal('100\n200,300\n\n400,500\n')).toBe(1500);
        expect(calculateTotal('1.5,,2.5\n\n3.5,')).toBe(7.5);
        expect(calculateTotal('invalid,100\n200,more-invalid')).toBe(300);
    });
});