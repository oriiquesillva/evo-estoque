import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AtivoBadge, EstoqueBadge } from './ProductStatusBadge';

describe('ProductStatusBadge components', () => {
  describe('AtivoBadge', () => {
    it('deve renderizar texto "Ativo" quando ativo for true', () => {
      render(<AtivoBadge ativo={true} />);
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });

    it('deve renderizar texto "Inativo" quando ativo for false', () => {
      render(<AtivoBadge ativo={false} />);
      expect(screen.getByText('Inativo')).toBeInTheDocument();
    });
  });

  describe('EstoqueBadge', () => {
    it('deve indicar "Esgotado" quando estoque for 0', () => {
      render(<EstoqueBadge quantidade={0} />);
      expect(screen.getByText('Esgotado')).toBeInTheDocument();
    });

    it('deve indicar alerta de baixo estoque quando quantidade for entre 1 e 5', () => {
      render(<EstoqueBadge quantidade={3} />);
      expect(screen.getByText(/3 un. \(Baixo\)/i)).toBeInTheDocument();
    });

    it('deve exibir quantidade normal quando estoque for maior que 5', () => {
      render(<EstoqueBadge quantidade={25} />);
      expect(screen.getByText(/25 em estoque/i)).toBeInTheDocument();
    });
  });
});
