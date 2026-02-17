import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const WEEK_DATA = [
  { label: "Seg", ml: 2100 },
  { label: "Ter", ml: 1800 },
  { label: "Qua", ml: 2500 },
  { label: "Qui", ml: 2200 },
  { label: "Sex", ml: 2700 },
  { label: "Sáb", ml: 1500 },
  { label: "Dom", ml: 2850 },
];

const MONTH_DATA = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  ml: Math.floor(Math.random() * 1500) + 1200,
}));

interface StatsScreenProps {
  meta?: number;
}

export function StatsScreen({ meta = 2500 }: StatsScreenProps) {
  const [period, setPeriod] = useState<"semana" | "mes">("semana");
  const data = period === "semana" ? WEEK_DATA : MONTH_DATA;
  const maxMl = Math.max(...data.map((d) => d.ml), 1);

  const avgMl = Math.round(data.reduce((a, b) => a + b.ml, 0) / data.length);
  const bestDay = data.reduce((a, b) => (a.ml > b.ml ? a : b));
  const daysAboveGoal = data.filter((d) => d.ml >= meta).length;

  const statCards = [
    { label: "Média diária", value: `${avgMl}ml`, icon: "water", color: "#6096ba" },
    { label: "Melhor dia", value: `${bestDay.ml}ml`, icon: "trophy", color: "#FFD700" },
    { label: "Dias na meta", value: `${daysAboveGoal}`, icon: "checkmark-circle", color: "#10B981" },
    { label: "Sequência", value: "5 dias", icon: "flame", color: "#EF4444" },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.screenTitle}>Estatísticas</Text>
      <Text style={styles.screenSubtitle}>Acompanhe sua evolução 📈</Text>

      {/* Cards de resumo */}
      <View style={styles.statsGrid}>
        {statCards.map((card) => (
          <View key={card.label} style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: card.color + "20" }]}>
              <Ionicons name={card.icon as any} size={22} color={card.color} />
            </View>
            <Text style={styles.statValue}>{card.value}</Text>
            <Text style={styles.statLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      {/* Seletor de período */}
      <View style={styles.periodRow}>
        <TouchableOpacity
          style={[styles.periodBtn, period === "semana" && styles.periodBtnActive]}
          onPress={() => setPeriod("semana")}
        >
          <Text style={[styles.periodBtnText, period === "semana" && styles.periodBtnTextActive]}>
            7 dias
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodBtn, period === "mes" && styles.periodBtnActive]}
          onPress={() => setPeriod("mes")}
        >
          <Text style={[styles.periodBtnText, period === "mes" && styles.periodBtnTextActive]}>
            30 dias
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico de barras */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Consumo por dia</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chartBars}>
            {data.map((d, i) => {
              const barH = Math.max((d.ml / maxMl) * 100, d.ml > 0 ? 6 : 4);
              const isAboveGoal = d.ml >= meta;
              const isLast = i === data.length - 1;
              return (
                <View key={i} style={styles.chartCol}>
                  <Text style={[styles.chartMlLabel, isLast && styles.chartMlLabelToday]}>
                    {d.ml > 0 ? `${d.ml}` : ""}
                  </Text>
                  <View style={styles.chartBarBg}>
                    <View
                      style={[
                        styles.chartBarFill,
                        { height: `${barH}%` },
                        isAboveGoal && styles.chartBarGoal,
                        isLast && styles.chartBarToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.chartDayLabel, isLast && styles.chartDayLabelToday]}>
                    {d.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
        {/* Legenda */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#90CAF9" }]} />
            <Text style={styles.legendText}>Abaixo da meta</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
            <Text style={styles.legendText}>Meta atingida</Text>
          </View>
        </View>
      </View>

      {/* Card de meta */}
      <LinearGradient
        colors={["#6096ba", "#a3cef1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.goalCard}
      >
        <View style={styles.goalCardLeft}>
          <Text style={styles.goalCardLabel}>Sua meta diária</Text>
          <Text style={styles.goalCardValue}>{meta} ml</Text>
          <Text style={styles.goalCardSub}>Atingida em {daysAboveGoal} de {data.length} dias</Text>
        </View>
        <View style={styles.goalCircle}>
          <Text style={styles.goalCirclePct}>
            {Math.round((daysAboveGoal / data.length) * 100)}%
          </Text>
          <Text style={styles.goalCircleLabel}>taxa</Text>
        </View>
      </LinearGradient>

      {/* Conquista de streak */}
      <View style={styles.streakCard}>
        <View style={styles.streakIconWrapper}>
          <Ionicons name="flame" size={32} color="#EF4444" />
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakTitle}>🔥 Sequência atual</Text>
          <Text style={styles.streakDesc}>Você bebeu água por 5 dias seguidos!</Text>
        </View>
        <Text style={styles.streakDays}>5</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  screenTitle: { fontSize: 26, fontWeight: "900", color: "#274c77" },
  screenSubtitle: { fontSize: 13, color: "#8b8c89", fontWeight: "500", marginBottom: 20 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statIconBg: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  statValue: { fontSize: 22, fontWeight: "900", color: "#334155" },
  statLabel: { fontSize: 12, color: "#94A3B8", fontWeight: "600", marginTop: 2 },

  periodRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  periodBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  periodBtnActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  periodBtnText: { fontSize: 14, fontWeight: "600", color: "#94A3B8" },
  periodBtnTextActive: { color: "#274c77", fontWeight: "800" },

  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chartTitle: { fontSize: 15, fontWeight: "800", color: "#334155", marginBottom: 16 },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    gap: 4,
  },
  chartCol: {
    width: 36,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
  },
  chartMlLabel: { fontSize: 8, color: "#94A3B8", fontWeight: "700", marginBottom: 2 },
  chartMlLabelToday: { color: "#6096ba" },
  chartBarBg: {
    width: 28, flex: 1, justifyContent: "flex-end",
    backgroundColor: "#F1F5F9", borderRadius: 6, overflow: "hidden",
  },
  chartBarFill: { width: "100%", backgroundColor: "#90CAF9", borderRadius: 6 },
  chartBarGoal: { backgroundColor: "#10B981" },
  chartBarToday: { backgroundColor: "#6096ba" },
  chartDayLabel: { fontSize: 10, color: "#94A3B8", fontWeight: "600", marginTop: 6 },
  chartDayLabelToday: { color: "#6096ba", fontWeight: "800" },

  legendRow: { flexDirection: "row", gap: 16, marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: "#64748B" },

  goalCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalCardLeft: { flex: 1 },
  goalCardLabel: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: "600" },
  goalCardValue: { fontSize: 28, fontWeight: "900", color: "white", marginVertical: 4 },
  goalCardSub: { fontSize: 12, color: "rgba(255,255,255,0.75)" },
  goalCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center", alignItems: "center",
  },
  goalCirclePct: { fontSize: 22, fontWeight: "900", color: "white" },
  goalCircleLabel: { fontSize: 10, color: "rgba(255,255,255,0.8)" },

  streakCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 3,
    shadowColor: "#EF4444",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  streakIconWrapper: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#FEF2F2", justifyContent: "center", alignItems: "center",
  },
  streakInfo: { flex: 1 },
  streakTitle: { fontSize: 15, fontWeight: "bold", color: "#334155" },
  streakDesc: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  streakDays: { fontSize: 36, fontWeight: "900", color: "#EF4444" },
});
