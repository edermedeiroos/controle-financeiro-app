// Emulador Android usa 10.0.2.2 para acessar o localhost da máquina.
// Em dispositivo físico com Expo Go, troque pelo IP local da máquina (ex: http://192.168.0.15:8080/api).
const BASE_URL = 'http://10.0.2.2:8080/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (err) {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o back-end está em execução.');
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = null;
    }
  }

  if (!response.ok) {
    if (data && data.campos) {
      const mensagensCampos = Object.values(data.campos).join('\n');
      throw new Error(mensagensCampos || data.erro || 'Erro de validação.');
    }
    throw new Error((data && data.erro) || `Erro na requisição (${response.status}).`);
  }

  return data;
}

export function listarTransacoes(busca = '', campo = 'data', direcao = 'desc') {
  const params = new URLSearchParams();
  if (busca && busca.trim()) {
    params.append('busca', busca.trim());
  }
  if (campo) {
    params.append('campo', campo);
  }
  if (direcao) {
    params.append('direcao', direcao);
  }
  return request(`/transacoes?${params.toString()}`);
}

export function buscarTransacaoPorId(id) {
  return request(`/transacoes/${id}`);
}

export function buscarResumo() {
  return request('/transacoes/resumo');
}

export function criarTransacao(dados) {
  return request('/transacoes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function atualizarTransacao(id, dados) {
  return request(`/transacoes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export function excluirTransacao(id) {
  return request(`/transacoes/${id}`, {
    method: 'DELETE',
  });
}

export function listarCategorias() {
  return request('/categorias');
}

export function criarCategoria(nome) {
  return request('/categorias', {
    method: 'POST',
    body: JSON.stringify({ nome }),
  });
}

export function excluirCategoria(id) {
  return request(`/categorias/${id}`, {
    method: 'DELETE',
  });
}
