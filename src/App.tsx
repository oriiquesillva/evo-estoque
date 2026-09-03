import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ProductsPage />} />
          <Route path="produtos/novo" element={<ProductFormPage />} />
          <Route path="produtos/:id" element={<ProductDetailPage />} />
          <Route path="produtos/:id/editar" element={<ProductFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
