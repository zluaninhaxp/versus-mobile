import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export type TabName = "home" | "groups" | "stats" | "profile";

interface BottomTabsProps {
  activeTab: TabName;
  onChangeTab: (tab: TabName) => void;
}

export function BottomTabs({ activeTab, onChangeTab }: BottomTabsProps) {
  return (
    <View style={styles.tabContainer}>
      {/* Home: Gota de água */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onChangeTab("home")}
      >
        <MaterialCommunityIcons
          name="water"
          size={30}
          color={activeTab === "home" ? "#2196F3" : "#64748B"}
        />
      </TouchableOpacity>

      {/* Grupos */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onChangeTab("groups")}
      >
        <Ionicons
          name={activeTab === "groups" ? "people" : "people-outline"}
          size={28}
          color={activeTab === "groups" ? "#2196F3" : "#64748B"}
        />
      </TouchableOpacity>

      {/* Estatísticas */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onChangeTab("stats")}
      >
        <Ionicons
          name={activeTab === "stats" ? "stats-chart" : "stats-chart-outline"}
          size={26}
          color={activeTab === "stats" ? "#2196F3" : "#64748B"}
        />
      </TouchableOpacity>

      {/* Perfil */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onChangeTab("profile")}
      >
        <Ionicons
          name={activeTab === "profile" ? "person" : "person-outline"}
          size={26}
          color={activeTab === "profile" ? "#2196F3" : "#64748B"}
        />
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
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 10,
  },
});
