/**
 * Formata um número como moeda brasileira (BRL - R$).
 * @example formatarMoeda(349.9) => "R$ 349,90"
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata números inteiros com separador de milhar no padrão brasileiro.
 * @example formatarNumero(1500) => "1.500"
 */
export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor);
}
