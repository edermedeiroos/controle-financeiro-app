import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  criarCategoria,
  excluirCategoria,
  listarCategorias,
} from '../services/api';

export default function CategoriasScreen() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregarCategorias = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const lista = await listarCategorias();
      setCategorias(lista || []);
    } catch (e) {
      setErro(e.message || 'Erro ao carregar categorias.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarCategorias();
    }, [carregarCategorias])
  );

  async function handleAdicionar() {
    setErro('');
    setSucesso('');

    if (!nome.trim()) {
      setErro('Informe o nome da categoria.');
      return;
    }

    try {
      setSalvando(true);
      await criarCategoria(nome.trim());
      setNome('');
      setSucesso('Categoria cadastrada com sucesso!');
      carregarCategorias();
    } catch (e) {
      setErro(e.message || 'Não foi possível cadastrar a categoria.');
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao(categoria) {
    setErro('');
    setSucesso('');

    Alert.alert(
      'Excluir categoria',
      `Deseja remover a categoria "${categoria.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirCategoria(categoria.id);
              setSucesso('Categoria excluída com sucesso!');
              carregarCategorias();
            } catch (e) {
              setErro(e.message || 'Não foi possível excluir a categoria.');
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nova categoria..."
          value={nome}
          onChangeText={setNome}
        />
        <TouchableOpacity
          style={[styles.botaoAdicionar, salvando && styles.botaoDesabilitado]}
          onPress={handleAdicionar}
          disabled={salvando}
        >
          <Text style={styles.textoBotao}>
            {salvando ? '...' : 'Adicionar'}
          </Text>
        </TouchableOpacity>
      </View>

      {erro ? (
        <View style={styles.caixaErro}>
          <Text style={styles.textoErro}>{erro}</Text>
        </View>
      ) : null}

      {sucesso ? (
        <View style={styles.caixaSucesso}>
          <Text style={styles.textoSucesso}>{sucesso}</Text>
        </View>
      ) : null}

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1e3a5f" />
        </View>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => confirmarExclusao(item)}
              >
                <Text style={styles.textoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.textoVazio}>Nenhuma categoria cadastrada.</Text>
            </View>
          }
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
  form: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  botaoAdicionar: {
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  caixaErro: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#b91c1c',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  textoErro: {
    color: '#991b1b',
    fontSize: 13,
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemNome: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  botaoExcluir: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoExcluir: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  textoVazio: {
    color: '#64748b',
    fontSize: 14,
  },
});
