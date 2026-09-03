/**
 * Interface principal representando um Produto no sistema.
 */
export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}

/**
 * Categorias conhecidas presentes no catálogo inicial.
 */
export const CATEGORIAS_DISPONIVEIS = [
  'Perifericos',
  'Monitores',
  'Audio',
  'Armazenamento',
  'Componentes',
  'Acessorios',
] as const;

export type CategoriaProduto = (typeof CATEGORIAS_DISPONIVEIS)[number] | string;

/**
 * Payload para criação de um novo produto (sem o id gerado pelo servidor).
 */
export interface CriarProdutoDTO {
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}

/**
 * Payload para atualização parcial ou total de um produto.
 */
export type AtualizarProdutoDTO = Partial<CriarProdutoDTO>;

/**
 * Filtros de listagem de produtos suportados pela API.
 */
export interface FiltrosProdutos {
  pagina?: number;
  limite?: number;
  busca?: string;
  categoria?: string;
}

/**
 * Estrutura tipada para respostas com paginação no servidor.
 */
export interface RespostaPaginada<T> {
  dados: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}
