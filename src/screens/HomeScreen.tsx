import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Header } from "../components/Header";
import { UserStatus } from "../components/UserStatus";
import { RankItem } from "../components/RankItem";
import { WaterSettingsModal } from "../modals/WaterSettingsModal";
import { UserProfileModal } from "../modals/UserProfileModal";
import { MyHistoryModal } from "../modals/MyHistoryModal";

function todayAt(h: number, m: number) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

// Todos os usuários do "universo" (amigos + grupos)
const INITIAL_USUARIOS = [
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
    grupos: ["familia", "trabalho"],
  },
  {
    id: 2,
    nome: "Carlos Mendes",
    ml: 2600,
    meta: 2500,
    foto: "https://i.pravatar.cc/300?img=12",
    reactions: [],
    waterHistory: [],
    grupos: ["familia"],
  },
  {
    id: 3,
    nome: "Beatriz Costa",
    ml: 2400,
    meta: 2000,
    foto: "https://i.pravatar.cc/300?img=45",
    reactions: [],
    waterHistory: [],
    grupos: ["familia"],
  },
  {
    id: 5,
    nome: "Mariana Lima",
    ml: 2100,
    meta: 2000,
    foto: "https://i.pravatar.cc/300?img=28",
    reactions: [],
    waterHistory: [],
    grupos: ["trabalho"],
  },
  {
    id: 6,
    nome: "Rafael Sousa",
    ml: 1700,
    meta: 2500,
    foto: "https://i.pravatar.cc/300?img=15",
    reactions: [],
    waterHistory: [],
    grupos: ["trabalho"],
  },
];

// Filtros disponíveis
const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "familia", label: "Família Castro" },
  { id: "trabalho", label: "Turma do Trabalho" },
];

interface HomeScreenProps {
  mlConsumido: number;
  meta: number;
  onAddWater: (quantidade: number) => void;
  onMetaChange: (newMeta: number) => void;
}

export function HomeScreen({
  mlConsumido,
  meta,
  onAddWater,
  onMetaChange,
}: HomeScreenProps) {
  const nome = "Luana Castro";

  const [usuarios, setUsuarios] = useState(INITIAL_USUARIOS);
  const [isWaterSettingsOpen, setIsWaterSettingsOpen] = useState(false);
  const [isMyHistoryOpen, setIsMyHistoryOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  const rankingBase = [...usuarios].map((u) =>
    u.id === 1 ? { ...u, ml: mlConsumido, meta } : u,
  );

  const rankingFiltrado = (
    filtroAtivo === "todos"
      ? rankingBase
      : rankingBase.filter((u) => u.grupos.includes(filtroAtivo))
  ).sort((a, b) => b.ml - a.ml);

  const selectedUser = usuarios.find((u) => u.id === selectedUserId) || null;
  const selectedPosition = selectedUser
    ? rankingFiltrado.findIndex((u) => u.id === selectedUserId) + 1
    : 1;

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          onOpenMenu={() => {}}
          onOpenHistory={() => setIsMyHistoryOpen(true)}
          onOpenSettings={() => setIsWaterSettingsOpen(true)}
        />

        <UserStatus
          userName={nome}
          ml={mlConsumido}
          meta={meta}
          onAdd={onAddWater}
        />

        <View style={styles.rankingHeader}>
          <Text style={styles.rankingTitle}>Ranking de Hidratação</Text>
          <Text style={styles.rankingSubtitle}>
            Reaja e incentive seus amigos!
          </Text>
        </View>

        {/* Filtro de grupo — pills horizontais */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtroRow}
        >
          {FILTROS.map((f) => {
            const ativo = filtroAtivo === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filtroPill, ativo && styles.filtroPillAtivo]}
                onPress={() => setFiltroAtivo(f.id)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filtroPillText,
                    ativo && styles.filtroPillTextAtivo,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.rankingWrapper}>
          {rankingFiltrado.map((item, index) => (
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

      <WaterSettingsModal
        visible={isWaterSettingsOpen}
        onClose={() => setIsWaterSettingsOpen(false)}
        currentMeta={meta}
        onSave={(newMeta) => {
          onMetaChange(newMeta);
          setIsWaterSettingsOpen(false);
        }}
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
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rankingHeader: {
    marginTop: 30,
    marginBottom: 12,
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
  // Pills de filtro de grupo
  filtroRow: {
    gap: 8,
    paddingBottom: 16,
    paddingTop: 2,
    paddingRight: 4,
  },
  filtroPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#EBF4FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
  },
  filtroPillAtivo: {
    backgroundColor: "#6096ba",
    borderColor: "#6096ba",
  },
  filtroPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6096ba",
  },
  filtroPillTextAtivo: {
    color: "white",
  },
  rankingWrapper: {
    width: "100%",
  },
});
