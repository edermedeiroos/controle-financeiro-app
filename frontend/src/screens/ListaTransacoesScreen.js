import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ResumoCards from '../components/ResumoCards';
import TransacaoItem from '../components/TransacaoItem';
import { buscarResumo, excluirTransacao, listarTransacoes } from '../services/api';

const CAMPOS_ORDENACAO = [
  { key: 'data', label: 'Data' },
  { key: 'valor', label: 'Valor' },
  { key: 'descricao', label: 'Descrição' },
];

export default function ListaTransacoesScreen({ navigation }) {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({ totalReceitas: 0, totalDespesas: 0, saldo: 0 });
  const [textoBusca, setTextoBusca] = useState('');
  const [buscaAtiva, setBuscaAtiva] = useState('');
  const [campoOrdenacao, setCampoOrdenacao] = useState('data');
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState('desc');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const carregarDados = useCallback(
    async (silencioso = false, buscaParam = buscaAtiva, campoParam = campoOrdenacao, direcaoParam = direcaoOrdenacao) => {
      try {
        if (!silencioso) {
          setCarregando(true);
        }
        setErro('');
        const [lista, dadosResumo] = await Promise.all([
          listarTransacoes(buscaParam, campoParam, direcaoParam),
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
    },
    [buscaAtiva, campoOrdenacao, direcaoOrdenacao]
  );

  useFocusEffect(
    useCallback(() => {
      setMensagemSucesso('');
      carregarDados();
    }, [carregarDados])
  );

  function aplicarBusca() {
    setBuscaAtiva(textoBusca);
    carregarDados(false, textoBusca, campoOrdenacao, direcaoOrdenacao);
  }

  function limparBusca() {
    setTextoBusca('');
    setBuscaAtiva('');
    carregarDados(false, '', campoOrdenacao, direcaoOrdenacao);
  }

  function selecionarCampo(campo) {
    setCampoOrdenacao(campo);
    carregarDados(false, buscaAtiva, campo, direcaoOrdenacao);
  }

  function alternarDirecao() {
    const novaDirecao = direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    setDirecaoOrdenacao(novaDirecao);
    carregarDados(false, buscaAtiva, campoOrdenacao, novaDirecao);
  }

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
              setMensagemSucesso('');
              await excluirTransacao(item.id);
              setMensagemSucesso('Transação excluída com sucesso!');
              carregarDados(true);
            } catch (e) {
              setErro(e.message || 'Não foi possível excluir a transação.');
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

      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por descrição..."
          value={textoBusca}
          onChangeText={setTextoBusca}
          returnKeyType="search"
          onSubmitEditing={aplicarBusca}
        />
        <TouchableOpacity style={styles.botaoBuscar} onPress={aplicarBusca}>
          <Text style={styles.textoBotaoBuscar}>Buscar</Text>
        </TouchableOpacity>
        {buscaAtiva ? (
          <TouchableOpacity style={styles.botaoLimpar} onPress={limparBusca}>
            <Text style={styles.textoBotaoLimpar}>Limpar</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.ordenacaoContainer}>
        <View style={styles.ordenacaoCampos}>
          {CAMPOS_ORDENACAO.map((opcao) => {
            const ativo = campoOrdenacao === opcao.key;
            return (
              <TouchableOpacity
                key={opcao.key}
                style={[styles.chipOrdem, ativo && styles.chipOrdemAtivo]}
                onPress={() => selecionarCampo(opcao.key)}
              >
                <Text style={[styles.textoChipOrdem, ativo && styles.textoChipOrdemAtivo]}>
                  {opcao.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.botaoDirecao} onPress={alternarDirecao}>
          <Text style={styles.textoDirecao}>
            {direcaoOrdenacao === 'asc' ? 'Crescente ↑' : 'Decrescente ↓'}
          </Text>
        </TouchableOpacity>
      </View>

      {erro ? (
        <View style={styles.caixaErro}>
          <Text style={styles.textoErro}>{erro}</Text>
          <TouchableOpacity onPress={() => carregarDados()}>
            <Text style={styles.textoTentarNovamente}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {mensagemSucesso ? (
        <View style={styles.caixaSucesso}>
          <Text style={styles.textoSucesso}>{mensagemSucesso}</Text>
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
    marginBottom: 10,
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
  buscaContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  inputBusca: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  botaoBuscar: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  textoBotaoBuscar: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  botaoLimpar: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  textoBotaoLimpar: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  ordenacaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ordenacaoCampos: {
    flexDirection: 'row',
    gap: 6,
  },
  chipOrdem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  chipOrdemAtivo: {
    backgroundColor: '#1e3a5f',
  },
  textoChipOrdem: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  textoChipOrdemAtivo: {
    color: '#ffffff',
  },
  botaoDirecao: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  textoDirecao: {
    fontSize: 12,
    color: '#1e3a5f',
    fontWeight: '600',
  },
  caixaErro: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#b91c1c',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  textoErro: {
    flex: 1,
    color: '#991b1b',
    fontSize: 13,
  },
  textoTentarNovamente: {
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  caixaSucesso: {
    backgroundColor: '#dcfce7',
    borderLeftWidth: 4,
    borderLeftColor: '#15803d',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  textoSucesso: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '500',
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
