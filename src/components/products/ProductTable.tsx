import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import type { Produto } from '../../types/product';
import { formatarMoeda } from '../../utils/formatters';
import { AtivoBadge, EstoqueBadge } from './ProductStatusBadge';

interface ProductTableProps {
  produtos: Produto[];
  onDelete: (produto: Produto) => void;
}

export function ProductTable({ produtos, onDelete }: ProductTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Produto</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Categoria</th>
              <th className="py-3.5 px-4">Preço</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Estoque</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {produtos.map((produto) => (
              <tr
                key={produto.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Nome & ID */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    <Link to={`/produtos/${produto.id}`}>{produto.nome}</Link>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 md:hidden">
                    {produto.categoria} &bull; {produto.estoque} un.
                  </div>
                </td>

                {/* Categoria */}
                <td className="py-4 px-4 hidden md:table-cell">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                    {produto.categoria}
                  </span>
                </td>

                {/* Preço */}
                <td className="py-4 px-4 font-semibold text-slate-900">
                  {formatarMoeda(produto.preco)}
                </td>

                {/* Estoque */}
                <td className="py-4 px-4 hidden sm:table-cell">
                  <EstoqueBadge quantidade={produto.estoque} />
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <AtivoBadge ativo={produto.ativo} />
                </td>

                {/* Ações */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <Link
                      to={`/produtos/${produto.id}`}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalhes"
                      aria-label={`Ver detalhes de ${produto.nome}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/produtos/${produto.id}/editar`}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Editar produto"
                      aria-label={`Editar ${produto.nome}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(produto)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir produto"
                      aria-label={`Excluir ${produto.nome}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
