import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function RankItemRegular({ name, ml, position }) {
  return (
    <View style={styles.container}>
      <Text style={styles.pos}>{position}º</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>Foto</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.value}>{ml}ml</Text>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text>👏</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  pos: { width: 35, fontWeight: "bold", color: "#888", fontSize: 14 },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { fontSize: 10, color: "#999" },
  name: { fontWeight: "bold", color: "#444", fontSize: 15 },
  value: { color: "#2B5B8E", fontSize: 16, fontWeight: "700" },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FBFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1EFFF",
  },
});
