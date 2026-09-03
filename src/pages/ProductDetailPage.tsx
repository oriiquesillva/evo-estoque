import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  DollarSign,
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Hash,
  Calculator,
} from 'lucide-react';

import type { Produto } from '../types/product';
import { productService } from '../services/productService';
import { formatarMoeda, formatarNumero } from '../utils/formatters';
import { AtivoBadge, EstoqueBadge } from '../components/products/ProductStatusBadge';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';
import { Toast } from '../components/common/Toast';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de exclusão e feedback
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const carregarProduto = useCallback(async () => {
    if (!id) {
      setError('ID do produto não informado.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dados = await productService.obterPorId(id);
      setProduto(dados);
    } catch (err) {
      const mensagem =
        err instanceof Error ? err.message : 'Não foi possível carregar os detalhes do produto.';
      setError(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarProduto();
  }, [carregarProduto]);

  const handleExcluir = async () => {
    if (!produto) return;

    setIsDeleting(true);
    try {
      await productService.excluir(produto.id);
      setToast({
        message: `Produto "${produto.nome}" excluído com sucesso! Redirecionando...`,
        type: 'success',
      });

      // Aguarda 1.5s para o usuário visualizar o feedback antes de redirecionar
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch {
      setToast({
        message: 'Erro ao excluir o produto. Tente novamente.',
        type: 'error',
      });
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-40"></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="h-8 bg-slate-200 rounded w-2/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-28 bg-slate-100 rounded-xl"></div>
            <div className="h-28 bg-slate-100 rounded-xl"></div>
            <div className="h-28 bg-slate-100 rounded-xl"></div>
          </div>
          <div className="h-40 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a listagem</span>
        </Link>
        <ErrorMessage
          message={error || 'Produto não encontrado na base de dados.'}
          onRetry={carregarProduto}
        />
      </div>
    );
  }

  // Métricas calculadas para valorização de negócio
  const valorTotalEstoque = produto.preco * produto.estoque;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Barra de Navegação Superior e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar para o catálogo</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/produtos/${produto.id}/editar`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-sm font-semibold rounded-xl border border-amber-200 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Editar Produto</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      {/* Cartão Principal do Produto */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cabeçalho do Cartão */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
              <Hash className="w-3 h-3" />
              ID: {produto.id}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <Layers className="w-3 h-3" />
              {produto.categoria}
            </span>
            <AtivoBadge ativo={produto.ativo} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {produto.nome}
          </h1>
        </div>

        {/* Grade de Destaques de Negócio (KPIs) */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100">
          {/* Preço de Venda */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Preço Unitário</span>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatarMoeda(produto.preco)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Valor de tabela</span>
          </div>

          {/* Estoque Disponível */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Quantidade</span>
              <Package className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatarNumero(produto.estoque)}{' '}
              <span className="text-sm font-normal text-slate-500">unidades</span>
            </div>
            <div className="mt-2">
              <EstoqueBadge quantidade={produto.estoque} />
            </div>
          </div>

          {/* Patrimônio em Estoque */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total em Estoque</span>
              <Calculator className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 tracking-tight">
              {formatarMoeda(valorTotalEstoque)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Patrimônio alocado</span>
          </div>
        </div>

        {/* Informações Técnicas e Operacionais */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-900">Visão Geral & Situação</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Categoria do Catálogo</span>
                <span className="text-sm font-medium text-slate-900">{produto.categoria}</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Classificação para fins de filtro e relatórios gerenciais.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  produto.ativo
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {produto.ativo ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Status Operacional</span>
                <span className="text-sm font-medium text-slate-900">
                  {produto.ativo ? 'Disponível para venda' : 'Inativo / Bloqueado'}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  {produto.ativo
                    ? 'O produto está visível e liberado para faturamento.'
                    : 'O produto está suspenso temporariamente.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        productName={produto.nome}
        isLoading={isDeleting}
        onConfirm={handleExcluir}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Toast de Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
