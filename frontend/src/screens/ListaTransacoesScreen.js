import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ResumoCards from '../components/ResumoCards';
import TransacaoItem from '../components/TransacaoItem';
import { buscarResumo, excluirTransacao, listarTransacoes } from '../services/api';

export default function ListaTransacoesScreen({ navigation }) {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({ totalReceitas: 0, totalDespesas: 0, saldo: 0 });
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async (silencioso = false) => {
    try {
      if (!silencioso) {
        setCarregando(true);
      }
      setErro('');
      const [lista, dadosResumo] = await Promise.all([
        listarTransacoes(),
        buscarResumo(),
      ]);
      setTransacoes(lista || []);
      setResumo(dadosResumo || { totalReceitas: 0, totalDespesas: 0, saldo: 0 });
    } catch (e) {
      setErro(e.message || 'Erro ao carregar transações.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  function confirmarExclusao(item) {
    Alert.alert(
      'Excluir transação',
      `Deseja remover "${item.descricao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirTransacao(item.id);
              carregarDados(true);
            } catch (e) {
              Alert.alert('Erro', e.message || 'Não foi possível excluir.');
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <ResumoCards resumo={resumo} />

      <View style={styles.botoesTopo}>
        <TouchableOpacity
          style={[styles.botaoPrincipal, styles.botaoNova]}
          onPress={() => navigation.navigate('FormTransacao')}
        >
          <Text style={styles.textoBotaoPrincipal}>+ Nova Transação</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoPrincipal, styles.botaoCategorias]}
          onPress={() => navigation.navigate('Categorias')}
        >
          <Text style={styles.textoBotaoCategorias}>Categorias</Text>
        </TouchableOpacity>
      </View>

      {erro ? (
        <View style={styles.caixaErro}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      ) : null}

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1e3a5f" />
        </View>
      ) : (
        <FlatList
          data={transacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TransacaoItem
              item={item}
              onEditar={(transacao) => navigation.navigate('FormTransacao', { transacao })}
              onExcluir={confirmarExclusao}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregarDados(true);
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.textoVazio}>Nenhuma transação encontrada.</Text>
            </View>
          }
          contentContainerStyle={transacoes.length === 0 ? styles.listaVaziaContainer : undefined}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    padding: 14,
  },
  botoesTopo: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  botaoPrincipal: {
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoNova: {
    flex: 2,
    backgroundColor: '#1e3a5f',
  },
  botaoCategorias: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  textoBotaoPrincipal: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  textoBotaoCategorias: {
    color: '#1e293b',
    fontWeight: '600',
    fontSize: 14,
  },
  caixaErro: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  textoErro: {
    color: '#991b1b',
    fontSize: 13,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  textoVazio: {
    color: '#64748b',
    fontSize: 15,
  },
  listaVaziaContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
