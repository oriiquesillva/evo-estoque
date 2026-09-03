import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message = 'Ocorreu um erro ao carregar os dados. Verifique sua conexão e se a API fake está em execução.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 sm:p-8 text-center max-w-lg mx-auto shadow-sm">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-2">Falha na Comunicação</h3>
      <p className="text-sm text-rose-700 mb-6">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tentar novamente</span>
        </button>
      )}
    </div>
  );
}
