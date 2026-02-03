import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("screen");

interface WaterEntry {
  ml: number;
  time: string; // ISO string
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
  const [showModal, setShowModal] = React.useState(visible);

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
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => setShowModal(false));
    }
  }, [visible]);

  if (!showModal) return null;

  const porcentagem = Math.min((ml / meta) * 100, 100);
  const metaAlcancada = ml >= meta;

  /* ---- cor da medalha por posição ---- */
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

  /* ---- formatar timestamp para exibição ---- */
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    )
      return "Hoje";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth()
    )
      return "Ontem";
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  /* ---- agrupa histórico por data ---- */
  const groupedHistory: { [key: string]: WaterEntry[] } = {};
  waterHistory.forEach((entry) => {
    const key = formatDate(entry.time);
    if (!groupedHistory[key]) groupedHistory[key] = [];
    groupedHistory[key].push(entry);
  });

  /* ---- ícone por quantidade ---- */
  const getWaterIcon = (quantidade: number) => {
    if (quantidade < 300) return "🥤";
    if (quantidade < 600) return "🥛";
    return "🍶";
  };

  return (
    <Modal
      transparent
      visible={showModal}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent={true}
    >
      {/* Overlay escuro */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Sheet que desliza de baixo */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Alça de arraste (indicador visual) */}
        <View style={styles.handle} />

        {/* Botão fechar */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={26} color="#6B7D8F" />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ---- SEÇÃO DO PERFIL ---- */}
          <View style={styles.profileCard}>
            {/* Foto + medalha */}
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

            {/* ml / meta */}
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

            {/* Barra de progresso */}
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

          {/* ---- HISTÓRICO DE ÁGUA ---- */}
          <View style={styles.sectionHeader}>
            <Ionicons name="water" size={18} color="#14B8D4" />
            <Text style={styles.sectionTitle}>Histórico de Água</Text>
          </View>

          {waterHistory.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Nenhum registro ainda hoje.</Text>
            </View>
          ) : (
            Object.keys(groupedHistory).map((dateLabel) => (
              <View key={dateLabel}>
                {/* Separador de data */}
                <Text style={styles.dateLabel}>{dateLabel}</Text>

                {groupedHistory[dateLabel].map((entry, i) => (
                  <View key={i} style={styles.historyItem}>
                    <View style={styles.historyIcon}>
                      <Text style={styles.historyIconEmoji}>
                        {getWaterIcon(entry.ml)}
                      </Text>
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyMl}>{entry.ml} ml</Text>
                      <Text style={styles.historyTime}>
                        Registrado às {formatTime(entry.time)}
                      </Text>
                    </View>
                    <Text style={styles.historyAmount}>+{entry.ml}</Text>
                  </View>
                ))}
              </View>
            ))
          )}

          {/* ---- CONQUISTAS (placeholder) ---- */}
          <View style={styles.sectionHeader}>
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
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /* overlay */
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  /* sheet */
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight * 0.88,
    backgroundColor: "#F5F9FF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
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
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 2,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },

  /* ---- perfil ---- */
  profileCard: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 22,
    padding: 24,
    marginTop: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 14,
  },
  medalRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
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
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#14B8D4",
  },
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
  progressFill: {
    height: "100%",
    backgroundColor: "#14B8D4",
    borderRadius: 6,
  },
  progressFillGold: { backgroundColor: "#FFD700" },
  progressLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9BA8B5",
    marginTop: 6,
    letterSpacing: 0.5,
  },
  progressLabelGold: { color: "#DAA520" },

  /* ---- seção ---- */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2B5B8E",
  },

  /* ---- histórico ---- */
  dateLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9BA8B5",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
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
  historyAmount: {
    fontSize: 15,
    fontWeight: "900",
    color: "#14B8D4",
  },

  emptyBox: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 28,
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: { color: "#9BA8B5", fontSize: 14 },

  /* ---- conquistas placeholder ---- */
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
