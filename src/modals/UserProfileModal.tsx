import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "../components/BottomSheetModal";

interface WaterEntry {
  ml: number;
  time: string;
}

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  nome: string;
  foto?: string;
  ml: number;
  meta: number;
  position: number;
  waterHistory: WaterEntry[];
}

export function UserProfileModal({
  visible,
  onClose,
  nome,
  foto,
  ml,
  meta,
  position,
  waterHistory,
}: UserProfileModalProps) {
  const porcentagem = Math.min((ml / meta) * 100, 100);
  const metaAlcancada = ml >= meta;

  const medalColor =
    position === 1
      ? "#FFD700"
      : position === 2
        ? "#C0C0C0"
        : position === 3
          ? "#CD7F32"
          : "#64748B";
  const medalEmoji =
    position === 1
      ? "🥇"
      : position === 2
        ? "🥈"
        : position === 3
          ? "🥉"
          : `${position}º`;

  const today = new Date();
  const todayHistory = waterHistory.filter((e) => {
    const d = new Date(e.time);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const weekData: { label: string; ml: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayMl = waterHistory.reduce((acc, e) => {
      const d = new Date(e.time);
      return d.getDate() === day.getDate() &&
        d.getMonth() === day.getMonth() &&
        d.getFullYear() === day.getFullYear()
        ? acc + e.ml
        : acc;
    }, 0);
    const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    weekData.push({ label: labels[day.getDay()], ml: dayMl });
  }
  const maxMl = Math.max(...weekData.map((d) => d.ml), 1);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const getWaterIcon = (quantidade: number) => {
    if (quantidade < 500)
      return (
        <MaterialCommunityIcons name="cup-water" size={20} color="#2196F3" />
      );
    if (quantidade < 1000)
      return (
        <MaterialCommunityIcons
          name="bottle-tonic-plus"
          size={20}
          color="#2196F3"
        />
      );
    return (
      <MaterialCommunityIcons name="bottle-wine" size={20} color="#2196F3" />
    );
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      height={0.88}
      backgroundColor="#F8FAFC"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PERFIL */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.medalRing, { borderColor: medalColor }]}>
              <Image
                source={{ uri: foto || "https://i.pravatar.cc/150" }}
                style={styles.avatar}
              />
            </View>
            <View style={[styles.medalBadge, { backgroundColor: medalColor }]}>
              <Text style={styles.medalText}>{medalEmoji}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{nome}</Text>
          <View style={styles.statsRow}>
            <Text
              style={[styles.statValue, metaAlcancada && styles.statValueGold]}
            >
              {ml} ml
            </Text>
            <Text style={styles.statSep}>/</Text>
            <Text style={styles.statMeta}>{meta} ml</Text>
          </View>
          {metaAlcancada && (
            <View style={styles.metaAchievedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="white" />
              <Text style={styles.metaAchievedText}>Meta alcançada!</Text>
            </View>
          )}
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${porcentagem}%` },
                metaAlcancada && styles.progressFillGold,
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressLabel,
              metaAlcancada && styles.progressLabelGold,
            ]}
          >
            {Math.round(porcentagem)}% concluído
          </Text>
        </View>

        {/* GRÁFICO SEMANAL */}
        <View style={styles.sectionHeader}>
          <Ionicons name="bar-chart" size={18} color="#2196F3" />
          <Text style={styles.sectionTitle}>Última semana</Text>
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartBars}>
            {weekData.map((d, i) => {
              const isToday = i === 6;
              const barH = Math.max((d.ml / maxMl) * 100, d.ml > 0 ? 8 : 4);
              return (
                <View key={i} style={styles.chartCol}>
                  <Text
                    style={[
                      styles.chartMlLabel,
                      isToday && styles.chartMlLabelToday,
                    ]}
                  >
                    {d.ml > 0 ? `${d.ml}` : ""}
                  </Text>
                  <View style={styles.chartBarBg}>
                    <View
                      style={[
                        styles.chartBarFill,
                        { height: `${barH}%` },
                        isToday && styles.chartBarToday,
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.chartDayLabel,
                      isToday && styles.chartDayLabelToday,
                    ]}
                  >
                    {d.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* HISTÓRICO DE HOJE */}
        <View style={styles.sectionHeader}>
          <Ionicons name="water" size={18} color="#2196F3" />
          <Text style={styles.sectionTitle}>Hoje</Text>
        </View>
        {todayHistory.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhum registro hoje.</Text>
          </View>
        ) : (
          todayHistory.map((entry, i) => (
            <View key={i} style={styles.historyItem}>
              <View style={styles.historyIcon}>{getWaterIcon(entry.ml)}</View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyMl}>{entry.ml} ml</Text>
                <Text style={styles.historyTime}>
                  Registrado às {formatTime(entry.time)}
                </Text>
              </View>
              <Text style={styles.historyAmount}>+{entry.ml}</Text>
            </View>
          ))
        )}

        {/* CONQUISTAS placeholder */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Ionicons name="trophy" size={18} color="#FFD700" />
          <Text style={styles.sectionTitle}>Conquistas</Text>
        </View>
        <View style={styles.conquistaPlaceholder}>
          <Ionicons name="trophy-outline" size={40} color="#E0E6EC" />
          <Text style={styles.conquistaText}>
            Conquistas serão implementadas em breve!
          </Text>
        </View>
      </ScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    marginTop: 8,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  medalRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  medalBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  medalText: { fontSize: 16 },
  profileName: {
    fontSize: 21,
    fontWeight: "900",
    color: "#334155",
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 8,
  },
  statValue: { fontSize: 28, fontWeight: "900", color: "#2196F3" },
  statValueGold: { color: "#DAA520" },
  statSep: { fontSize: 18, color: "#CBD5E1", fontWeight: "600" },
  statMeta: { fontSize: 18, color: "#94A3B8", fontWeight: "600" },
  metaAchievedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 5,
    marginBottom: 12,
  },
  metaAchievedText: { color: "white", fontSize: 13, fontWeight: "bold" },
  progressBg: {
    width: "100%",
    height: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 6,
  },
  progressFillGold: { backgroundColor: "#FFD700" },
  progressLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94A3B8",
    marginTop: 6,
    letterSpacing: 0.5,
  },
  progressLabelGold: { color: "#DAA520" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#334155" },

  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 110,
  },
  chartCol: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
  },
  chartMlLabel: {
    fontSize: 9,
    color: "#94A3B8",
    fontWeight: "700",
    marginBottom: 2,
  },
  chartMlLabelToday: { color: "#2196F3" },
  chartBarBg: {
    width: 28,
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    overflow: "hidden",
  },
  chartBarFill: {
    width: "100%",
    backgroundColor: "#90CAF9",
    borderRadius: 6,
  },
  chartBarToday: { backgroundColor: "#2196F3" },
  chartDayLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    marginTop: 6,
  },
  chartDayLabelToday: { color: "#2196F3", fontWeight: "800" },

  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyInfo: { flex: 1 },
  historyMl: { fontSize: 15, fontWeight: "bold", color: "#334155" },
  historyTime: { fontSize: 12, color: "#94A3B8" },
  historyAmount: { fontSize: 15, fontWeight: "900", color: "#2196F3" },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyText: { color: "#94A3B8", fontSize: 14 },

  conquistaPlaceholder: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 36,
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E0E6EC",
  },
  conquistaText: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
