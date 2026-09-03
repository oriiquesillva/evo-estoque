import { useState, useEffect } from 'react';

/**
 * Hook customizado para atrasar a atualização de um valor (debounce).
 * Evita disparos excessivos de requisições HTTP durante a digitação.
 * 
 * @param value Valor a ser observado (ex: texto de busca)
 * @param delay Tempo de espera em milissegundos (padrão: 400ms)
 * @returns O valor com atraso aplicado
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Agenda a atualização do valor após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Função de limpeza: cancela o timer anterior se o valor mudar antes do prazo
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
