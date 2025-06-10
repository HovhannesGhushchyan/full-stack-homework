import {
  validateRequired,
  validateLength,
  validateNumeric,
} from '../lib/validation';

describe('Validation Utilities', () => {
  describe('validateRequired', () => {
    it('should return null for non-empty value', () => {
      expect(validateRequired('test', 'name')).toBeNull();
      expect(validateRequired(' test ', 'name')).toBeNull();
    });

    it('should return error for empty value', () => {
      expect(validateRequired('', 'name')).toEqual({
        field: 'name',
        message: 'name is required',
      });
    });

    it('should return error for whitespace-only value', () => {
      expect(validateRequired('   ', 'name')).toEqual({
        field: 'name',
        message: 'name is required',
      });
    });

    it('should handle null and undefined values', () => {
      expect(validateRequired(null as any, 'name')).toEqual({
        field: 'name',
        message: 'name is required',
      });
      expect(validateRequired(undefined as any, 'name')).toEqual({
        field: 'name',
        message: 'name is required',
      });
    });
  });

  describe('validateLength', () => {
    it('should return null for value within length limits', () => {
      expect(validateLength('test', 'name', 2, 10)).toBeNull();
      expect(validateLength('te', 'name', 2, 10)).toBeNull();
      expect(validateLength('testtestte', 'name', 2, 10)).toBeNull();
    });

    it('should return error for too short value', () => {
      expect(validateLength('a', 'name', 2, 10)).toEqual({
        field: 'name',
        message: 'name must be at least 2 characters long',
      });
    });

    it('should return error for too long value', () => {
      expect(validateLength('toolongvalue', 'name', 2, 10)).toEqual({
        field: 'name',
        message: 'name must not exceed 10 characters',
      });
    });

    it('should handle empty values', () => {
      expect(validateLength('', 'name', 2, 10)).toEqual({
        field: 'name',
        message: 'name must be at least 2 characters long',
      });
    });
  });

  describe('validateNumeric', () => {
    it('should return null for numeric value', () => {
      expect(validateNumeric('123', 'age')).toBeNull();
      expect(validateNumeric('0', 'age')).toBeNull();
    });

    it('should return error for non-numeric value', () => {
      expect(validateNumeric('abc', 'age')).toEqual({
        field: 'age',
        message: 'age must contain only numbers',
      });
      expect(validateNumeric('12a', 'age')).toEqual({
        field: 'age',
        message: 'age must contain only numbers',
      });
    });

    it('should handle empty values', () => {
      expect(validateNumeric('', 'age')).toEqual({
        field: 'age',
        message: 'age must contain only numbers',
      });
    });
  });
}); 