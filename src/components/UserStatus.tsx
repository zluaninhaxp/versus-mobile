import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AddWaterModal } from "./AddWater";

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

  // CORREÇÃO: Adicionado 'as const' para garantir que seja lido como uma tupla imutável
  const progressColors = ["#a3cef1", "#6096ba"] as const;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.userStats}>{ml}ml</Text>
            <Text style={styles.metaText}> / {meta}ml</Text>
          </View>
        </View>

        <AddWaterModal onAdd={onAdd} isGold={bateuAMeta} />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={progressColors} // Agora o TS reconhece como Tupla válida
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              { width: `${porcentagemExibida}%` },
            ]}
          />
        </View>
        <Text style={styles.progressPercent}>
          {Math.round(porcentagemExibida)}% CONCLUÍDO
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
  },
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
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 42.5,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  userStats: {
    fontSize: 32,
    fontWeight: "900",
    color: "#274c77",
  },
  metaText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.6)",
    fontWeight: "600",
    marginLeft: 4,
  },
  progressSection: {
    width: "100%",
  },
  progressBarBg: {
    height: 14,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 7,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 7,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
});
