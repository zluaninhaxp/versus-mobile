import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onOpenMenu: () => void; // Para o Perfil
  onOpenSettings: () => void; // Para a Água
}

export function Header({ onOpenMenu, onOpenSettings }: HeaderProps) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={onOpenMenu}>
        <Ionicons name="menu" size={32} color="#2B5B8E" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenSettings}>
        <Ionicons name="settings-outline" size={28} color="#2B5B8E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
});
