import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("window");
const SHEET_HEIGHT = screenHeight * 0.6;

interface WaterEntry {
  ml: number;
  time: string;
}

interface MyHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  waterHistory: WaterEntry[];
}

export function MyHistoryModal({
  visible,
  onClose,
  waterHistory,
}: MyHistoryModalProps) {
  const [showModal, setShowModal] = useState(visible);
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  // Ordenação: o mais recente primeiro
  const sortedHistory = [...waterHistory].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      closeModal();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  const formatHour = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!showModal) return null;

  return (
    <Modal transparent visible={showModal} animationType="none">
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* ÁREA DE ARRASTO: Apenas o cabeçalho captura o PanResponder */}
          <View {...panResponder.panHandlers} style={styles.dragArea}>
            <View style={styles.dragHandle} />
            <View style={styles.header}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={22} color="#14B8D4" />
                <Text style={styles.sectionTitle}>Meu Histórico de Hoje</Text>
              </View>
            </View>
          </View>

          {/* LISTA: Agora o ScrollView funciona sem interferência */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {sortedHistory.length > 0 ? (
              sortedHistory.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <Ionicons name="water" size={20} color="#14B8D4" />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyMl}>{item.ml} ml</Text>
                    <Text style={styles.historyTime}>
                      {formatHour(item.time)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Nenhum registro hoje.</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#F8FAFC",
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dragArea: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "#F8FAFC", // Garante que a área de toque seja clara
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#CBD5E1",
    borderRadius: 3,
    marginBottom: 15,
  },
  header: {
    width: "100%",
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2B5B8E" },
  scrollContent: { paddingBottom: 20, paddingTop: 5 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyMl: { fontSize: 16, fontWeight: "700", color: "#334155" },
  historyTime: { fontSize: 14, color: "#94A3B8" },
  emptyState: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#94A3B8", fontSize: 16 },
});
