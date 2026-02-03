import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReactionSelector } from "./ReactionSelector";

interface RankingActionsProps {
  initialReactions: { emoji: string; count: number }[];
  isTop3: boolean;
  metaAlcancada: boolean;
  onReactionUpdate: (
    updatedReactions: { emoji: string; count: number }[],
  ) => void;
}

export function RankingActions({
  initialReactions,
  isTop3,
  metaAlcancada,
  onReactionUpdate,
}: RankingActionsProps) {
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(initialReactions);
  const [cooldown, setCooldown] = useState(0);

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
    let updated = [...localReactions];

    if (newEmoji === myReaction) {
      // Toggle OFF
      updated = updated
        .map((r) =>
          r.emoji === newEmoji ? { ...r, count: Math.max(0, r.count - 1) } : r,
        )
        .filter((r) => r.count > 0);
      setMyReaction(null);
    } else {
      // Remove antiga se existir
      if (myReaction) {
        updated = updated
          .map((r) =>
            r.emoji === myReaction
              ? { ...r, count: Math.max(0, r.count - 1) }
              : r,
          )
          .filter((r) => r.count > 0);
      }
      // Adiciona nova
      const idx = updated.findIndex((r) => r.emoji === newEmoji);
      if (idx > -1) {
        updated[idx] = { ...updated[idx], count: updated[idx].count + 1 };
      } else {
        updated.push({ emoji: newEmoji, count: 1 });
      }
      setMyReaction(newEmoji);
    }
    setLocalReactions(updated);
    onReactionUpdate(updated);
  };

  return (
    <View style={styles.container}>
      <ReactionSelector
        currentReaction={myReaction}
        onReactionSelect={handleReactionChange}
        isTop3={isTop3}
      />

      {!metaAlcancada && (
        <View style={styles.notifyContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isTop3 ? styles.btnTop3 : styles.btnRegular,
              cooldown > 0 && styles.btnDisabled,
            ]}
            onPress={() => setCooldown(3600)}
            disabled={cooldown > 0}
          >
            <Ionicons
              name={cooldown > 0 ? "notifications" : "notifications-outline"}
              size={20}
              color={isTop3 || cooldown > 0 ? "white" : "#6B7D8F"}
            />
          </TouchableOpacity>
          {cooldown > 0 && (
            <Text
              style={[styles.timer, { color: isTop3 ? "white" : "#475569" }]}
            >
              {formatTime(cooldown)}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  notifyContainer: {
    alignItems: "center",
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  btnRegular: {
    backgroundColor: "#F8FBFF",
    borderColor: "#E8EEF4",
  },
  btnTop3: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "transparent",
  },
  btnDisabled: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  timer: {
    position: "absolute",
    bottom: -16,
    fontSize: 10,
    fontWeight: "bold",
    width: 50,
    textAlign: "center",
  },
});
