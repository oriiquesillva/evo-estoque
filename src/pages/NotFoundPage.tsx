import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Página não encontrada</h1>
      <p className="text-slate-500 max-w-md mb-6">
        A rota que você tentou acessar não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para a Listagem</span>
      </Link>
    </div>
  );
}
