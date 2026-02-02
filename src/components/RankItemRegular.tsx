import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReactionSelector } from "./ReactionSelector";

export function RankItemRegular({
  position,
  name,
  ml,
  goal,
  photo,
  reactions: initialReactions = [],
}) {
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(initialReactions);
  const [cooldown, setCooldown] = useState(0);

  const metaAlcancada = ml >= goal;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleReactionChange = (newEmoji: string) => {
    let updatedReactions = [...localReactions];
    if (newEmoji === myReaction) {
      updatedReactions = updatedReactions
        .map((r) =>
          r.emoji === newEmoji ? { ...r, count: Math.max(0, r.count - 1) } : r,
        )
        .filter((r) => r.count > 0);
      setMyReaction(null);
    } else {
      if (myReaction) {
        updatedReactions = updatedReactions
          .map((r) =>
            r.emoji === myReaction
              ? { ...r, count: Math.max(0, r.count - 1) }
              : r,
          )
          .filter((r) => r.count > 0);
      }
      const existingIndex = updatedReactions.findIndex(
        (r) => r.emoji === newEmoji,
      );
      if (existingIndex > -1) {
        updatedReactions[existingIndex] = {
          ...updatedReactions[existingIndex],
          count: updatedReactions[existingIndex].count + 1,
        };
      } else {
        updatedReactions.push({ emoji: newEmoji, count: 1 });
      }
      setMyReaction(newEmoji);
    }
    setLocalReactions(updatedReactions);
  };

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
        <View style={styles.actionsContainer}>
          <ReactionSelector
            currentReaction={myReaction}
            onReactionSelect={handleReactionChange}
          />
          {!metaAlcancada && (
            <View style={styles.notifyWrapper}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  cooldown > 0 && styles.buttonDisabled,
                ]}
                onPress={() => setCooldown(3600)}
                disabled={cooldown > 0}
              >
                <Ionicons
                  name={
                    cooldown > 0 ? "notifications" : "notifications-outline"
                  }
                  size={20}
                  color={cooldown > 0 ? "white" : "#6B7D8F"}
                />
              </TouchableOpacity>
              {cooldown > 0 && (
                <Text style={styles.absoluteCooldown}>
                  {formatTime(cooldown)}
                </Text>
              )}
            </View>
          )}
        </View>
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
  actionsContainer: { flexDirection: "row", gap: 6 },
  notifyWrapper: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FBFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EEF4",
  },
  buttonDisabled: { backgroundColor: "#475569", borderColor: "#475569" },
  absoluteCooldown: {
    position: "absolute",
    bottom: -16,
    fontSize: 10,
    fontWeight: "bold",
    color: "#475569",
    width: 50,
    textAlign: "center",
  },
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
