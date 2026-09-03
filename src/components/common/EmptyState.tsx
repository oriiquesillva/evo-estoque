import { PackageSearch, RotateCcw, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  showCreateButton?: boolean;
}

export function EmptyState({
  title = 'Nenhum produto encontrado',
  description = 'Não encontramos nenhum item correspondente aos critérios de busca ou filtro selecionados.',
  onClearFilters,
  showCreateButton = true,
}: EmptyStateProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
      <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <PackageSearch className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar filtros</span>
          </button>
        )}

        {showCreateButton && (
          <Link
            to="/produtos/novo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Produto</span>
          </Link>
        )}
      </div>
    </div>
  );
}
