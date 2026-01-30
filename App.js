import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Header } from './src/components/Header';
import { UserStatus } from './src/components/UserStatus';
import { RankItem } from './src/components/RankItem';

// Imagine que criamos esses dois abaixo seguindo o modelo do SettingsModal anterior
import { ProfileModal } from './src/components/ProfileModal'; 
import { WaterSettingsModal } from './src/components/WaterSettingsModal';

export default function App() {
  const [mlConsumido, setMlConsumido] = useState(0);
  
  // Dados de Perfil (Vão para o Menu)
  const [nome, setNome] = useState('LUANA CASTRO');
  
  // Dados de Configuração (Vão para a Engrenagem)
  const [meta, setMeta] = useState(3000);
  
  // Controles de Visibilidade
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWaterSettingsOpen, setIsWaterSettingsOpen] = useState(false);

  const ranking = [
    { id: 1, nome: 'João Silva', ml: 2500, foto: 'https://i.pravatar.cc/150?u=joao' },
    { id: 2, nome: 'Ana Souza', ml: 1800, foto: 'https://i.pravatar.cc/150?u=ana' },
    { id: 3, nome: 'Marcos Vaz', ml: 950, foto: 'https://i.pravatar.cc/150?u=marcos' },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        
        <Header 
          onOpenMenu={() => setIsProfileOpen(true)} 
          onOpenSettings={() => setIsWaterSettingsOpen(true)} 
        />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <UserStatus 
            userName={nome}
            ml={mlConsumido} 
            meta={meta}
            onAdd={(q) => setMlConsumido(prev => prev + q)} 
          />

          <Text style={styles.rankingTitle}>Ranking da Galera</Text>

          {ranking.map((item, index) => (
            <RankItem 
              key={item.id}
              posicao={index + 1}
              nome={item.nome}
              ml={item.ml}
              foto={item.foto}
            />
          ))}
        </ScrollView>

        {/* MODAL DO PERFIL (Menu Lateral) */}
        <ProfileModal 
          visible={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentName={nome}
          onSave={(newName) => setNome(newName.toUpperCase())}
        />

        {/* MODAL DE CONFIG DA ÁGUA (Engrenagem) */}
        <WaterSettingsModal 
          visible={isWaterSettingsOpen}
          onClose={() => setIsWaterSettingsOpen(false)}
          currentMeta={meta}
          onSave={(newMeta) => setMeta(newMeta)}
        />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  rankingTitle: { fontSize: 18, fontWeight: 'bold', color: '#2B5B8E', marginTop: 20, marginBottom: 15 },
});