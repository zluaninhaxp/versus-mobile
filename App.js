import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./src/components/Header";
import { UserStatus } from "./src/components/UserStatus";
import { RankItem } from "./src/components/RankItem";
import { ProfileDrawer } from "./src/components/ProfileDrawer";
import { WaterSettingsModal } from "./src/components/WaterSettingsModal";

export default function App() {
  const [mlConsumido, setMlConsumido] = useState(2850);
  const [nome, setNome] = useState("Ana Silva");
  const [meta, setMeta] = useState(2500);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWaterSettingsOpen, setIsWaterSettingsOpen] = useState(false);

  // Estado com reações para cada usuário
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Ana Silva",
      ml: 2850,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=32",
      reactions: [
        { emoji: "❤️", count: 5 },
        { emoji: "👏", count: 3 },
        { emoji: "👍", count: 2 },
      ],
    },
    {
      id: 2,
      nome: "Carlos Mendes",
      ml: 2600,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=12",
      reactions: [
        { emoji: "💧", count: 4 },
        { emoji: "🎉", count: 2 },
      ],
    },
    {
      id: 3,
      nome: "Beatriz Costa",
      ml: 2400,
      meta: 2000,
      foto: "https://i.pravatar.cc/300?img=45",
      reactions: [{ emoji: "💖", count: 6 }],
    },
    {
      id: 4,
      nome: "Diego Santos",
      ml: 2200,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=33",
      reactions: [
        { emoji: "👍", count: 1 },
        { emoji: "👏", count: 1 },
      ],
    },
    {
      id: 5,
      nome: "Mariana Lima",
      ml: 1950,
      meta: 2000,
      foto: "https://i.pravatar.cc/300?img=28",
      reactions: [{ emoji: "🔥", count: 3 }],
    },
    {
      id: 6,
      nome: "Rafael Sousa",
      ml: 1700,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=15",
      reactions: [],
    },
  ]);

  // Função para adicionar reação a um usuário
  const handleAddReaction = (userId: number, emoji: string) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) => {
        if (usuario.id === userId) {
          const reactions = [...usuario.reactions];
          const existingReaction = reactions.find((r) => r.emoji === emoji);

          if (existingReaction) {
            // Incrementa o contador se a reação já existe
            existingReaction.count += 1;
          } else {
            // Adiciona nova reação
            reactions.push({ emoji, count: 1 });
          }

          return { ...usuario, reactions };
        }
        return usuario;
      })
    );
  };

  // Atualiza o ml do usuário principal
  const handleAddWater = (quantidade: number) => {
    const novoMl = mlConsumido + quantidade;
    setMlConsumido(novoMl);

    // Atualiza também no array de usuários
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id === 1 ? { ...usuario, ml: novoMl } : usuario
      )
    );
  };

  const rankingOrdenado = [...usuarios].sort((a, b) => b.ml - a.ml);

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
            onAdd={handleAddWater}
          />

          {/* Header do Ranking */}
          <View style={styles.rankingHeader}>
            <Text style={styles.rankingTitle}>💧 Ranking de Hidratação</Text>
            <Text style={styles.rankingSubtitle}>
              Reaja e incentive seus amigos!
            </Text>
          </View>

          {/* Lista de Ranking */}
          <View style={styles.rankingWrapper}>
            {rankingOrdenado.map((item, index) => (
              <RankItem
                key={item.id}
                position={index + 1}
                nome={item.nome}
                ml={item.ml}
                meta={item.meta}
                foto={item.foto}
                reactions={item.reactions}
                onReactionAdd={(emoji) => handleAddReaction(item.id, emoji)}
              />
            ))}
          </View>
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
  rankingHeader: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  rankingTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2B5B8E",
    marginBottom: 4,
  },
  rankingSubtitle: {
    fontSize: 13,
    color: "#7B8FA3",
    fontWeight: "500",
  },
  rankingWrapper: {
    width: "100%",
  },
});