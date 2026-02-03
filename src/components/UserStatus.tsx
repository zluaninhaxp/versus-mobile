import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { AddWaterModal } from "./AddWaterModal";

interface UserStatusProps {
  ml: number;
  onAdd: (q: number) => void;
  userName: string;
  meta: number;
}

export function UserStatus({ ml, onAdd, userName, meta }: UserStatusProps) {
  const porcentagemReal = (ml / meta) * 100;
  const porcentagemExibida = Math.min(porcentagemReal, 100);
  const bateuAMeta = ml >= meta;

  const fotoPerfil = "https://i.pravatar.cc/300?img=32";

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={[styles.avatarContainer, bateuAMeta && styles.avatarGold]}>
          <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
          {bateuAMeta && <View style={styles.haloGold} />}
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.statsRow}>
            <Text style={[styles.userStats, bateuAMeta && styles.textGold]}>
              {ml}ml
            </Text>
            <Text style={styles.metaText}> / {meta}ml</Text>
          </View>
        </View>

        {/* Mantido apenas o botão de adicionar água à direita */}
        <AddWaterModal onAdd={onAdd} isGold={bateuAMeta} />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${porcentagemExibida}%` },
              bateuAMeta && styles.progressBarGold,
            ]}
          />
        </View>
        <Text
          style={[styles.progressPercent, bateuAMeta && styles.percentGold]}
        >
          {Math.round(porcentagemExibida)}% CONCLUÍDO
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 10, marginTop: 10 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    elevation: 8,
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 42.5 },
  avatarGold: { borderColor: "#FFD700" },
  haloGold: {
    position: "absolute",
    width: 95,
    height: 95,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFD700",
    opacity: 0.5,
  },
  nameContainer: { flex: 1, marginLeft: 20 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#2B3E50" },
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  userStats: { fontSize: 32, fontWeight: "900", color: "#2B5B8E" },
  textGold: { color: "#DAA520" },
  metaText: {
    fontSize: 16,
    color: "#D1D8DD",
    fontWeight: "600",
    marginLeft: 4,
  },
  progressSection: { width: "100%", paddingHorizontal: 5 },
  progressBarBg: {
    height: 14,
    backgroundColor: "#EBF4FF",
    borderRadius: 7,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAFFF",
    borderRadius: 7,
  },
  progressBarGold: { backgroundColor: "#FFD700" },
  progressPercent: {
    fontSize: 12,
    fontWeight: "900",
    color: "#BDC3C7",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
  percentGold: { color: "#DAA520" },
});
