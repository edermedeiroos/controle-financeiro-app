import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatarDataBR, formatarMoeda } from '../utils/formatters';

export default function TransacaoItem({ item, onEditar, onExcluir }) {
  const isReceita = item.tipo === 'RECEITA';

  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <Text style={styles.descricao} numberOfLines={2}>
          {item.descricao}
        </Text>
        <View style={[styles.badge, isReceita ? styles.badgeReceita : styles.badgeDespesa]}>
          <Text style={[styles.badgeTexto, isReceita ? styles.textoReceita : styles.textoDespesa]}>
            {isReceita ? 'Receita' : 'Despesa'}
          </Text>
        </View>
      </View>

      <View style={styles.infoLinha}>
        <Text style={styles.meta}>
          {item.categoria?.nome || 'Sem categoria'} • {formatarDataBR(item.data)}
        </Text>
        <Text style={[styles.valor, isReceita ? styles.textoReceita : styles.textoDespesa]}>
          {isReceita ? '+' : '-'} {formatarMoeda(item.valor)}
        </Text>
      </View>

      {item.observacao ? (
        <Text style={styles.observacao}>{item.observacao}</Text>
      ) : null}

      <View style={styles.acoes}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => onEditar(item)}>
          <Text style={styles.textoBotaoEditar}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => onExcluir(item)}>
          <Text style={styles.textoBotaoExcluir}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  descricao: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeReceita: {
    backgroundColor: '#dcfce7',
  },
  badgeDespesa: {
    backgroundColor: '#fee2e2',
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: '#64748b',
  },
  valor: {
    fontSize: 15,
    fontWeight: '700',
  },
  textoReceita: {
    color: '#15803d',
  },
  textoDespesa: {
    color: '#b91c1c',
  },
  observacao: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
    marginBottom: 8,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  botaoEditar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e0f2fe',
  },
  textoBotaoEditar: {
    color: '#0369a1',
    fontSize: 13,
    fontWeight: '600',
  },
  botaoExcluir: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },
  textoBotaoExcluir: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
});
