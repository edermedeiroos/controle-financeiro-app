import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  atualizarTransacao,
  criarTransacao,
  listarCategorias,
} from '../services/api';
import {
  dataHojeISO,
  formatarDataBR,
  parseDataParaISO,
  parseValorNumerico,
} from '../utils/formatters';

export default function FormTransacaoScreen({ navigation, route }) {
  const transacaoEdicao = route.params?.transacao || null;
  const isEdicao = Boolean(transacaoEdicao);

  const [descricao, setDescricao] = useState(transacaoEdicao?.descricao || '');
  const [valor, setValor] = useState(
    transacaoEdicao?.valor != null
      ? Number(transacaoEdicao.valor).toFixed(2).replace('.', ',')
      : ''
  );
  const [data, setData] = useState(
    formatarDataBR(transacaoEdicao?.data || dataHojeISO())
  );
  const [tipo, setTipo] = useState(transacaoEdicao?.tipo || 'DESPESA');
  const [categoriaId, setCategoriaId] = useState(
    transacaoEdicao?.categoria?.id || null
  );
  const [observacao, setObservacao] = useState(transacaoEdicao?.observacao || '');

  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: isEdicao ? 'Editar Transação' : 'Nova Transação',
    });
  }, [isEdicao, navigation]);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const lista = await listarCategorias();
        setCategorias(lista || []);
        if (!isEdicao && lista && lista.length > 0 && !categoriaId) {
          setCategoriaId(lista[0].id);
        }
      } catch (e) {
        setErro(e.message || 'Erro ao carregar categorias.');
      } finally {
        setCarregandoCategorias(false);
      }
    }
    carregarCategorias();
  }, []);

  async function handleSalvar() {
    setErro('');

    if (!descricao.trim()) {
      setErro('A descrição é obrigatória.');
      return;
    }

    const valorNumero = parseValorNumerico(valor);
    if (Number.isNaN(valorNumero) || valorNumero <= 0) {
      setErro('Informe um valor válido maior que zero.');
      return;
    }

    const dataIso = parseDataParaISO(data);
    if (!dataIso) {
      setErro('Informe uma data válida no formato DD/MM/AAAA.');
      return;
    }

    if (!categoriaId) {
      setErro('Selecione uma categoria.');
      return;
    }

    const payload = {
      descricao: descricao.trim(),
      valor: valorNumero,
      data: dataIso,
      tipo,
      categoria: { id: categoriaId },
      observacao: observacao.trim() ? observacao.trim() : null,
    };

    try {
      setSalvando(true);
      if (isEdicao) {
        await atualizarTransacao(transacaoEdicao.id, payload);
        Alert.alert('Sucesso', 'Transação atualizada com sucesso!');
      } else {
        await criarTransacao(payload);
        Alert.alert('Sucesso', 'Transação cadastrada com sucesso!');
      }
      navigation.goBack();
    } catch (e) {
      setErro(e.message || 'Não foi possível salvar a transação.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      {erro ? (
        <View style={styles.caixaErro}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Descrição *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Supermercado, Salário..."
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Valor (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 150,00"
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={setValor}
      />

      <Text style={styles.label}>Data (DD/MM/AAAA) *</Text>
      <TextInput
        style={styles.input}
        placeholder="20/11/2026"
        value={data}
        onChangeText={setData}
      />

      <Text style={styles.label}>Tipo *</Text>
      <View style={styles.grupoBotoes}>
        <TouchableOpacity
          style={[
            styles.botaoTipo,
            tipo === 'RECEITA' && styles.botaoReceitaAtivo,
          ]}
          onPress={() => setTipo('RECEITA')}
        >
          <Text
            style={[
              styles.textoBotaoTipo,
              tipo === 'RECEITA' && styles.textoBotaoAtivo,
            ]}
          >
            Receita
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoTipo,
            tipo === 'DESPESA' && styles.botaoDespesaAtivo,
          ]}
          onPress={() => setTipo('DESPESA')}
        >
          <Text
            style={[
              styles.textoBotaoTipo,
              tipo === 'DESPESA' && styles.textoBotaoAtivo,
            ]}
          >
            Despesa
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Categoria *</Text>
      {carregandoCategorias ? (
        <ActivityIndicator size="small" color="#1e3a5f" style={styles.loaderCat} />
      ) : categorias.length === 0 ? (
        <Text style={styles.semCategorias}>
          Nenhuma categoria cadastrada. Cadastre uma antes de continuar.
        </Text>
      ) : (
        <View style={styles.chipsContainer}>
          {categorias.map((cat) => {
            const selecionada = cat.id === categoriaId;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selecionada && styles.chipSelecionado]}
                onPress={() => setCategoriaId(cat.id)}
              >
                <Text
                  style={[
                    styles.textoChip,
                    selecionada && styles.textoChipSelecionado,
                  ]}
                >
                  {cat.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Text style={styles.label}>Observação (opcional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Detalhes adicionais..."
        multiline
        numberOfLines={3}
        value={observacao}
        onChangeText={setObservacao}
      />

      <TouchableOpacity
        style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.textoBotaoSalvar}>
            {isEdicao ? 'Atualizar Transação' : 'Salvar Transação'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  conteudo: {
    padding: 16,
  },
  caixaErro: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  textoErro: {
    color: '#991b1b',
    fontSize: 13,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  grupoBotoes: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  botaoTipo: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  botaoReceitaAtivo: {
    backgroundColor: '#15803d',
    borderColor: '#15803d',
  },
  botaoDespesaAtivo: {
    backgroundColor: '#b91c1c',
    borderColor: '#b91c1c',
  },
  textoBotaoTipo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  textoBotaoAtivo: {
    color: '#ffffff',
  },
  loaderCat: {
    marginVertical: 10,
  },
  semCategorias: {
    color: '#b91c1c',
    fontSize: 13,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  chipSelecionado: {
    backgroundColor: '#1e3a5f',
    borderColor: '#1e3a5f',
  },
  textoChip: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  textoChipSelecionado: {
    color: '#ffffff',
  },
  botaoSalvar: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoSalvar: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
