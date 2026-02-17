import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export function BottomTabs() {
  return (
    <View style={styles.tabContainer}>
      {/* Home: Gota de água */}
      <TouchableOpacity style={styles.tabItem}>
        <MaterialCommunityIcons name="water" size={30} color="#2196F3" />
      </TouchableOpacity>

      {/* Grupos */}
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="people-outline" size={28} color="#64748B" />
      </TouchableOpacity>

      {/* Estatísticas */}
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="stats-chart-outline" size={26} color="#64748B" />
      </TouchableOpacity>

      {/* Perfil */}
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="person-outline" size={26} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    height: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "space-around",
    alignItems: "center",
    position: "relative",
  },
  topShadow: {
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    height: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#000",
    opacity: 0.05,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
