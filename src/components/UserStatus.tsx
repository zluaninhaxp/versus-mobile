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

  // Mantendo a verificação apenas para lógica de UI (como o botão Gold),
  // mas as cores da barra e textos agora são estáticas.
  const bateuAMeta = ml >= meta;
  const fotoPerfil = "https://i.pravatar.cc/300?img=32";

  // Gradiente fixo independente do progresso
  const progressColors = ["#7737d1", "#ffdd8e"];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} />
          {bateuAMeta && <View style={styles.haloGold} />}
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
            colors={progressColors}
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
    backgroundColor: "#fefbff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fefbff", // Borda fixa no tom dourado/amarelo
    elevation: 8,
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 42.5 },
  nameContainer: { flex: 1, marginLeft: 20 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#fefbff" },
  statsRow: { flexDirection: "row", alignItems: "baseline" },
  userStats: { fontSize: 32, fontWeight: "900", color: "#fefbff" }, // Cor fixa de destaque
  metaText: {
    fontSize: 16,
    color: "#BDC3C7",
    fontWeight: "600",
    marginLeft: 4,
  },
  progressSection: { width: "100%", paddingHorizontal: 5 },
  progressBarBg: {
    height: 14,
    backgroundColor: "rgba(189, 195, 199, 0.3)",
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
    color: "#BDC3C7", // Cor fixa para o percentual
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
});
