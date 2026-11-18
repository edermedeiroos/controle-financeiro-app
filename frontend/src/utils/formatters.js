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
