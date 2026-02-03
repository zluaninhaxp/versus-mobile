import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  Animated,
  Easing,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("screen");
const SHEET_HEIGHT = screenHeight * 0.75;

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
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }).start();
    } else {
      closeModal();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  // Padronização de ícones com AddWaterModal
  const getWaterIcon = (quantidade: number) => {
    if (quantidade < 500)
      return (
        <MaterialCommunityIcons name="cup-water" size={24} color="#4CAFFF" />
      );
    if (quantidade < 1000)
      return (
        <MaterialCommunityIcons
          name="bottle-tonic-plus"
          size={24}
          color="#4CAFFF"
        />
      );
    return (
      <MaterialCommunityIcons name="bottle-wine" size={24} color="#4CAFFF" />
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) slideAnim.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    }),
  ).current;

  if (!showModal) return null;

  const porcentagem = Math.min((ml / meta) * 100, 100);
  const metaAlcancada = ml >= meta;

  const medalColor =
    position === 1
      ? "#FFD700"
      : position === 2
        ? "#C0C0C0"
        : position === 3
          ? "#CD7F32"
          : "#6B7D8F";
  const medalEmoji =
    position === 1
      ? "🥇"
      : position === 2
        ? "🥈"
        : position === 3
          ? "🥉"
          : `${position}º`;

  const today = new Date();
  // Filtra histórico de hoje e ordena do mais recente para o mais antigo
  const todayHistory = waterHistory
    .filter((e) => {
      const d = new Date(e.time);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  // Dados para o gráfico semanal
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

  return (
    <Modal
      transparent
      visible={showModal}
      onRequestClose={closeModal}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <View
            {...panResponder.panHandlers}
            style={styles.invisibleDragShield}
          />
          <View style={styles.handle} />

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
                <View
                  style={[styles.medalBadge, { backgroundColor: medalColor }]}
                >
                  <Text style={styles.medalText}>{medalEmoji}</Text>
                </View>
              </View>
              <Text style={styles.profileName}>{nome}</Text>
              <View style={styles.statsRow}>
                <Text
                  style={[
                    styles.statValue,
                    metaAlcancada && styles.statValueGold,
                  ]}
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
              <Ionicons name="bar-chart" size={18} color="#14B8D4" />
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

            {/* HISTÓRICO DE HOJE (ORDENADO) */}
            <View style={styles.sectionHeader}>
              <Ionicons name="water" size={18} color="#14B8D4" />
              <Text style={styles.sectionTitle}>Hoje</Text>
            </View>
            {todayHistory.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhum registro hoje.</Text>
              </View>
            ) : (
              todayHistory.map((entry, i) => (
                <View key={i} style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    {getWaterIcon(entry.ml)}
                  </View>
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

            {/* CONQUISTAS */}
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

          {/* FIX: Sangria para cobrir o bounce no fundo */}
          <View style={styles.bottomFill} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#F5F9FF",
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  invisibleDragShield: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "transparent",
    zIndex: 9999,
  },
  bottomFill: {
    position: "absolute",
    bottom: -100,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#F5F9FF",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D5DDE5",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 60 },
  profileCard: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 22,
    padding: 24,
    marginTop: 8,
    marginBottom: 20,
    elevation: 3,
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
    color: "#2B5B8E",
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 8,
  },
  statValue: { fontSize: 28, fontWeight: "900", color: "#14B8D4" },
  statValueGold: { color: "#DAA520" },
  statSep: { fontSize: 18, color: "#D0D8E0", fontWeight: "600" },
  statMeta: { fontSize: 18, color: "#9BA8B5", fontWeight: "600" },
  metaAchievedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
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
    backgroundColor: "#EBF4FF",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#14B8D4", borderRadius: 6 },
  progressFillGold: { backgroundColor: "#FFD700" },
  progressLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9BA8B5",
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
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#2B5B8E" },
  chartCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
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
    color: "#9BA8B5",
    fontWeight: "700",
    marginBottom: 2,
  },
  chartMlLabelToday: { color: "#14B8D4" },
  chartBarBg: {
    width: 28,
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#F0F4F8",
    borderRadius: 6,
    overflow: "hidden",
  },
  chartBarFill: { width: "100%", backgroundColor: "#C8E6F5", borderRadius: 6 },
  chartBarToday: { backgroundColor: "#14B8D4" },
  chartDayLabel: {
    fontSize: 11,
    color: "#9BA8B5",
    fontWeight: "600",
    marginTop: 6,
  },
  chartDayLabelToday: { color: "#14B8D4", fontWeight: "800" },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EBF7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyInfo: { flex: 1 },
  historyMl: { fontSize: 15, fontWeight: "bold", color: "#2B3E50" },
  historyTime: { fontSize: 12, color: "#9BA8B5" },
  historyAmount: { fontSize: 15, fontWeight: "900", color: "#14B8D4" },
  emptyBox: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: { color: "#9BA8B5", fontSize: 14 },
  conquistaPlaceholder: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 36,
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E0E6EC",
  },
  conquistaText: {
    color: "#9BA8B5",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
