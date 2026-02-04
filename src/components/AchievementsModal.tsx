import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "./BottomSheetModal";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface AchievementsModalProps {
  visible: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export function AchievementsModal({
  visible,
  onClose,
  achievements,
}: AchievementsModalProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      height={0.8}
      backgroundColor="#F5F9FF"
    >
      <View style={styles.header}>
        <Ionicons name="trophy" size={28} color="#FFD700" />
        <Text style={styles.title}>Conquistas</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {unlockedCount} de {achievements.length} desbloqueadas
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(unlockedCount / achievements.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {achievements.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.achievementLocked,
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: achievement.unlocked
                    ? achievement.color + "20"
                    : "#F0F4F8",
                },
              ]}
            >
              <Ionicons
                name={achievement.icon as any}
                size={32}
                color={achievement.unlocked ? achievement.color : "#CBD5E1"}
              />
            </View>

            <View style={styles.achievementInfo}>
              <Text
                style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.textLocked,
                ]}
              >
                {achievement.title}
              </Text>
              <Text
                style={[
                  styles.achievementDesc,
                  !achievement.unlocked && styles.textLocked,
                ]}
              >
                {achievement.description}
              </Text>

              {!achievement.unlocked && achievement.progress !== undefined && (
                <View style={styles.miniProgress}>
                  <View
                    style={[
                      styles.miniProgressFill,
                      {
                        width: `${(achievement.progress / achievement.total!) * 100}%`,
                      },
                    ]}
                  />
                  <Text style={styles.miniProgressText}>
                    {achievement.progress}/{achievement.total}
                  </Text>
                </View>
              )}
            </View>

            {achievement.unlocked && (
              <View style={styles.unlockedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2B5B8E",
  },

  stats: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 14,
    color: "#2B5B8E",
    fontWeight: "600",
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#EBF4FF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 4,
  },

  content: { paddingBottom: 40 },

  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  achievementLocked: {
    opacity: 0.6,
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2B5B8E",
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 13,
    color: "#6B7D8F",
  },
  textLocked: {
    color: "#9BA8B5",
  },

  miniProgress: {
    position: "relative",
    height: 6,
    backgroundColor: "#EBF4FF",
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  miniProgressFill: {
    height: "100%",
    backgroundColor: "#4CAFFF",
    borderRadius: 3,
  },
  miniProgressText: {
    position: "absolute",
    right: 5,
    top: -15,
    fontSize: 10,
    color: "#9BA8B5",
    fontWeight: "bold",
  },

  unlockedBadge: {
    marginLeft: 10,
  },
});
