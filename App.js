import React, { useState } from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./src/components/Header";
import { UserStatus } from "./src/components/UserStatus";
import { RankItem } from "./src/components/RankItem";
import { ProfileDrawer } from "./src/components/ProfileDrawer";
import { WaterSettingsModal } from "./src/components/WaterSettingsModal";

export default function App() {
  const [mlConsumido, setMlConsumido] = useState(0);
  const [nome, setNome] = useState("Luana Castro");
  const [meta, setMeta] = useState(3000);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWaterSettingsOpen, setIsWaterSettingsOpen] = useState(false);

  // Lista de usuários fictícios
  const usuariosAmigos = [
    {
      id: 2,
      nome: "Ana Souza",
      ml: 1800,
      foto: "https://i.pravatar.cc/150?u=ana",
    },
    {
      id: 3,
      nome: "Marcos Vaz",
      ml: 950,
      foto: "https://i.pravatar.cc/150?u=marcos",
    },
    {
      id: 4,
      nome: "João Silva",
      ml: 2500,
      foto: "https://i.pravatar.cc/150?u=joao",
    },
  ];

  // Criamos o Ranking unindo os amigos com os seus dados atuais
  // Isso faz com que você também apareça na lista!
  const rankingCompleto = [
    ...usuariosAmigos,
    { id: 1, nome: nome, ml: mlConsumido, foto: "" }, // Você
  ];

  // A MÁGICA: Ordena o ranking do maior para o menor ML
  const rankingOrdenado = rankingCompleto.sort((a, b) => b.ml - a.ml);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header
          onOpenMenu={() => setIsProfileOpen(true)}
          onOpenSettings={() => setIsWaterSettingsOpen(true)}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <UserStatus
            userName={nome}
            ml={mlConsumido}
            meta={meta}
            onAdd={(q) => setMlConsumido((prev) => prev + q)}
          />

          <Text style={styles.rankingTitle}>Ranking da Galera</Text>

          {/* O "For" (Map) percorrendo a lista já ordenada */}
          {rankingOrdenado.map((item, index) => (
            <RankItem
              key={item.id}
              position={index + 1} // Passando a posição correta (1, 2, 3...)
              nome={item.nome}
              ml={item.ml}
              foto={item.foto}
            />
          ))}
        </ScrollView>

        <ProfileDrawer
          visible={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userName={nome}
        />

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
  container: { flex: 1, backgroundColor: "#F5F9FF" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  rankingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B5B8E",
    marginTop: 30, // Dei um pouco mais de respiro
    marginBottom: 15,
  },
});
