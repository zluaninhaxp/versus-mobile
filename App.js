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

// ---------------------------------------------------------------------------
// Helpers para gerar timestamps de exemplo
// ---------------------------------------------------------------------------
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
  const [nome, setNome] = useState("Luana Castro");
  const [meta, setMeta] = useState(2500);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWaterSettingsOpen, setIsWaterSettingsOpen] = useState(false);

  // ---- reação: só um dropdown aberto por vez ----
  const [activeReactionId, setActiveReactionId] = useState(null);

  // ---- modal de perfil de outro usuário ----
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ---- modal de histórico próprio ----
  const [isMyHistoryOpen, setIsMyHistoryOpen] = useState(false);

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "Luana Castro",
      ml: 2850,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=32",
      reactions: [
        { emoji: "❤️", count: 5 },
        { emoji: "👏", count: 3 },
        { emoji: "👍", count: 2 },
      ],
      waterHistory: [
        { ml: 500, time: daysAgoAt(5, 7, 30) },
        { ml: 750, time: daysAgoAt(5, 12, 0) },
        { ml: 500, time: daysAgoAt(4, 8, 15) },
        { ml: 1000, time: daysAgoAt(4, 13, 0) },
        { ml: 250, time: daysAgoAt(4, 18, 30) },
        { ml: 600, time: daysAgoAt(3, 7, 0) },
        { ml: 800, time: daysAgoAt(3, 12, 45) },
        { ml: 500, time: daysAgoAt(3, 19, 0) },
        { ml: 500, time: daysAgoAt(2, 6, 30) },
        { ml: 1000, time: daysAgoAt(2, 11, 50) },
        { ml: 400, time: daysAgoAt(2, 16, 20) },
        { ml: 750, time: yesterdayAt(7, 30) },
        { ml: 500, time: yesterdayAt(12, 0) },
        { ml: 1000, time: yesterdayAt(18, 15) },
        { ml: 500, time: todayAt(7, 0) },
        { ml: 250, time: todayAt(9, 30) },
        { ml: 1000, time: todayAt(12, 10) },
        { ml: 600, time: todayAt(15, 45) },
        { ml: 500, time: todayAt(17, 5) },
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
      waterHistory: [
        { ml: 500, time: daysAgoAt(4, 9, 0) },
        { ml: 750, time: daysAgoAt(4, 14, 30) },
        { ml: 600, time: daysAgoAt(3, 8, 0) },
        { ml: 500, time: daysAgoAt(3, 13, 15) },
        { ml: 800, time: daysAgoAt(2, 7, 45) },
        { ml: 500, time: daysAgoAt(2, 12, 0) },
        { ml: 500, time: yesterdayAt(8, 0) },
        { ml: 750, time: yesterdayAt(13, 0) },
        { ml: 500, time: yesterdayAt(18, 30) },
        { ml: 500, time: todayAt(7, 15) },
        { ml: 600, time: todayAt(11, 40) },
        { ml: 1000, time: todayAt(13, 50) },
        { ml: 500, time: todayAt(16, 0) },
      ],
    },
    {
      id: 3,
      nome: "Beatriz Costa",
      ml: 2400,
      meta: 2000,
      foto: "https://i.pravatar.cc/300?img=45",
      reactions: [{ emoji: "💖", count: 6 }],
      waterHistory: [
        { ml: 500, time: daysAgoAt(3, 10, 0) },
        { ml: 400, time: daysAgoAt(3, 15, 30) },
        { ml: 750, time: daysAgoAt(2, 7, 20) },
        { ml: 500, time: daysAgoAt(2, 14, 0) },
        { ml: 250, time: yesterdayAt(6, 45) },
        { ml: 500, time: yesterdayAt(12, 20) },
        { ml: 750, time: yesterdayAt(19, 0) },
        { ml: 500, time: todayAt(8, 10) },
        { ml: 400, time: todayAt(10, 55) },
        { ml: 1000, time: todayAt(13, 0) },
        { ml: 250, time: todayAt(15, 30) },
        { ml: 250, time: todayAt(18, 0) },
      ],
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
      waterHistory: [
        { ml: 500, time: daysAgoAt(2, 9, 0) },
        { ml: 500, time: daysAgoAt(2, 14, 30) },
        { ml: 500, time: yesterdayAt(9, 0) },
        { ml: 500, time: yesterdayAt(14, 30) },
        { ml: 500, time: todayAt(7, 45) },
        { ml: 700, time: todayAt(12, 0) },
        { ml: 500, time: todayAt(16, 10) },
        { ml: 500, time: todayAt(19, 30) },
      ],
    },
    {
      id: 5,
      nome: "Mariana Lima",
      ml: 2100,
      meta: 2000,
      foto: "https://i.pravatar.cc/300?img=28",
      reactions: [{ emoji: "🔥", count: 3 }],
      waterHistory: [
        { ml: 300, time: daysAgoAt(3, 7, 20) },
        { ml: 500, time: daysAgoAt(3, 11, 50) },
        { ml: 500, time: daysAgoAt(2, 8, 0) },
        { ml: 750, time: daysAgoAt(2, 14, 30) },
        { ml: 300, time: yesterdayAt(7, 20) },
        { ml: 500, time: yesterdayAt(11, 50) },
        { ml: 500, time: yesterdayAt(18, 0) },
        { ml: 500, time: todayAt(8, 0) },
        { ml: 800, time: todayAt(12, 30) },
        { ml: 500, time: todayAt(17, 45) },
        { ml: 300, time: todayAt(20, 0) },
      ],
    },
    {
      id: 6,
      nome: "Rafael Sousa",
      ml: 1700,
      meta: 2500,
      foto: "https://i.pravatar.cc/300?img=15",
      reactions: [],
      waterHistory: [
        { ml: 500, time: daysAgoAt(2, 10, 0) },
        { ml: 250, time: daysAgoAt(2, 16, 0) },
        { ml: 500, time: yesterdayAt(10, 0) },
        { ml: 250, time: yesterdayAt(16, 0) },
        { ml: 500, time: todayAt(7, 30) },
        { ml: 450, time: todayAt(13, 15) },
        { ml: 750, time: todayAt(18, 0) },
      ],
    },
  ]);

  // ---- reações ----
  const handleAddReaction = (userId, emoji) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const reactions = [...u.reactions];
          const existing = reactions.find((r) => r.emoji === emoji);
          if (existing) existing.count += 1;
          else reactions.push({ emoji, count: 1 });
          return { ...u, reactions };
        }
        return u;
      }),
    );
  };

  // ---- adicionar água (usuário próprio, id 1) ----
  const handleAddWater = (quantidade) => {
    const novoMl = mlConsumido + quantidade;
    setMlConsumido(novoMl);
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === 1) {
          return {
            ...u,
            ml: novoMl,
            waterHistory: [
              ...u.waterHistory,
              { ml: quantidade, time: new Date().toISOString() },
            ],
          };
        }
        return u;
      }),
    );
  };

  // ---- ranking ordenado (recomputa a cada render) ----
  const rankingOrdenado = [...usuarios].sort((a, b) => b.ml - a.ml);

  // ---- dados do usuário selecionado para o modal de perfil ----
  const selectedUser = usuarios.find((u) => u.id === selectedUserId) || null;
  const selectedPosition = selectedUser
    ? rankingOrdenado.findIndex((u) => u.id === selectedUserId) + 1
    : 1;

  // ---- dados do próprio usuário para MyHistoryModal ----
  const myUser = usuarios.find((u) => u.id === 1);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header
          onOpenMenu={() => setIsProfileOpen(true)}
          onOpenHistory={() => setIsMyHistoryOpen(true)} // Nova prop adicionada
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
            onOpenMyHistory={() => setIsMyHistoryOpen(true)}
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

        {/* ---- Drawers / Modais ---- */}
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

        {/* Modal de perfil de outro usuário no ranking */}
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

        {/* Modal de histórico próprio */}
        <MyHistoryModal
          visible={isMyHistoryOpen}
          onClose={() => setIsMyHistoryOpen(false)}
          waterHistory={myUser?.waterHistory || []}
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
  rankingTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2B5B8E",
    marginBottom: 4,
  },
  rankingSubtitle: { fontSize: 13, color: "#7B8FA3", fontWeight: "500" },
  rankingWrapper: { width: "100%" },
});
