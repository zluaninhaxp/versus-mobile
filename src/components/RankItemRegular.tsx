import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Importação do gradiente
import { RankingActions } from "./RankingActions";

export function RankItemRegular({
  position,
  name,
  ml,
  goal,
  photo,
  localReactions,
  onPress,
  isMe,
  metaAlcancada,
  onReactionUpdate,
}: any) {
  return (
    /* Substituição da View por LinearGradient com as cores sugeridas */
    <LinearGradient
      colors={["#4a2285", "#391a67"]} // Transição do roxo médio para o profundo
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.mainRow}>
        <View style={styles.positionCircle}>
          <Text style={styles.positionNumber}>{position}</Text>
        </View>

        <TouchableOpacity
          style={styles.userClickArea}
          onPress={onPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={{ uri: photo || "https://i.pravatar.cc/150" }}
            style={styles.photo}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{name}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.mlValue}>{ml} ml</Text>
              <Text style={styles.mlGoal}> / {goal}ml</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.rightBlock}>
          {metaAlcancada && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>Meta!</Text>
            </View>
          )}
          <RankingActions
            isMe={isMe}
            isTop3={false}
            metaAlcancada={metaAlcancada}
            initialReactions={localReactions}
            onReactionUpdate={onReactionUpdate}
          />
        </View>
      </View>

      {localReactions.length > 0 && (
        <View style={styles.reactionsContainer}>
          {localReactions.map((r: any, i: number) => (
            <View key={i} style={styles.reactionBadge}>
              <Text style={styles.reactionEmoji}>{r.emoji}</Text>
              <Text style={styles.reactionCount}>{r.count}</Text>
            </View>
          ))}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mainRow: { flexDirection: "row", alignItems: "center" },
  positionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Semi-transparente para o gradiente aparecer
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  positionNumber: { fontSize: 16, fontWeight: "bold", color: "#E1EFFF" }, // Texto claro
  userClickArea: { flexDirection: "row", alignItems: "center", flex: 1 },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 10,
  },
  infoContainer: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold", color: "white" }, // Mudado para branco
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  mlValue: { fontSize: 17, fontWeight: "900", color: "#4CAFFF" }, // Azul mais vibrante
  mlGoal: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "600",
  }, // Branco com alpha
  rightBlock: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaBadge: {
    backgroundColor: "#2ECC71",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: { color: "white", fontSize: 10, fontWeight: "bold" },
  reactionsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)", // Divisor sutil
    flexWrap: "wrap",
  },
  reactionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Glassmorphism
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  reactionEmoji: { fontSize: 14 },
  reactionCount: { color: "#E1EFFF", fontSize: 13, fontWeight: "bold" },
});
