import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  reactions = [],
}: RankItemRegularProps) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  return (
    <View style={styles.card}>
      {/* Container principal */}
      <View style={styles.mainRow}>
        {/* Número da posição */}
        <View style={styles.positionCircle}>
          <Text style={styles.positionNumber}>{position}</Text>
        </View>

        {/* Foto */}
        <View style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="person" size={28} color="#888" />
            </View>
          )}
        </View>

        {/* Informações */}
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.mlValue}>{ml} ml</Text>
            <Text style={styles.mlGoal}> / {goal}ml</Text>
          </View>
        </View>

        {/* Botões de ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="happy-outline" size={20} color="#6B7D8F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setNotificationEnabled(!notificationEnabled)}
          >
            <Ionicons
              name={
                notificationEnabled ? "notifications" : "notifications-outline"
              }
              size={20}
              color="#6B7D8F"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reações (se houver) */}
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
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  positionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F4F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  positionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B7D8F",
  },
  photoContainer: {
    marginRight: 12,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#F0F4F8",
  },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F4F8",
    borderWidth: 2,
    borderColor: "#E8EEF4",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2B3E50",
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  mlValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#14B8D4",
  },
  mlGoal: {
    fontSize: 13,
    color: "#9BA8B5",
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8EEF4",
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
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    color: "#6B7D8F",
    fontSize: 13,
    fontWeight: "bold",
  },
});
