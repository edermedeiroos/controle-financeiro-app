export function formatarMoeda(valor) {
  const numero = Number(valor || 0);
  const negativo = numero < 0;
  const absoluto = Math.abs(numero).toFixed(2);
  const [inteiro, decimal] = absoluto.split('.');
  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negativo ? '- ' : ''}R$ ${inteiroFormatado},${decimal}`;
}

export function formatarDataBR(dataIso) {
  if (!dataIso || typeof dataIso !== 'string') {
    return '';
  }
  const partes = dataIso.split('-');
  if (partes.length !== 3) {
    return dataIso;
  }
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function dataHojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function parseDataParaISO(texto) {
  if (!texto || typeof texto !== 'string') {
    return null;
  }
  const limpo = texto.trim();

  let dia;
  let mes;
  let ano;

  const matchBR = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(limpo);
  const matchISO = /^(\d{4})-(\d{2})-(\d{2})$/.exec(limpo);

  if (matchBR) {
    dia = Number(matchBR[1]);
    mes = Number(matchBR[2]);
    ano = Number(matchBR[3]);
  } else if (matchISO) {
    ano = Number(matchISO[1]);
    mes = Number(matchISO[2]);
    dia = Number(matchISO[3]);
  } else {
    return null;
  }

  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
    return null;
  }

  const data = new Date(ano, mes - 1, dia);
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null;
  }

  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

export function parseValorNumerico(texto) {
  if (texto == null) {
    return NaN;
  }
  const limpo = String(texto).trim().replace(/\s+/g, '');
  if (!limpo) {
    return NaN;
  }

  let normalizado = limpo;
  if (limpo.includes(',')) {
    normalizado = limpo.replace(/\./g, '').replace(',', '.');
  }

  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : NaN;
}
