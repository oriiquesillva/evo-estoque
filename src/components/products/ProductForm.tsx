import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, Loader2, Save } from 'lucide-react';
import type { CriarProdutoDTO, Produto } from '../../types/product';
import { CATEGORIAS_DISPONIVEIS } from '../../types/product';

interface ProductFormProps {
  initialData?: Produto | null;
  onSubmit: (dados: CriarProdutoDTO) => Promise<void>;
  isEditing: boolean;
  categorias?: string[];
}

interface FormErrors {
  nome?: string;
  categoria?: string;
  preco?: string;
  estoque?: string;
}

export function ProductForm({
  initialData,
  onSubmit,
  isEditing,
  categorias = [...CATEGORIAS_DISPONIVEIS],
}: ProductFormProps) {
  // Estado dos campos do formulário
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState(categorias[0] || 'Perifericos');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [ativo, setAtivo] = useState(true);

  // Estados de validação e envio
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preenche dados quando estiver no modo de edição
  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || '');
      setCategoria(initialData.categoria || categorias[0] || 'Perifericos');
      setPreco(initialData.preco !== undefined ? String(initialData.preco) : '');
      setEstoque(initialData.estoque !== undefined ? String(initialData.estoque) : '');
      setAtivo(initialData.ativo ?? true);
    }
  }, [initialData, categorias]);

  // Função de validação rigorosa conforme as regras do teste
  const validarCampos = (): boolean => {
    const novosErros: FormErrors = {};

    // 1. Nome obrigatório, mínimo 3 caracteres
    const nomeTrimmed = nome.trim();
    if (!nomeTrimmed) {
      novosErros.nome = 'O nome do produto é obrigatório.';
    } else if (nomeTrimmed.length < 3) {
      novosErros.nome = 'O nome deve ter no mínimo 3 caracteres.';
    }

    // 2. Categoria obrigatória
    if (!categoria || categoria === 'todas') {
      novosErros.categoria = 'Por favor, selecione uma categoria válida.';
    }

    // 3. Preço obrigatório, maior que zero
    const precoNum = parseFloat(preco.replace(',', '.'));
    if (!preco || preco.trim() === '') {
      novosErros.preco = 'O preço é obrigatório.';
    } else if (isNaN(precoNum) || precoNum <= 0) {
      novosErros.preco = 'O preço deve ser um valor numérico maior que zero (ex: 99.90).';
    }

    // 4. Estoque obrigatório, zero ou mais
    const estoqueNum = parseInt(estoque, 10);
    if (estoque === '' || estoque === undefined) {
      novosErros.estoque = 'A quantidade em estoque é obrigatória.';
    } else if (isNaN(estoqueNum) || estoqueNum < 0) {
      novosErros.estoque = 'O estoque deve ser zero ou um número positivo (ex: 0, 10).';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validarCampos();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marca todos os campos como tocados para exibir erros se houverem
    setTouched({
      nome: true,
      categoria: true,
      preco: true,
      estoque: true,
    });

    if (!validarCampos()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CriarProdutoDTO = {
        nome: nome.trim(),
        categoria,
        preco: parseFloat(preco.replace(',', '.')),
        estoque: parseInt(estoque, 10),
        ativo,
      };

      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Campo: Nome do Produto */}
      <div>
        <label htmlFor="nome" className="block text-sm font-semibold text-slate-900 mb-1.5">
          Nome do Produto <span className="text-rose-600">*</span>
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            if (errors.nome) {
              setErrors((prev) => ({ ...prev, nome: undefined }));
            }
          }}
          onBlur={() => handleBlur('nome')}
          placeholder="Ex: Teclado Mecânico RGB, Monitor 27 144Hz"
          disabled={isSubmitting}
          className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
            touched.nome && errors.nome
              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          }`}
          aria-invalid={Boolean(touched.nome && errors.nome)}
          aria-describedby={touched.nome && errors.nome ? 'nome-error' : undefined}
        />
        {touched.nome && errors.nome && (
          <p id="nome-error" className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.nome}</span>
          </p>
        )}
      </div>

      {/* Grid: Categoria e Preço */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Campo: Categoria */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Categoria <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => {
                setCategoria(e.target.value);
                if (errors.categoria) {
                  setErrors((prev) => ({ ...prev, categoria: undefined }));
                }
              }}
              onBlur={() => handleBlur('categoria')}
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 focus:outline-none transition-colors appearance-none cursor-pointer ${
                touched.categoria && errors.categoria
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
            >
              {categorias
                .filter((cat) => cat !== 'todas')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          {touched.categoria && errors.categoria && (
            <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.categoria}</span>
            </p>
          )}
        </div>

        {/* Campo: Preço */}
        <div>
          <label htmlFor="preco" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Preço Unitário (R$) <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-medium text-slate-400 pointer-events-none">
              R$
            </span>
            <input
              id="preco"
              type="text"
              inputMode="decimal"
              value={preco}
              onChange={(e) => {
                setPreco(e.target.value);
                if (errors.preco) {
                  setErrors((prev) => ({ ...prev, preco: undefined }));
                }
              }}
              onBlur={() => handleBlur('preco')}
              placeholder="0,00"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                touched.preco && errors.preco
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }`}
              aria-invalid={Boolean(touched.preco && errors.preco)}
            />
          </div>
          {touched.preco && errors.preco && (
            <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.preco}</span>
            </p>
          )}
        </div>
      </div>

      {/* Grid: Estoque e Status Ativo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* Campo: Quantidade em Estoque */}
        <div>
          <label htmlFor="estoque" className="block text-sm font-semibold text-slate-900 mb-1.5">
            Quantidade em Estoque <span className="text-rose-600">*</span>
          </label>
          <input
            id="estoque"
            type="number"
            min="0"
            step="1"
            value={estoque}
            onChange={(e) => {
              setEstoque(e.target.value);
              if (errors.estoque) {
                setErrors((prev) => ({ ...prev, estoque: undefined }));
              }
            }}
            onBlur={() => handleBlur('estoque')}
            placeholder="0"
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
              touched.estoque && errors.estoque
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }`}
            aria-invalid={Boolean(touched.estoque && errors.estoque)}
          />
          {touched.estoque && errors.estoque && (
            <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.estoque}</span>
            </p>
          )}
        </div>

        {/* Campo: Status Ativo / Inativo */}
        <div className="pt-2 sm:pt-7">
          <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 block leading-tight">
                Produto Ativo
              </span>
              <span className="text-xs text-slate-500">
                Disponível para exibição e faturamento
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Botões de Ação do Formulário */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <Link
          to="/"
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : isEditing ? (
            <>
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Cadastrar Produto</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
