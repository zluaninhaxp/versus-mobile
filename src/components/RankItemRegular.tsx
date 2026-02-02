import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RankingActions } from "./RankingActions";

interface RankItemRegularProps {
  position: number;
  name: string;
  ml: number;
  goal: number;
  photo?: string;
  reactions?: { emoji: string; count: number }[];
}

export function RankItemRegular({
  position,
  name,
  ml,
  goal,
  photo,
  reactions: initialReactions = [],
}: RankItemRegularProps) {
  const [localReactions, setLocalReactions] = useState(initialReactions);
  const metaAlcancada = ml >= goal;

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        <View style={styles.positionCircle}>
          <Text style={styles.positionNumber}>{position}</Text>
        </View>

        <View style={styles.photoContainer}>
          <Image
            source={{ uri: photo || "https://i.pravatar.cc/150" }}
            style={styles.photo}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.mlValue}>{ml} ml</Text>
            <Text style={styles.mlGoal}> / {goal}ml</Text>
          </View>
        </View>

        {/* Componente Unificado de Ações */}
        <RankingActions
          isTop3={false}
          metaAlcancada={metaAlcancada}
          initialReactions={initialReactions}
          onReactionUpdate={(newReactions) => setLocalReactions(newReactions)}
        />
      </View>

      {localReactions.length > 0 && (
        <View style={styles.reactionsContainer}>
          {localReactions.map((r, i) => (
            <View key={i} style={styles.reactionBadge}>
              <Text style={styles.reactionEmoji}>{r.emoji}</Text>
              <Text style={styles.reactionCount}>{r.count}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
  },
  mainRow: { flexDirection: "row", alignItems: "center" },
  positionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F4F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  positionNumber: { fontSize: 16, fontWeight: "bold", color: "#6B7D8F" },
  photoContainer: { marginRight: 12 },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#F0F4F8",
  },
  infoContainer: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#2B3E50" },
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  mlValue: { fontSize: 18, fontWeight: "900", color: "#14B8D4" },
  mlGoal: { fontSize: 13, color: "#9BA8B5", fontWeight: "600" },
  reactionsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F4F8",
    flexWrap: "wrap",
  },
  reactionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "#E8EEF4",
  },
  reactionEmoji: { fontSize: 14 },
  reactionCount: { color: "#6B7D8F", fontSize: 13, fontWeight: "bold" },
});
