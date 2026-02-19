import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

const FILTROS = [
  { id: "todos", label: "Todos os amigos", icon: "people" },
  { id: "familia", label: "Família Castro", icon: "home" },
  { id: "trabalho", label: "Turma do Trabalho", icon: "briefcase" },
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
  const [usuarios] = useState(INITIAL_USUARIOS);
  const [isWaterSettingsOpen, setIsWaterSettingsOpen] = useState(false);
  const [isMyHistoryOpen, setIsMyHistoryOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 20 });
  const chipRef = useRef<View>(null);

  // Encontra o objeto do filtro atual para pegar o label
  const filtroAtual = FILTROS.find((f) => f.id === filtroAtivo)!;

  const openDropdown = () => {
    chipRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownPos({
        top: pageY + height, // Removido o espaço para colar no botão
        right: 20,
      });
      setDropdownOpen(true);
    });
  };

  const rankingBase = usuarios.map((u) =>
    u.id === 1 ? { ...u, ml: mlConsumido, meta } : u,
  );

  const rankingFiltrado = (
    filtroAtivo === "todos"
      ? rankingBase
      : rankingBase.filter((u) => u.grupos.includes(filtroAtivo))
  ).sort((a, b) => b.ml - a.ml);

  const selectedUser = usuarios.find((u) => u.id === selectedUserId) ?? null;
  const selectedPosition = selectedUser
    ? rankingFiltrado.findIndex((u) => u.id === selectedUserId) + 1
    : 1;

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={st.scroll}
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

        <View style={st.rankingHeader}>
          <View style={st.rankingLeft}>
            <Text style={st.rankingTitle}>Ranking de Hidratação</Text>
            <Text style={st.rankingSubtitle}>
              Reaja e incentive seus amigos!
            </Text>
          </View>

          {/* O Texto do botão é dinâmico baseado no filtroAtual */}
          <View ref={chipRef} collapsable={false}>
            <TouchableOpacity
              style={st.filterChip}
              onPress={openDropdown}
              activeOpacity={0.75}
            >
              <Text style={st.filterChipText} numberOfLines={1}>
                {filtroAtual.label}
              </Text>
              <Ionicons name="chevron-down" size={13} color="#6096ba" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={st.rankingWrapper}>
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

      {/* Dropdown dinâmico sem ícones */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="none"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownOpen(false)}>
          <View style={st.dropOverlay}>
            <View
              style={[
                st.dropCard,
                { top: dropdownPos.top, right: dropdownPos.right },
              ]}
            >
              <Text style={st.dropTitle}>FILTRAR GRUPO</Text>
              {FILTROS.map((f) => {
                const ativo = filtroAtivo === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[st.dropItem, ativo && st.dropItemAtivo]}
                    onPress={() => {
                      setFiltroAtivo(f.id); // Altera o estado, que muda o texto do botão
                      setDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[st.dropItemText, ativo && st.dropItemTextAtivo]}
                    >
                      {f.label}
                    </Text>
                    {ativo && (
                      <Ionicons name="checkmark" size={16} color="#6096ba" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── Modais ── */}
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

const st = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  rankingHeader: {
    marginTop: 30,
    marginBottom: 16,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  rankingLeft: { flex: 1 },
  rankingTitle: { fontSize: 20, fontWeight: "900", color: "#274c77" },
  rankingSubtitle: {
    fontSize: 13,
    color: "#8b8c89",
    fontWeight: "500",
    marginTop: 2,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EBF4FF",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    minWidth: 120, // Garante que o texto apareça bem
    maxWidth: 180,
    marginTop: 2,
  },
  filterChipText: { fontSize: 12, fontWeight: "700", color: "#6096ba" },
  rankingWrapper: { width: "100%" },

  dropOverlay: { flex: 1, backgroundColor: "transparent" },
  dropCard: {
    position: "absolute",
    width: 190,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 6,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dropTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#CBD5E1",
    letterSpacing: 1,
    marginBottom: 4,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  dropItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropItemAtivo: { backgroundColor: "#F1F5F9" },
  dropItemText: { fontSize: 14, fontWeight: "600", color: "#475569" },
  dropItemTextAtivo: { color: "#274c77", fontWeight: "800" },
});
