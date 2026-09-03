import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para a lista</span>
      </Link>
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        Detalhes do Produto #{id}
      </div>
    </div>
  );
}
