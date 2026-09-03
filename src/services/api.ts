const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data: T;
  headers: Headers;
  status: number;
}

export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string, message?: string) {
    super(message || `Erro HTTP ${status}: ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.name = 'ApiError';
  }
}

/**
 * Monta URL com query params limpando valores indefinidos ou vazios.
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        url.searchParams.append(key, String(value).trim());
      }
    });
  }

  return url.toString();
}

/**
 * Cliente HTTP padronizado baseado no Fetch API nativo.
 */
export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number | boolean | undefined>
): Promise<ApiResponse<T>> {
  const url = buildUrl(endpoint, params);

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    // Se a resposta for 204 No Content ou não tiver corpo, evita erro de parse JSON
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {
        data: null as unknown as T,
        headers: response.headers,
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      data,
      headers: response.headers,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Erros de conexão / rede (ex: API fake desligada)
    throw new Error('Falha ao conectar com o servidor. Verifique se a API está em execução.');
  }
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(endpoint, { method: 'GET' }, params),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = void>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
