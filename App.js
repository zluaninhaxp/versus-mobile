import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Importações dos seus componentes
import { Header } from "./src/components/Header";
import { UserStatus } from "./src/components/UserStatus";
import { RankItem } from "./src/components/RankItem";
import { WaterSettingsModal } from "./src/components/WaterSettingsModal";
import { UserProfileModal } from "./src/components/UserProfile";
import { MyHistoryModal } from "./src/components/MyHistory";
import { BottomTabs } from "./src/components/BottomTabs"; // Novo!

// Funções auxiliares para datas
function todayAt(h, m) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export default function App() {
  const [mlConsumido, setMlConsumido] = useState(200);
  const [nome, setNome] = useState("Luana Castro");
  const [meta, setMeta] = useState(2500);

  const [isWaterSettingsOpen, setIsWaterSettingsOpen] = useState(false);
  const [isMyHistoryOpen, setIsMyHistoryOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeReactionId, setActiveReactionId] = useState(null);

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Luana Castro",
      ml: 2850,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=32",
      reactions: [{ emoji: "❤️", count: 5 }],
      waterHistory: [
        { ml: 500, time: todayAt(7, 0) },
        { ml: 1000, time: todayAt(12, 10) },
      ],
    },
    {
      id: 2,
      nome: "Carlos Mendes",
      ml: 2600,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=12",
      reactions: [],
      waterHistory: [],
    },
    {
      id: 3,
      nome: "Beatriz Costa",
      ml: 2400,
      meta: 2000,
      foto: "https://i.pravatar.cc/300?img=45",
      reactions: [],
      waterHistory: [],
    },
    {
      id: 5,
      nome: "Mariana Lima",
      ml: 2100,
      meta: 2000,
      foto: "https://i.pravatar.cc/300?img=28",
      reactions: [],
      waterHistory: [],
    },
    {
      id: 6,
      nome: "Rafael Sousa",
      ml: 1700,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=15",
      reactions: [],
      waterHistory: [],
    },
  ]);

  const handleAddWater = (quantidade) => {
    const novoMl = mlConsumido + quantidade;
    setMlConsumido(novoMl);
    setUsuarios((prev) =>
      prev.map((u) => (u.id === 1 ? { ...u, ml: novoMl } : u)),
    );
  };

  const rankingOrdenado = [...usuarios]
    .map((u) => (u.id === 1 ? { ...u, ml: mlConsumido, meta: meta } : u))
    .sort((a, b) => b.ml - a.ml);

  const selectedUser = usuarios.find((u) => u.id === selectedUserId) || null;
  const selectedPosition = selectedUser
    ? rankingOrdenado.findIndex((u) => u.id === selectedUserId) + 1
    : 1;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            onOpenMenu={() => {}} // Placeholder já que removeu o drawer
            onOpenHistory={() => setIsMyHistoryOpen(true)}
            onOpenSettings={() => setIsWaterSettingsOpen(true)}
          />

          <UserStatus
            userName={nome}
            ml={mlConsumido}
            meta={meta}
            onAdd={handleAddWater}
          />

          <View style={styles.rankingHeader}>
            <Text style={styles.rankingTitle}>Ranking de Hidratação</Text>
            <Text style={styles.rankingSubtitle}>
              Reaja e incentive seus amigos!
            </Text>
          </View>

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
                activeReactionId={activeReactionId}
                onOpenReaction={setActiveReactionId}
                onPress={() => setSelectedUserId(item.id)}
              />
            ))}
          </View>
        </ScrollView>

        {/* MENU INFERIOR FIXO */}
        <BottomTabs />

        {/* MODAIS */}
        <WaterSettingsModal
          visible={isWaterSettingsOpen}
          onClose={() => setIsWaterSettingsOpen(false)}
          currentMeta={meta}
          onSave={(newMeta) => setMeta(newMeta)}
        />

        <UserProfileModal
          visible={selectedUserId !== null}
          onClose={() => setSelectedUserId(null)}
          nome={selectedUser?.nome || ""}
          foto={selectedUser?.foto}
          ml={selectedUser?.ml || 0}
          meta={selectedUser?.meta || 0}
          position={selectedPosition}
          waterHistory={selectedUser?.waterHistory || []}
        />

        <MyHistoryModal
          visible={isMyHistoryOpen}
          onClose={() => setIsMyHistoryOpen(false)}
          waterHistory={usuarios.find((u) => u.id === 1)?.waterHistory || []}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rankingHeader: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  rankingTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#274c77",
  },
  rankingSubtitle: {
    fontSize: 13,
    color: "#8b8c89",
    fontWeight: "500",
  },
  rankingWrapper: {
    width: "100%",
  },
});
