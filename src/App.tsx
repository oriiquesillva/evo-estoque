import { Package } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center max-w-md text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          EvoEstoque
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Painel de Gerenciamento de Produtos - Teste Prático
        </p>
        <div className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Ambiente React 19 + Vite + Tailwind configurado com sucesso!
        </div>
      </div>
    </div>
  )
}
