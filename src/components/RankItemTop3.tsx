import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RankingActions } from "./RankingActions";

interface RankItemTop3Props {
  position: number;
  name: string;
  ml: number;
  goal: number;
  photo?: string;
  reactions?: { emoji: string; count: number }[];
  activeReactionId: string | null;
  onOpenReaction: (id: string | null) => void;
  onPress?: () => void;
}

export function RankItemTop3({
  position,
  name,
  ml,
  goal,
  photo,
  reactions: initialReactions = [],
  activeReactionId,
  onOpenReaction,
  onPress,
}: RankItemTop3Props) {
  const [localReactions, setLocalReactions] = useState(initialReactions);
  const metaAlcancada = ml >= goal;
  const myId = `top3-${position}`;

  // Identifica se este item pertence à Luana Castro
  const isMe = name === "Luana Castro";

  const config =
    position === 1
      ? { bg: "#14B8D4", badge: "#FDB813", photoSize: 80 }
      : position === 2
        ? { bg: "#6B7D8F", badge: "#E8E8E8", photoSize: 64 }
        : { bg: "#E67E22", badge: "#FFD89B", photoSize: 64 };

  return (
    <View style={[styles.card, { backgroundColor: config.bg }]}>
      <View style={styles.topRow}>
        <View style={[styles.positionBadge, { backgroundColor: config.badge }]}>
          <Text style={styles.medalIcon}>
            {position === 1 ? "🥇" : position === 2 ? "🥈" : "🥉"}
          </Text>
          <Text style={styles.positionText}>{position}º Lugar</Text>
        </View>

        <View style={styles.rightGroup}>
          {metaAlcancada && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>Meta!</Text>
            </View>
          )}

          <RankingActions
            isMe={isMe} // Repassa a trava para o seletor
            id={myId}
            activeReactionId={activeReactionId}
            onOpenReaction={onOpenReaction}
            isTop3={true}
            metaAlcancada={metaAlcancada}
            initialReactions={initialReactions}
            onReactionUpdate={(nr) => setLocalReactions(nr)}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.mainContentClickable}
        onPress={onPress}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={{ uri: photo || "https://i.pravatar.cc/150" }}
          style={[
            styles.photo,
            {
              width: config.photoSize,
              height: config.photoSize,
              borderRadius: config.photoSize / 2,
            },
          ]}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.mlValue}>{ml} ml</Text>
            <Text style={styles.mlGoal}> / {goal}ml</Text>
          </View>
        </View>
      </TouchableOpacity>

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
  card: { borderRadius: 20, padding: 16, marginBottom: 15 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  positionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  rightGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  medalIcon: { fontSize: 16 },
  positionText: { fontSize: 13, fontWeight: "bold", color: "#333" },
  mainContentClickable: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  photo: { borderWidth: 3, borderColor: "white", marginRight: 16 },
  infoContainer: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "bold", color: "white" },
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  mlValue: { fontSize: 24, fontWeight: "900", color: "white" },
  mlGoal: { fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  metaBadge: {
    backgroundColor: "#2ECC71",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  metaText: { color: "white", fontSize: 11, fontWeight: "bold" },
  reactionsContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 8,
  },
  reactionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  reactionEmoji: { fontSize: 16 },
  reactionCount: { color: "white", fontSize: 14, fontWeight: "bold" },
});
