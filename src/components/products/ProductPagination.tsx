import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatarNumero } from '../../utils/formatters';

interface ProductPaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  limitePorPagina: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  paginaAtual,
  totalPaginas,
  totalItens,
  limitePorPagina,
  onPageChange,
}: ProductPaginationProps) {
  if (totalItens === 0 || totalPaginas <= 1) {
    return (
      <div className="flex items-center justify-between py-4 text-xs text-slate-500">
        <span>Total: {formatarNumero(totalItens)} {totalItens === 1 ? 'produto' : 'produtos'}</span>
      </div>
    );
  }

  const inicio = (paginaAtual - 1) * limitePorPagina + 1;
  const fim = Math.min(paginaAtual * limitePorPagina, totalItens);

  // Gera array de números de página amigável
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPaginas <= 6) {
      for (let i = 1; i <= totalPaginas; i++) pages.push(i);
    } else {
      pages.push(1);

      if (paginaAtual > 3) {
        pages.push('...');
      }

      const start = Math.max(2, paginaAtual - 1);
      const end = Math.min(totalPaginas - 1, paginaAtual + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (paginaAtual < totalPaginas - 2) {
        pages.push('...');
      }

      pages.push(totalPaginas);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      {/* Contagem de registros */}
      <div className="text-sm text-slate-500">
        Mostrando <span className="font-semibold text-slate-700">{inicio}</span> a{' '}
        <span className="font-semibold text-slate-700">{fim}</span> de{' '}
        <span className="font-semibold text-slate-700">{formatarNumero(totalItens)}</span> produtos
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(paginaAtual - 1)}
          disabled={paginaAtual <= 1}
          className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-slate-400 text-sm">
                  &hellip;
                </span>
              );
            }

            const pageNum = Number(page);
            const isCurrent = pageNum === paginaAtual;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`min-w-9 h-9 px-3 rounded-lg text-sm font-medium transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(paginaAtual + 1)}
          disabled={paginaAtual >= totalPaginas}
          className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
