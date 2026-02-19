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

export function RankItemTop3({
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
  theme,
}: any) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ]),
    ).start();

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

  const medalColor =
    position === 1 ? "#ffc800" : position === 2 ? "#e7ecef" : "#CD7F32";
  const medalEmoji = position === 1 ? "🥇" : position === 2 ? "🥈" : "🥉";

  // A correção está no 'as const' para garantir o tipo Tuple para o TS
  const cardFrom = theme?.cardFrom ?? "#6096ba";
  const cardTo = theme?.cardTo ?? "#3f6ea5";
  const cardFromLight = theme ? theme.secondary : "#a3cef1";
  const cardToLight = theme ? theme.primary : "#80b8dd";

  const config =
    position === 1
      ? { colors: [cardFrom, cardTo] as const }
      : { colors: [cardFromLight, cardToLight] as const };

  const PHOTO_SIZE = 56;
  const RING_SIZE = 64;

  return (
    <View style={styles.shadowWrapper}>
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.mainRow}>
          <View style={styles.positionNumberContainer}>
            <Text style={styles.positionNumberText}>{position}</Text>
          </View>

          <TouchableOpacity
            style={styles.userClickArea}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.medalRing,
                  {
                    borderColor: medalColor,
                    width: RING_SIZE,
                    height: RING_SIZE,
                    borderRadius: RING_SIZE / 2,
                  },
                ]}
              >
                <Image
                  source={{ uri: photo || "https://i.pravatar.cc/150" }}
                  style={{
                    width: PHOTO_SIZE,
                    height: PHOTO_SIZE,
                    borderRadius: PHOTO_SIZE / 2,
                  }}
                />
              </View>

              <Animated.View
                style={[
                  styles.medalBadge,
                  {
                    backgroundColor: medalColor,
                    transform: [{ scale: pulseAnim }],
                    opacity: pulseAnim.interpolate({
                      inputRange: [1, 1.2],
                      outputRange: [1, 0.9],
                    }),
                  },
                ]}
              >
                <Text style={styles.medalText}>{medalEmoji}</Text>
              </Animated.View>
            </View>

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
                <LinearGradient
                  colors={["#7ae582", "#25a18e"] as const}
                  style={StyleSheet.absoluteFill}
                />
                <Animated.View
                  style={[StyleSheet.absoluteFill, { opacity: gradientAnim }]}
                >
                  <LinearGradient
                    colors={["#34d399", "#10b981"] as const}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
                <Ionicons name="water" size={16} color="white" />
              </View>
            )}
            <RankingActions
              isMe={isMe}
              isTop3={true}
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
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    marginBottom: 15,
    borderRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    backgroundColor: "transparent",
  },
  card: {
    borderRadius: 24,
    padding: 12,
    overflow: "hidden",
  },
  mainRow: { flexDirection: "row", alignItems: "center" },
  positionNumberContainer: {
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  positionNumberText: {
    fontSize: 22,
    fontWeight: "900",
    color: "rgba(255, 255, 255, 0.8)",
    fontStyle: "italic",
  },
  userClickArea: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  medalRing: {
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  medalBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  medalText: { fontSize: 13 },
  infoContainer: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold", color: "white" },
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  mlValue: { fontSize: 18, fontWeight: "900", color: "white" },
  mlGoal: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  rightBlock: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    overflow: "hidden", // Importante para o gradiente não vazar o border radius
  },
  reactionsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    flexWrap: "wrap",
  },
  reactionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  reactionEmoji: { fontSize: 14 },
  reactionCount: { color: "white", fontSize: 13, fontWeight: "bold" },
});
