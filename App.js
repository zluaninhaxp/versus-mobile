import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './src/components/Header';
import { UserStatus } from './src/components/UserStatus';
import { RankItem } from './src/components/RankItem';

export default function App() {
  const [mlConsumido, setMlConsumido] = useState(225);
  const meta = 2000;

  const ranking = [
    { id: 1, nome: 'Luana Castro', ml: 2250 },
    { id: 2, nome: 'João Silva', ml: 1000 },
    { id: 3, nome: 'Ana Souza', ml: 950 },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <UserStatus 
  ml={mlConsumido} 
  meta={meta} 
  onAdd={(quantidade) => setMlConsumido(p => p + quantidade)} 
/>
        
        <Text style={styles.title}>Ranking</Text>
        {ranking.map((item, index) => (
          <RankItem 
            key={item.id} 
            name={item.nome} 
            ml={item.ml} 
            position={index + 1} 
          />
        ))}
      </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2B5B8E', marginBottom: 15 },
});