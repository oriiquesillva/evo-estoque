import { Link, useLocation } from 'react-router-dom';
import { Package, PlusCircle, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isNovo = location.pathname === '/produtos/novo';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                EvoEstoque
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Painel de Controle
              </span>
            </div>
          </Link>

          {/* Navegação e Ações */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isHome
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Produtos</span>
            </Link>

            <Link
              to="/produtos/novo"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                isNovo
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Produto</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
