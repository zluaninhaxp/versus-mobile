import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
  // Valor para a animação do gradiente verde
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (metaAlcancada) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(gradientAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [metaAlcancada]);

  return (
    <View style={styles.shadowWrapper}>
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
                {/* Gradiente Base */}
                <LinearGradient
                  colors={["#7ae582", "#25a18e"]}
                  style={StyleSheet.absoluteFill}
                />
                {/* Gradiente Animado */}
                <Animated.View
                  style={[StyleSheet.absoluteFill, { opacity: gradientAnim }]}
                >
                  <LinearGradient
                    colors={["#34d399", "#10b981"]}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>

                <Ionicons name="water" size={16} color="white" />
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    marginBottom: 12,
    borderRadius: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 14,
  },
  mainRow: { flexDirection: "row", alignItems: "center" },
  positionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  positionNumber: { fontSize: 16, fontWeight: "bold", color: "#64748B" },
  userClickArea: { flexDirection: "row", alignItems: "center", flex: 1 },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    marginRight: 10,
  },
  infoContainer: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#334155" },
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  mlValue: { fontSize: 17, fontWeight: "900", color: "#2196F3" },
  mlGoal: { fontSize: 12, color: "#94A3B8", fontWeight: "600" },
  rightBlock: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    overflow: "hidden",
  },
  reactionsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
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
    borderColor: "#E2E8F0",
  },
  reactionEmoji: { fontSize: 14 },
  reactionCount: { color: "#334155", fontSize: 13, fontWeight: "bold" },
});
