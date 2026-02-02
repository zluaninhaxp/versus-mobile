import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RankItemTop3Props {
  position: number;
  name: string;
  ml: number;
  goal: number;
  photo?: string;
  reactions?: { emoji: string; count: number }[];
}

export function RankItemTop3({
  position,
  name,
  ml,
  goal,
  photo,
  reactions = [],
}: RankItemTop3Props) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const metaAlcancada = ml >= goal;

  // Cores por posição
  const getPositionColors = () => {
    switch (position) {
      case 1:
        return {
          bg: "#14B8D4",
          badge: "#FDB813",
          badgeText: "#8B6914",
        };
      case 2:
        return {
          bg: "#6B7D8F",
          badge: "#E8E8E8",
          badgeText: "#5A6B7A",
        };
      case 3:
        return {
          bg: "#E67E22",
          badge: "#FFD89B",
          badgeText: "#A65D1F",
        };
      default:
        return {
          bg: "#14B8D4",
          badge: "#FDB813",
          badgeText: "#8B6914",
        };
    }
  };

  const colors = getPositionColors();

  const getMedalEmoji = () => {
    switch (position) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.bg }]}>
      {/* Linha superior: Badge de posição + Meta alcançada + Botão notificação */}
      <View style={styles.topRow}>
        <View style={[styles.positionBadge, { backgroundColor: colors.badge }]}>
          <Text style={styles.medalEmoji}>{getMedalEmoji()}</Text>
          <Text style={[styles.positionText, { color: colors.badgeText }]}>
            {position}º Lugar
          </Text>
        </View>

        <View style={styles.rightIcons}>
          {metaAlcancada && (
            <View style={styles.metaBadge}>
              <Ionicons name="checkmark-circle" size={14} color="white" />
              <Text style={styles.metaText}>Meta alcançada!</Text>
            </View>
          )}

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="happy-outline"
              size={20}
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setNotificationEnabled(!notificationEnabled)}
          >
            <Ionicons
              name={
                notificationEnabled ? "notifications" : "notifications-outline"
              }
              size={20}
              color="rgba(255,255,255,0.8)"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo principal: Foto + Informações */}
      <View style={styles.mainContent}>
        <View style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="person" size={40} color="#888" />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.mlValue}>{ml} ml</Text>
            <Text style={styles.mlGoal}> / {goal}ml</Text>
          </View>
        </View>
      </View>

      {/* Reações */}
      {reactions.length > 0 && (
        <View style={styles.reactionsContainer}>
          {reactions.map((reaction, index) => (
            <View key={index} style={styles.reactionBadge}>
              <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              <Text style={styles.reactionCount}>{reaction.count}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
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
  medalEmoji: {
    fontSize: 16,
  },
  positionText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  metaText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  photoContainer: {
    marginRight: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "white",
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  mlValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "white",
  },
  mlGoal: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  reactionsContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
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
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
