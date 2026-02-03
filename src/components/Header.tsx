import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onOpenMenu: () => void; // Abre o Perfil (Drawer)
  onOpenHistory: () => void; // Abre o Histórico (Modal)
  onOpenSettings: () => void; // Abre as Configurações (Modal)
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
        <Ionicons name="menu" size={32} color="#2B5B8E" />
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={onOpenHistory}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="time-outline" size={28} color="#2B5B8E" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenSettings}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="settings-outline" size={28} color="#2B5B8E" />
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
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15, // Espaçamento entre histórico e configurações
  },
  iconButton: {
    padding: 2,
  },
});
