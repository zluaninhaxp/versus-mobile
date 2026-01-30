import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function RankItem({ name, ml, position }) {
  return (
    <View style={styles.rankItem}>
      <Text style={styles.rankPos}>{position}º</Text>
      <View style={styles.rankAvatar}>
        <Text>Foto</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rankName}>{name}</Text>
        <Text style={styles.rankValue}>{ml}ml</Text>
      </View>
      <TouchableOpacity style={styles.reactionButton}>
        <Text>👏</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  rankPos: { width: 30, fontWeight: "bold", color: "#888" },
  rankAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  rankName: { fontWeight: "bold", color: "#444" },
  rankValue: { color: "#2B5B8E", fontSize: 16, fontWeight: "bold" },
  reactionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F9FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDEBFF",
  },
});
