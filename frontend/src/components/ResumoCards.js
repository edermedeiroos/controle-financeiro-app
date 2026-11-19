import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatarMoeda } from '../utils/formatters';

export default function ResumoCards({ resumo }) {
  const totalReceitas = resumo?.totalReceitas ?? 0;
  const totalDespesas = resumo?.totalDespesas ?? 0;
  const saldo = resumo?.saldo ?? 0;

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.cardReceita]}>
        <Text style={styles.label}>Receitas</Text>
        <Text style={[styles.valor, styles.textoReceita]}>
          {formatarMoeda(totalReceitas)}
        </Text>
      </View>

      <View style={[styles.card, styles.cardDespesa]}>
        <Text style={styles.label}>Despesas</Text>
        <Text style={[styles.valor, styles.textoDespesa]}>
          {formatarMoeda(totalDespesas)}
        </Text>
      </View>

      <View style={[styles.card, styles.cardSaldo]}>
        <Text style={styles.label}>Saldo</Text>
        <Text
          style={[
            styles.valor,
            Number(saldo) >= 0 ? styles.textoSaldoPositivo : styles.textoDespesa,
          ]}
        >
          {formatarMoeda(saldo)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderTopWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardReceita: {
    borderTopColor: '#15803d',
  },
  cardDespesa: {
    borderTopColor: '#b91c1c',
  },
  cardSaldo: {
    borderTopColor: '#1d4ed8',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  valor: {
    fontSize: 13,
    fontWeight: '700',
  },
  textoReceita: {
    color: '#15803d',
  },
  textoDespesa: {
    color: '#b91c1c',
  },
  textoSaldoPositivo: {
    color: '#1d4ed8',
  },
});
