import { api } from './api';
import type {
  Produto,
  CriarProdutoDTO,
  AtualizarProdutoDTO,
  FiltrosProdutos,
  RespostaPaginada,
} from '../types/product';

export const productService = {
  /**
   * Lista produtos com suporte a paginação server-side, busca textual e filtro de categoria.
   */
  async listar(filtros: FiltrosProdutos = {}): Promise<RespostaPaginada<Produto>> {
    const pagina = filtros.pagina && filtros.pagina > 0 ? filtros.pagina : 1;
    const limite = filtros.limite && filtros.limite > 0 ? filtros.limite : 8;

    const params: Record<string, string | number | undefined> = {
      _page: pagina,
      _limit: limite,
    };

    if (filtros.busca && filtros.busca.trim() !== '') {
      params.nome_like = filtros.busca.trim();
    }

    if (filtros.categoria && filtros.categoria !== 'todas') {
      params.categoria = filtros.categoria;
    }

    const response = await api.get<Produto[]>('/produtos', params);

    // json-server expõe o total de registros no cabeçalho x-total-count
    const totalCountHeader = response.headers.get('x-total-count');
    const total = totalCountHeader ? parseInt(totalCountHeader, 10) : response.data.length;
    const totalPaginas = Math.ceil(total / limite) || 1;

    return {
      dados: response.data,
      total,
      pagina,
      limite,
      totalPaginas,
    };
  },

  /**
   * Obtém os detalhes completos de um produto específico.
   */
  async obterPorId(id: number | string): Promise<Produto> {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  },

  /**
   * Cadastra um novo produto na API fake.
   */
  async criar(dados: CriarProdutoDTO): Promise<Produto> {
    const response = await api.post<Produto>('/produtos', dados);
    return response.data;
  },

  /**
   * Atualiza completamente um produto existente.
   */
  async atualizar(id: number | string, dados: AtualizarProdutoDTO): Promise<Produto> {
    const response = await api.put<Produto>(`/produtos/${id}`, dados);
    return response.data;
  },

  /**
   * Exclui um produto por ID.
   */
  async excluir(id: number | string): Promise<void> {
    await api.delete(`/produtos/${id}`);
  },

  /**
   * Retorna a lista de categorias únicas disponíveis no catálogo.
   */
  async listarCategorias(): Promise<string[]> {
    const response = await api.get<Produto[]>('/produtos');
    const categorias = new Set<string>();
    response.data.forEach((p) => {
      if (p.categoria) {
        categorias.add(p.categoria);
      }
    });
    return Array.from(categorias);
  },
};
