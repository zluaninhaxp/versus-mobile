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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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

  // Filtragem e ordenação para mostrar apenas registros de hoje
  const today = new Date();
  const todayHistory = waterHistory.filter((entry) => {
    const entryDate = new Date(entry.time);
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    );
  });

  const sortedHistory = [...todayHistory].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );

  // Ícones padronizados
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

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    } else {
      handleClose();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleClose();
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

  if (!showModal) return null;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <Modal
      transparent
      visible={showModal}
      onRequestClose={handleClose}
      animationType="none"
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          {/* Área de arraste focada no cabeçalho */}
          <View {...panResponder.panHandlers} style={styles.dragArea}>
            <View style={styles.dragHandle} />
            <View style={styles.header}>
              <View style={styles.sectionHeader}>
                <Ionicons name="water" size={20} color="#14B8D4" />
                <Text style={styles.sectionTitle}>Histórico de Hoje</Text>
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {sortedHistory.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhum registro hoje.</Text>
              </View>
            ) : (
              sortedHistory.map((entry, i) => (
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
          </ScrollView>

          {/* Preenchimento extra para cobrir o bounce */}
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#F8FAFC",
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    elevation: 20,
  },
  bottomFill: {
    position: "absolute",
    bottom: -100,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#F8FAFC",
  },
  dragArea: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#CBD5E1",
    borderRadius: 3,
    marginBottom: 15,
  },
  header: { width: "100%", marginBottom: 5 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#2B5B8E" },
  scrollContent: { paddingBottom: 60, paddingTop: 5 },
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
  emptyBox: { padding: 40, alignItems: "center" },
  emptyText: { color: "#9BA8B5", fontSize: 14 },
});
