import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "./BottomSheetModal";

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

  const getWaterIcon = (quantidade: number) => {
    if (quantidade < 500)
      return (
        <MaterialCommunityIcons name="cup-water" size={24} color="#2196F3" />
      );
    if (quantidade < 1000)
      return (
        <MaterialCommunityIcons
          name="bottle-tonic-plus"
          size={24}
          color="#2196F3"
        />
      );
    return (
      <MaterialCommunityIcons name="bottle-wine" size={24} color="#2196F3" />
    );
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      height={0.6}
      backgroundColor="#F8FAFC"
    >
      <View style={styles.header}>
        <View style={styles.sectionHeader}>
          <Ionicons name="water" size={20} color="#2196F3" />
          <Text style={styles.sectionTitle}>Histórico de Hoje</Text>
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
      </ScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  header: { width: "100%", marginBottom: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#334155" },
  scrollContent: { paddingBottom: 60, paddingTop: 5 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyInfo: { flex: 1 },
  historyMl: { fontSize: 15, fontWeight: "bold", color: "#334155" },
  historyTime: { fontSize: 12, color: "#94A3B8" },
  historyAmount: { fontSize: 15, fontWeight: "900", color: "#2196F3" },
  emptyBox: { padding: 40, alignItems: "center" },
  emptyText: { color: "#94A3B8", fontSize: 14 },
});
