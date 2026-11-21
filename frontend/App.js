import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import CategoriasScreen from './src/screens/CategoriasScreen';
import FormTransacaoScreen from './src/screens/FormTransacaoScreen';
import ListaTransacoesScreen from './src/screens/ListaTransacoesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="ListaTransacoes"
        screenOptions={{
          headerStyle: { backgroundColor: '#1e3a5f' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen
          name="ListaTransacoes"
          component={ListaTransacoesScreen}
          options={{ title: 'Controle Financeiro' }}
        />
        <Stack.Screen
          name="FormTransacao"
          component={FormTransacaoScreen}
          options={{ title: 'Transação' }}
        />
        <Stack.Screen
          name="Categorias"
          component={CategoriasScreen}
          options={{ title: 'Categorias' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
