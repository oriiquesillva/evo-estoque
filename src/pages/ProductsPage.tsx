import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

import type { Produto } from '../types/product';
import { CATEGORIAS_DISPONIVEIS } from '../types/product';
import { productService } from '../services/productService';
import { useDebounce } from '../hooks/useDebounce';

import { ProductSearch } from '../components/products/ProductSearch';
import { ProductCategoryFilter } from '../components/products/ProductCategoryFilter';
import { ProductTable } from '../components/products/ProductTable';
import { ProductPagination } from '../components/products/ProductPagination';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { DeleteConfirmModal } from '../components/common/DeleteConfirmModal';
import { Toast } from '../components/common/Toast';

const ITENS_POR_PAGINA = 8;

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados extraídos da URL (URL State)
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const buscaFromUrl = searchParams.get('busca') || '';
  const categoriaFromUrl = searchParams.get('categoria') || 'todas';

  // Estado local do input de busca (para digitação imediata e responsiva)
  const [termoBusca, setTermoBusca] = useState(buscaFromUrl);
  const debouncedBusca = useDebounce(termoBusca, 400);

  // Estados de dados e requisição
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [totalItens, setTotalItens] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [categorias, setCategorias] = useState<string[]>([...CATEGORIAS_DISPONIVEIS]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de exclusão e feedback
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Ref para evitar sincronização em loop na primeira renderização
  const isFirstRender = useRef(true);

  // 1. Sincroniza o debounce da busca com a URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const novosParams = new URLSearchParams(searchParams);

    if (debouncedBusca.trim() !== '') {
      novosParams.set('busca', debouncedBusca.trim());
    } else {
      novosParams.delete('busca');
    }

    // Resetar para página 1 sempre que o termo de busca for alterado
    novosParams.set('page', '1');
    setSearchParams(novosParams);
  }, [debouncedBusca]);

  // 2. Carrega categorias dinâmicas da API
  useEffect(() => {
    productService
      .listarCategorias()
      .then((cats) => {
        if (cats.length > 0) {
          // Une com as categorias padrão garantindo unicidade
          const listaUnica = Array.from(new Set([...CATEGORIAS_DISPONIVEIS, ...cats]));
          setCategorias(listaUnica);
        }
      })
      .catch(() => {
        // Fallback silencioso mantendo as categorias padrão
      });
  }, []);

  // 3. Função principal de busca de produtos
  const carregarProdutos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const resposta = await productService.listar({
        pagina: pageFromUrl,
        limite: ITENS_POR_PAGINA,
        busca: buscaFromUrl,
        categoria: categoriaFromUrl,
      });

      setProdutos(resposta.dados);
      setTotalItens(resposta.total);
      setTotalPaginas(resposta.totalPaginas);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Falha ao buscar produtos.';
      setError(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, [pageFromUrl, buscaFromUrl, categoriaFromUrl]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // Manipuladores de Filtros e Paginação
  const handleCategoriaChange = (novaCategoria: string) => {
    const novosParams = new URLSearchParams(searchParams);
    if (novaCategoria !== 'todas') {
      novosParams.set('categoria', novaCategoria);
    } else {
      novosParams.delete('categoria');
    }
    novosParams.set('page', '1');
    setSearchParams(novosParams);
  };

  const handlePageChange = (novaPagina: number) => {
    const novosParams = new URLSearchParams(searchParams);
    novosParams.set('page', String(novaPagina));
    setSearchParams(novosParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimparFiltros = () => {
    setTermoBusca('');
    setSearchParams({});
  };

  // Manipuladores de Exclusão
  const handleConfirmarExclusao = async () => {
    if (!produtoParaExcluir) return;

    setIsDeleting(true);
    try {
      await productService.excluir(produtoParaExcluir.id);
      setToast({
        message: `Produto "${produtoParaExcluir.nome}" excluído com sucesso!`,
        type: 'success',
      });
      setProdutoParaExcluir(null);

      // Se apagou o último item de uma página que não seja a primeira, volta uma página
      if (produtos.length === 1 && pageFromUrl > 1) {
        handlePageChange(pageFromUrl - 1);
      } else {
        carregarProdutos();
      }
    } catch {
      setToast({
        message: 'Erro ao excluir o produto. Tente novamente.',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const possuiFiltrosAtivos = buscaFromUrl !== '' || categoriaFromUrl !== 'todas';

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Catálogo de Produtos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consulte, filtre e gerencie os produtos cadastrados no sistema.
          </p>
        </div>

        <Link
          to="/produtos/novo"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Novo Produto</span>
        </Link>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <ProductSearch
          value={termoBusca}
          onChange={setTermoBusca}
          placeholder="Buscar por nome (ex: Teclado, Monitor, SSD)..."
        />

        <ProductCategoryFilter
          selectedCategory={categoriaFromUrl}
          onSelectCategory={handleCategoriaChange}
          categories={categorias}
        />
      </div>

      {/* Área de Conteúdo: Estados de Loading, Erro, Vazio e Tabela */}
      {isLoading ? (
        <LoadingSkeleton rows={ITENS_POR_PAGINA} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={carregarProdutos} />
      ) : produtos.length === 0 ? (
        <EmptyState
          title={possuiFiltrosAtivos ? 'Nenhum resultado para estes filtros' : 'Nenhum produto cadastrado'}
          description={
            possuiFiltrosAtivos
              ? 'Tente buscar com outros termos ou redefinir os filtros aplicados.'
              : 'Comece adicionando seu primeiro produto ao catálogo.'
          }
          onClearFilters={possuiFiltrosAtivos ? handleLimparFiltros : undefined}
        />
      ) : (
        <div className="space-y-4">
          <ProductTable
            produtos={produtos}
            onDelete={(prod) => setProdutoParaExcluir(prod)}
          />

          <ProductPagination
            paginaAtual={pageFromUrl}
            totalPaginas={totalPaginas}
            totalItens={totalItens}
            limitePorPagina={ITENS_POR_PAGINA}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={Boolean(produtoParaExcluir)}
        productName={produtoParaExcluir?.nome || ''}
        isLoading={isDeleting}
        onConfirm={handleConfirmarExclusao}
        onCancel={() => setProdutoParaExcluir(null)}
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
