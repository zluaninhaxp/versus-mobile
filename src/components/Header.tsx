import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export function Header({
  onOpenMenu,
  onOpenHistory,
  onOpenSettings,
}: HeaderProps) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        onPress={onOpenMenu}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.logoText}>VERSUS</Text>
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={onOpenHistory}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="time-outline" size={28} color="#334155" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenSettings}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="settings-outline" size={28} color="#334155" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2196F3", // Azul!
    letterSpacing: 2,
    fontStyle: "italic",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconButton: {
    padding: 2,
  },
});
