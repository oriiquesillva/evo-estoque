# 📦 EvoEstoque — Painel de Controle e Gestão de Produtos

> **Teste Prático — Desenvolvedor(a) Front-End Pleno (React)**  
> Aplicação SPA moderna, performática e resiliente construída em **React 19**, **TypeScript** e **Tailwind CSS**, consumindo uma API REST fake (`json-server`) com paginação real no servidor, sincronização de estado com a URL, debounce na busca e cobertura completa de testes automatizados com **Vitest** e **React Testing Library**.

---

## 🚀 Demonstração Rápida & Status dos Requisitos

| Requisito do Desafio | Status | Implementação |
| :--- | :---: | :--- |
| **1. Listagem de Produtos** | ✅ Concluído | Tabela responsiva, métricas, hover states e badges de status e estoque. |
| **- Busca por nome** | ✅ Concluído | Campo com ícone de lupa, limpeza instantânea (`X`) e **Debounce de 400ms**. |
| **- Filtro por categoria** | ✅ Concluído | Select dinâmico com categorias extraídas do catálogo da API. |
| **- Paginação real na API** | ✅ Concluído | Consome `_page`, `_limit` e cabeçalho `X-Total-Count` do `json-server`. |
| **- Estados de Feedback** | ✅ Concluído | **Loading** (Skeletons animados), **Erro** (com botão retry) e **Vazio** (Empty state com atalho para limpar filtros). |
| **2. Detalhe do Produto** | ✅ Concluído | Rota `/produtos/:id` com dados completos, badges e cálculo de patrimônio em estoque. |
| **3. Criar e Editar Produto** | ✅ Concluído | Formulário reutilizável com validação inline rigorosa (nome $\ge 3$, preço $> 0$, estoque $\ge 0$) e feedback visual Toast. |
| **4. Excluir Produto** | ✅ Concluído | Modal acessível (WAI-ARIA), tecla `Escape`, bloqueio de scroll de fundo e foco seguro. |
| **Bônus: TypeScript bem usado** | ✅ Concluído | Tipagem estrita de entidades, DTOs, parâmetros de busca e respostas paginadas. |
| **Bônus: Debounce na busca** | ✅ Concluído | Hook customizado `useDebounce` cancelando requisições intermediárias via cleanup. |
| **Bônus: React Router com URL State** | ✅ Concluído | `useSearchParams` sincronizando página, busca e categoria na URL (`/?page=2&busca=SSD`). |
| **Bônus: Testes com RTL** | ✅ Concluído | **17 testes aprovados** em 4 suítes cobrindo utilitários, hooks e componentes de formulário. |

---

## 🛠️ Stack Tecnológica & Decisões Arquiteturais

* **React 19 & TypeScript:** Tipagem estrita com modo moderno (`erasableSyntaxOnly`), prevenção de bugs em tempo de compilação e alta produtividade.
* **Vite:** Build ultra-rápido, Hot Module Replacement (HMR) instantâneo e bundling otimizado para produção.
* **Tailwind CSS v4:** Estilização com a nova arquitetura `@tailwindcss/vite`, garantindo interface limpa, moderna e responsiva sem sobrecarga de CSS runtime.
* **React Router DOM v7:** Roteamento client-side declarativo com Layout Routes (`<Outlet />`), rotas dinâmicas (`useParams`) e sincronização de query params (`useSearchParams`).
* **Lucide React:** Biblioteca consistente de ícones vetoriais em SVG.
* **Vitest & React Testing Library (RTL):** Testes unitários e de integração com JSDOM, simulando interações reais de usuários com `@testing-library/user-event`.

---

## 📁 Estrutura do Projeto

O projeto foi desenhado sob os princípios de **Clean Architecture** e **Separation of Concerns (SoC)**:

```text
src/
├── components/
│   ├── common/              # Componentes genéricos de UI (Skeleton, Modal, Toast, EmptyState, Error)
│   ├── layout/              # Layout mestre (Navbar, AppLayout com <Outlet />)
│   └── products/            # Componentes de domínio (Tabela, Filtros, Busca, Paginação, Formulário)
├── hooks/                   # Hooks customizados reutilizáveis (useDebounce)
├── pages/                   # Telas da aplicação (Listagem, Detalhes, Formulário, 404)
├── services/                # Camada centralizada de comunicação HTTP (api.ts e productService.ts)
├── test/                    # Setup global de testes (setup.ts com jest-dom)
├── types/                   # Definições de contratos TypeScript e DTOs
└── utils/                   # Funções utilitárias puras (formatadores BRL e numéricos)
```

---

## ⚙️ Como Instalar e Rodar o Projeto

### Pré-requisitos
* **Node.js** (versão 18 ou superior instalada)
* **npm** (versão 9 ou superior)

### 1. Clonar o Repositório
```bash
git clone https://github.com/oriiquesillva/evo-estoque.git
cd evo-estoque
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Subir a API Fake (`json-server`)
Em um terminal, execute:
```bash
npm run server
```
> A API REST fake subirá em `http://localhost:3001` servindo o recurso `/produtos` com base no arquivo `db.json`.

### 4. Subir a Aplicação Front-End (Vite)
Em outro terminal, execute:
```bash
npm run dev
```
> Acesse no seu navegador: **`http://localhost:5173/`**

---

## 🧪 Executando os Testes Automatizados

Para rodar a suíte completa de testes automatizados com o **Vitest**:

```bash
npm run test
```

Para rodar os testes em modo interativo (*watch mode* durante o desenvolvimento):
```bash
npm run test:watch
```

---

## 🏗️ Verificação de Build e Tipos

Para compilar o código TypeScript e gerar o bundle de produção otimizado:
```bash
npm run build
```

---

## 📜 Histórico de Commits

Seguindo as orientações do teste (*"Faça commits ao longo do desenvolvimento. A gente olha o histórico."*), o projeto foi versionado de forma incremental e semântica (**Conventional Commits**):

* `chore: initial project setup with vite, react 19, typescript and tailwind css`
* `feat(api): setup types, centralized http client and product service layer`
* `feat(routes): configure react router, app layout shell and base pages`
* `feat(products): implement product list with server pagination, debounce search and url state`
* `feat(products): implement comprehensive product detail view with metrics and actions`
* `feat(forms): implement validated product form with inline errors and feedback`
* `feat(products): enhance delete confirmation modal with escape key, focus management and body lock`
* `test: add comprehensive unit and integration test suite with vitest and react testing library`
* `docs: finalize professional readme with architecture and setup guide`

---

Desenvolvido por **[oriiquesillva](https://github.com/oriiquesillva)**.
