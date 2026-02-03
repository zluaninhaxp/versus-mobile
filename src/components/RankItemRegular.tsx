import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RankingActions } from "./RankingActions";

export function RankItemRegular({
  position,
  name,
  ml,
  goal,
  photo,
  localReactions,
  activeReactionId,
  onOpenReaction,
  onPress,
  myId,
  isMe,
  metaAlcancada,
  onReactionUpdate,
}: any) {
  return (
    <View style={styles.card}>
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
            id={myId}
            activeReactionId={activeReactionId}
            onOpenReaction={onOpenReaction}
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
    marginRight: 10,
  },
  positionNumber: { fontSize: 16, fontWeight: "bold", color: "#6B7D8F" },
  userClickArea: { flexDirection: "row", alignItems: "center", flex: 1 },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#F0F4F8",
    marginRight: 10,
  },
  infoContainer: { flex: 1 },
  userName: { fontSize: 15, fontWeight: "bold", color: "#2B3E50" },
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  mlValue: { fontSize: 17, fontWeight: "900", color: "#14B8D4" },
  mlGoal: { fontSize: 12, color: "#9BA8B5", fontWeight: "600" },
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
