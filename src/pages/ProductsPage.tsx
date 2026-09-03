export function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Produtos em Estoque</h1>
          <p className="text-sm text-slate-500">
            Gerencie o catálogo, preços e quantidade disponível no estoque.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        Carregando estrutura da listagem...
      </div>
    </div>
  );
}
