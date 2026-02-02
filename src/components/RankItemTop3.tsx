import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReactionSelector } from "./ReactionSelector";

export function RankItemTop3({
  position,
  name,
  ml,
  goal,
  photo,
  reactions: initialReactions = [],
}) {
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(initialReactions);
  const [cooldown, setCooldown] = useState(0); // Tempo em segundos

  const metaAlcancada = ml >= goal;

  // Timer para o Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Formatação MM:SS (Ex: 59:59)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleNotify = () => {
    if (cooldown === 0) {
      setCooldown(3600); // 1 hora (3600 segundos)
    }
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
          <Text style={styles.medal}>
            {position === 1 ? "🥇" : position === 2 ? "🥈" : "🥉"}
          </Text>
          <Text style={styles.positionText}>{position}º Lugar</Text>
        </View>

        <View style={styles.rightIcons}>
          {metaAlcancada && (
            <View style={styles.metaBadge}>
              <Ionicons name="checkmark-circle" size={14} color="white" />
              <Text style={styles.metaText}>Meta alcançada!</Text>
            </View>
          )}

          <ReactionSelector
            currentReaction={myReaction}
            onReactionSelect={handleReactionChange}
          />

          {!metaAlcancada && (
            <TouchableOpacity
              style={[
                styles.iconButton,
                cooldown > 0 && styles.iconButtonDisabled,
              ]}
              onPress={handleNotify}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? (
                <View style={styles.cooldownContainer}>
                  <Ionicons name="time-outline" size={16} color="white" />
                  <Text style={styles.cooldownText}>
                    {formatTime(cooldown)}
                  </Text>
                </View>
              ) : (
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="white"
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.photoContainer}>
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
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.mlValue}>{ml} ml</Text>
            <Text style={styles.mlGoal}> / {goal}ml</Text>
          </View>
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
  card: { borderRadius: 20, padding: 16, marginBottom: 12 },
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
  positionText: { fontSize: 13, fontWeight: "bold", color: "#333" },
  rightIcons: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  metaText: { color: "white", fontSize: 11, fontWeight: "bold" },
  iconButton: {
    width: 50,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonDisabled: { backgroundColor: "#1A1A1A", width: 65 }, // Fica escuro e um pouco mais largo para o tempo
  cooldownContainer: { alignItems: "center", justifyContent: "center" },
  cooldownText: { color: "white", fontSize: 10, fontWeight: "bold" },
  mainContent: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  photoContainer: { marginRight: 16 },
  photo: { borderWidth: 3, borderColor: "white" },
  infoContainer: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "bold", color: "white" },
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  mlValue: { fontSize: 24, fontWeight: "900", color: "white" },
  mlGoal: { fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
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
  medal: { fontSize: 16 },
});
