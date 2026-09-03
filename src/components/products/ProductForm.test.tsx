import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ProductForm } from './ProductForm';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ProductForm component', () => {
  it('deve exibir mensagens de erro inline ao submeter formulário vazio', async () => {
    const handleSubmit = vi.fn();
    renderWithRouter(<ProductForm onSubmit={handleSubmit} isEditing={false} />);

    const submitButton = screen.getByRole('button', { name: /Cadastrar Produto/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/O nome do produto é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/O preço é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/A quantidade em estoque é obrigatória/i)).toBeInTheDocument();

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('deve validar que o nome possui no mínimo 3 caracteres', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    renderWithRouter(<ProductForm onSubmit={handleSubmit} isEditing={false} />);

    const nomeInput = screen.getByLabelText(/Nome do Produto/i);
    await user.type(nomeInput, 'AB');

    const submitButton = screen.getByRole('button', { name: /Cadastrar Produto/i });
    await user.click(submitButton);

    expect(await screen.findByText(/O nome deve ter no mínimo 3 caracteres/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('deve validar que o preço deve ser maior que zero', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    renderWithRouter(<ProductForm onSubmit={handleSubmit} isEditing={false} />);

    const precoInput = screen.getByLabelText(/Preço Unitário/i);
    await user.type(precoInput, '0');

    const submitButton = screen.getByRole('button', { name: /Cadastrar Produto/i });
    await user.click(submitButton);

    expect(await screen.findByText(/O preço deve ser um valor numérico maior que zero/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('deve chamar onSubmit com dados válidos formatados', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithRouter(<ProductForm onSubmit={handleSubmit} isEditing={false} />);

    const nomeInput = screen.getByLabelText(/Nome do Produto/i);
    const precoInput = screen.getByLabelText(/Preço Unitário/i);
    const estoqueInput = screen.getByLabelText(/Quantidade em Estoque/i);

    await user.type(nomeInput, 'Mousepad Gamer Extra Grande');
    await user.type(precoInput, '89,90');
    await user.type(estoqueInput, '15');

    const submitButton = screen.getByRole('button', { name: /Cadastrar Produto/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({
        nome: 'Mousepad Gamer Extra Grande',
        categoria: 'Perifericos',
        preco: 89.9,
        estoque: 15,
        ativo: true,
      });
    });
  });
});
