import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PackagePlus, Edit } from 'lucide-react';

import type { CriarProdutoDTO, Produto } from '../types/product';
import { productService } from '../services/productService';
import { ProductForm } from '../components/products/ProductForm';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Toast } from '../components/common/Toast';

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [produto, setProduto] = useState<Produto | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Carrega categorias disponíveis
  useEffect(() => {
    productService
      .listarCategorias()
      .then(setCategorias)
      .catch(() => {});
  }, []);

  // Se estiver editando, busca o produto atual pelo ID
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    productService
      .obterPorId(id)
      .then((dados) => {
        setProduto(dados);
      })
      .catch((err) => {
        const mensagem =
          err instanceof Error ? err.message : 'Falha ao carregar produto para edição.';
        setError(mensagem);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleSubmit = async (dados: CriarProdutoDTO) => {
    try {
      if (isEditing && id) {
        await productService.atualizar(id, dados);
        setToast({
          message: `Produto "${dados.nome}" atualizado com sucesso!`,
          type: 'success',
        });
        setTimeout(() => {
          navigate(`/produtos/${id}`);
        }, 1200);
      } else {
        const novoProduto = await productService.criar(dados);
        setToast({
          message: `Produto "${dados.nome}" cadastrado com sucesso!`,
          type: 'success',
        });
        setTimeout(() => {
          navigate(`/produtos/${novoProduto.id}`);
        }, 1200);
      }
    } catch {
      setToast({
        message: 'Erro ao salvar os dados do produto. Verifique se a API está online.',
        type: 'error',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Botão de Retorno */}
      <Link
        to={isEditing && id ? `/produtos/${id}` : '/'}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>{isEditing ? 'Voltar para os detalhes' : 'Voltar para o catálogo'}</span>
      </Link>

      {/* Cartão do Formulário */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            {isEditing ? <Edit className="w-6 h-6" /> : <PackagePlus className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Editar Produto #${id}` : 'Cadastrar Novo Produto'}
            </h1>
            <p className="text-sm text-slate-500">
              {isEditing
                ? 'Atualize as informações do produto no catálogo.'
                : 'Preencha os campos abaixo para adicionar um produto ao estoque.'}
            </p>
          </div>
        </div>

        {/* Estados de Loading, Erro ou Formulário */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
            <div className="h-10 bg-slate-100 rounded-xl"></div>
            <div className="h-12 bg-slate-200 rounded-xl w-36 ml-auto"></div>
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <ProductForm
            initialData={produto}
            onSubmit={handleSubmit}
            isEditing={isEditing}
            categorias={categorias.length > 0 ? categorias : undefined}
          />
        )}
      </div>

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
