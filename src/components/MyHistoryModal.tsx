import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  Easing,
  PanResponder,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("screen");
const SHEET_HEIGHT = screenHeight * 0.6;
const DRAG_THRESHOLD = 50;

interface WaterEntry {
  ml: number;
  time: string;
}

interface MyHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  waterHistory: WaterEntry[];
  totalMl: number;
  meta: number;
}

export function MyHistoryModal({
  visible,
  onClose,
  waterHistory,
  totalMl,
  meta,
}: MyHistoryModalProps) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const dragOffset = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      dragOffset.setValue(0);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 280,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => setShowModal(false));
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, g) => g.dy > 0,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) dragOffset.setValue(g.dy);
      },
      onPanResponderReleaseOrTerminate: (_, g) => {
        if (g.dy > DRAG_THRESHOLD) {
          onClose();
        } else {
          Animated.spring(dragOffset, {
            toValue: 0,
            useNativeDriver: true,
            tension: 60,
            friction: 10,
          }).start();
        }
      },
    }),
  ).current;

  if (!showModal) return null;

  const today = new Date();
  const todayHistory = waterHistory.filter((e) => {
    const d = new Date(e.time);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  const porcentagem = Math.min((totalMl / meta) * 100, 100);
  const metaAlcancada = totalMl >= meta;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };
  const getWaterIcon = (q: number) => (q < 300 ? "🥤" : q < 600 ? "🥛" : "🍶");

  return (
    <Modal
      transparent
      visible={showModal}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay} />
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: Animated.add(slideAnim, dragOffset) }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.miniStats}>
            <Text style={[styles.miniMl, metaAlcancada && styles.miniMlGold]}>
              {totalMl} ml
            </Text>
            <Text style={styles.miniMeta}> / {meta} ml</Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${porcentagem}%` },
                metaAlcancada && styles.progressFillGold,
              ]}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Ionicons name="water" size={18} color="#14B8D4" />
            <Text style={styles.sectionTitle}>Seu histórico de hoje</Text>
          </View>

          {todayHistory.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="water-outline" size={36} color="#D5E8F0" />
              <Text style={styles.emptyText}>Nada registrado ainda hoje.</Text>
              <Text style={styles.emptyHint}>
                Toque no botão + para adicionar!
              </Text>
            </View>
          ) : (
            todayHistory.map((entry, i) => (
              <View key={i} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Text style={styles.historyIconEmoji}>
                    {getWaterIcon(entry.ml)}
                  </Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyMl}>{entry.ml} ml</Text>
                  <Text style={styles.historyTime}>
                    às {formatTime(entry.time)}
                  </Text>
                </View>
                <Text style={styles.historyAmount}>+{entry.ml}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "#F5F9FF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D5DDE5",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 30 },

  miniStats: { flexDirection: "row", alignItems: "baseline", marginBottom: 8 },
  miniMl: { fontSize: 26, fontWeight: "900", color: "#14B8D4" },
  miniMlGold: { color: "#DAA520" },
  miniMeta: { fontSize: 15, color: "#9BA8B5", fontWeight: "600" },
  progressBg: {
    height: 10,
    backgroundColor: "#EBF4FF",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 18,
  },
  progressFill: { height: "100%", backgroundColor: "#14B8D4", borderRadius: 5 },
  progressFillGold: { backgroundColor: "#FFD700" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#2B5B8E" },

  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
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
  historyIconEmoji: { fontSize: 20 },
  historyInfo: { flex: 1 },
  historyMl: { fontSize: 15, fontWeight: "bold", color: "#2B3E50" },
  historyTime: { fontSize: 12, color: "#9BA8B5" },
  historyAmount: { fontSize: 15, fontWeight: "900", color: "#14B8D4" },

  emptyBox: { alignItems: "center", paddingVertical: 40 },
  emptyText: { color: "#9BA8B5", fontSize: 15, marginTop: 10 },
  emptyHint: { color: "#C5CDD4", fontSize: 13, marginTop: 4 },
});
