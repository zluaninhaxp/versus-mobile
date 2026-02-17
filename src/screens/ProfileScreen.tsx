import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { EditProfileModal } from "../components/EditProfileModal";
import { PreferencesModal } from "../components/PreferencesModal";
import { AchievementsModal } from "../components/AchievementsModal";

const AVATAR_ICONS: Record<number, { icon: string; color: string }> = {
  1: { icon: "person", color: "#2196F3" },
  2: { icon: "happy", color: "#10B981" },
  3: { icon: "star", color: "#FFD700" },
  4: { icon: "heart", color: "#EF4444" },
  5: { icon: "flash", color: "#F59E0B" },
  6: { icon: "rocket", color: "#9B59B6" },
  7: { icon: "leaf", color: "#27AE60" },
  8: { icon: "water", color: "#3498DB" },
};

const ACHIEVEMENTS = [
  {
    id: 1,
    title: "Primeira Gota",
    description: "Registre sua primeira água",
    icon: "water",
    color: "#2196F3",
    unlocked: true,
  },
  {
    id: 2,
    title: "Hidratado!",
    description: "Bata a meta por 1 dia",
    icon: "checkmark-circle",
    color: "#10B981",
    unlocked: true,
  },
  {
    id: 3,
    title: "Sequência de 3",
    description: "Meta por 3 dias seguidos",
    icon: "flame",
    color: "#EF4444",
    unlocked: true,
    progress: 3,
    total: 3,
  },
  {
    id: 4,
    title: "Sequência de 7",
    description: "Meta por 7 dias seguidos",
    icon: "flame",
    color: "#F59E0B",
    unlocked: false,
    progress: 5,
    total: 7,
  },
  {
    id: 5,
    title: "Líder do Ranking",
    description: "Fique em 1º no ranking",
    icon: "trophy",
    color: "#FFD700",
    unlocked: false,
    progress: 0,
    total: 1,
  },
  {
    id: 6,
    title: "Social",
    description: "Entre em um grupo",
    icon: "people",
    color: "#9B59B6",
    unlocked: false,
    progress: 0,
    total: 1,
  },
];

interface ProfileScreenProps {
  userName?: string;
  userPhoto?: string;
  ml?: number;
  meta?: number;
}

export function ProfileScreen({
  userName = "Luana Castro",
  userPhoto = "https://i.pravatar.cc/300?img=32",
  ml = 2850,
  meta = 2500,
}: ProfileScreenProps) {
  const [name, setName] = useState(userName);
  const [avatarId, setAvatarId] = useState(0); // 0 = usa foto real
  const [showEdit, setShowEdit] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: true,
    reminderFrequency: 2,
    darkMode: false,
    soundEffects: true,
  });

  const pct = Math.min((ml / meta) * 100, 100);
  const metaAlcancada = ml >= meta;
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  const menuItems = [
    {
      icon: "pencil",
      label: "Editar perfil",
      color: "#6096ba",
      onPress: () => setShowEdit(true),
    },
    {
      icon: "trophy",
      label: "Conquistas",
      color: "#FFD700",
      badge: `${unlockedCount}/${ACHIEVEMENTS.length}`,
      onPress: () => setShowAchievements(true),
    },
    {
      icon: "settings",
      label: "Preferências",
      color: "#64748B",
      onPress: () => setShowPreferences(true),
    },
    {
      icon: "share-social",
      label: "Convidar amigos",
      color: "#10B981",
      onPress: () => {},
    },
    {
      icon: "help-circle",
      label: "Ajuda",
      color: "#94A3B8",
      onPress: () => {},
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Header card do perfil */}
      <LinearGradient
        colors={["#6096ba", "#a3cef1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileHeader}
      >
        <View style={styles.avatarArea}>
          <View style={styles.avatarRing}>
            <Image source={{ uri: userPhoto }} style={styles.avatar} />
          </View>
          <TouchableOpacity
            style={styles.editAvatarBtn}
            onPress={() => setShowEdit(true)}
          >
            <Ionicons name="camera" size={14} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileSub}>Membro desde Jan 2025</Text>

        <View style={styles.mlRow}>
          <Text style={styles.mlValue}>{ml}ml</Text>
          <Text style={styles.mlGoal}> / {meta}ml hoje</Text>
        </View>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct}%` },
              metaAlcancada && styles.progressFillGold,
            ]}
          />
        </View>
        {metaAlcancada && (
          <View style={styles.metaBadge}>
            <Ionicons name="checkmark-circle" size={14} color="white" />
            <Text style={styles.metaBadgeText}>Meta atingida! 🎉</Text>
          </View>
        )}
      </LinearGradient>

      {/* Resumo rápido */}
      <View style={styles.quickStats}>
        {[
          {
            label: "Dias na meta",
            value: "18",
            icon: "checkmark-circle",
            color: "#10B981",
          },
          { label: "Sequência", value: "5🔥", icon: "flame", color: "#EF4444" },
          {
            label: "Conquistas",
            value: `${unlockedCount}`,
            icon: "trophy",
            color: "#FFD700",
          },
        ].map((s) => (
          <View key={s.label} style={styles.quickStatItem}>
            <Text style={[styles.quickStatValue, { color: s.color }]}>
              {s.value}
            </Text>
            <Text style={styles.quickStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              i < menuItems.length - 1 && styles.menuItemBorder,
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.menuIconBg,
                { backgroundColor: item.color + "18" },
              ]}
            >
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={styles.menuRight}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Versão */}
      <Text style={styles.version}>VERSUS v1.0.0 · Feito com 💧</Text>

      {/* Modais */}
      <EditProfileModal
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        currentName={name}
        currentAvatar={avatarId}
        onSave={(newName, newAvatar) => {
          setName(newName);
          setAvatarId(newAvatar);
        }}
      />

      <PreferencesModal
        visible={showPreferences}
        onClose={() => setShowPreferences(false)}
        preferences={preferences}
        onSave={setPreferences}
      />

      <AchievementsModal
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
        achievements={ACHIEVEMENTS}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { paddingBottom: 40 },

  profileHeader: {
    paddingTop: 30,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
  },
  avatarArea: { position: "relative", marginBottom: 12 },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#274c77",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "900",
    color: "white",
    marginBottom: 4,
  },
  profileSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 14,
  },
  mlRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 10 },
  mlValue: { fontSize: 26, fontWeight: "900", color: "white" },
  mlGoal: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  progressBg: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: { height: "100%", backgroundColor: "white", borderRadius: 5 },
  progressFillGold: { backgroundColor: "#FFD700" },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  metaBadgeText: { fontSize: 13, color: "white", fontWeight: "700" },

  quickStats: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  quickStatItem: { flex: 1, alignItems: "center" },
  quickStatValue: { fontSize: 22, fontWeight: "900" },
  quickStatLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "600",
    textAlign: "center",
  },

  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "700", color: "#334155" },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#64748B" },

  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#CBD5E1",
    fontWeight: "600",
  },
});
