import { describe, it, expect } from 'vitest';
import { formatarMoeda, formatarNumero } from './formatters';

describe('formatters utility', () => {
  describe('formatarMoeda', () => {
    it('deve formatar valor numérico para Real brasileiro (BRL)', () => {
      const resultado = formatarMoeda(349.9);
      // Remove espaços não separáveis (NBSP) para comparação estável
      const normalizado = resultado.replace(/\u00a0/g, ' ');
      expect(normalizado).toContain('R$');
      expect(normalizado).toContain('349,90');
    });

    it('deve formatar zero corretamente', () => {
      const resultado = formatarMoeda(0);
      const normalizado = resultado.replace(/\u00a0/g, ' ');
      expect(normalizado).toContain('0,00');
    });

    it('deve formatar valores com milhares', () => {
      const resultado = formatarMoeda(2499.0);
      const normalizado = resultado.replace(/\u00a0/g, ' ');
      expect(normalizado).toContain('2.499,00');
    });
  });

  describe('formatarNumero', () => {
    it('deve formatar inteiros com separador de milhar', () => {
      expect(formatarNumero(1500)).toBe('1.500');
      expect(formatarNumero(42)).toBe('42');
    });
  });
});
