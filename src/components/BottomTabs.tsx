import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function BottomTabs() {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="trophy" size={24} color="#2196F3" />
        <Text style={[styles.tabText, { color: "#2196F3" }]}>Ranking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="stats-chart-outline" size={24} color="#64748B" />
        <Text style={styles.tabText}>Metas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="person-outline" size={24} color="#64748B" />
        <Text style={styles.tabText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    height: 70, // Altura original mantida conforme solicitado
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
    // REMOVIDO: elevation e propriedades de shadow que causavam o erro visual
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
    color: "#64748B",
  },
});
