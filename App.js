import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./src/components/Header";
import { UserStatus } from "./src/components/UserStatus";
import { RankItem } from "./src/components/RankItem";
import { ProfileDrawer } from "./src/components/ProfileDrawer";
import { WaterSettingsModal } from "./src/components/WaterSettingsModal";
import { UserProfileModal } from "./src/components/UserProfileModal";
import { MyHistoryModal } from "./src/components/MyHistoryModal";

// Helpers para timestamps (mantidos)
function todayAt(h, m) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
function yesterdayAt(h, m) {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
function daysAgoAt(days, h, m) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export default function App() {
  const [mlConsumido, setMlConsumido] = useState(2850);
  const [nome, setNome] = useState("Luana Castro"); // Nome atualizado conforme solicitado
  const [meta, setMeta] = useState(2500);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWaterSettingsOpen, setIsWaterSettingsOpen] = useState(false);
  const [activeReactionId, setActiveReactionId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isMyHistoryOpen, setIsMyHistoryOpen] = useState(false);

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Luana Castro",
      ml: 2850,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=32",
      reactions: [{ emoji: "❤️", count: 5 }],
      waterHistory: [],
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
      id: 4,
      nome: "Diego Santos",
      ml: 2200,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=33",
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

  // Ranking sempre atualizado com os dados vivos do App.js
  const rankingOrdenado = [...usuarios]
    .map((u) => (u.id === 1 ? { ...u, ml: mlConsumido, meta: meta } : u)) // Injeta meta e ml atuais
    .sort((a, b) => b.ml - a.ml);

  const selectedUser = usuarios.find((u) => u.id === selectedUserId) || null;
  const selectedPosition = selectedUser
    ? rankingOrdenado.findIndex((u) => u.id === selectedUserId) + 1
    : 1;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header
          onOpenMenu={() => setIsProfileOpen(true)}
          onOpenHistory={() => setIsMyHistoryOpen(true)}
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
          <View style={styles.rankingHeader}>
            <Text style={styles.rankingTitle}>💧 Ranking de Hidratação</Text>
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
                meta={item.meta} // Esta prop agora recebe o valor atualizado do modal
                foto={item.foto}
                reactions={item.reactions}
                activeReactionId={activeReactionId}
                onOpenReaction={setActiveReactionId}
                onPress={() => setSelectedUserId(item.id)}
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
          onSave={(newMeta) => setMeta(newMeta)} // Atualiza o estado global
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
          totalMl={mlConsumido}
          meta={meta}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F9FF" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  rankingHeader: { marginTop: 30, marginBottom: 20, paddingHorizontal: 4 },
  rankingTitle: { fontSize: 20, fontWeight: "900", color: "#2B5B8E" },
  rankingSubtitle: { fontSize: 13, color: "#7B8FA3", fontWeight: "500" },
  rankingWrapper: { width: "100%" },
});
