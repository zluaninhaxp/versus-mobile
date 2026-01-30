import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function RankItemTop({ name, ml }) {
  return (
    <View style={styles.outerContainer}>
      {/* O Card com brilho amarelo */}
      <View style={styles.card}>
        {/* Espaçador para o avatar que está absoluto */}
        <View style={styles.avatarSpacer} />

        {/* Informações do Usuário */}
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userMl}>{ml}ml</Text>
        </View>

        {/* Medalha de Número 1 */}
        <View style={styles.medalContainer}>
          <View style={styles.medalCircle}>
            <Text style={styles.medalNumber}>1</Text>
          </View>
          <View style={styles.ribbons}>
            <View
              style={[styles.ribbon, { transform: [{ rotate: "15deg" }] }]}
            />
            <View
              style={[styles.ribbon, { transform: [{ rotate: "-15deg" }] }]}
            />
          </View>
        </View>

        {/* Reações flutuantes e Botão de Coração */}
        <View style={styles.reactionSection}>
          <Text style={styles.othersReactions}>❤️ 👏</Text>
          <TouchableOpacity style={styles.heartButton}>
            <Ionicons name="heart" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar flutuante com Coroa */}
      <View style={styles.avatarContainer}>
        <View style={styles.crownWrapper}>
          <Text style={styles.crownEmoji}>👑</Text>
        </View>
        <View style={styles.imageCircle}>
          <Text style={styles.photoPlaceholder}>FOTO</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    height: 90,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FFF4A3",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
    elevation: 10,
    shadowColor: "#FFE600",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  avatarSpacer: {
    width: 120,
  },
  avatarContainer: {
    position: "absolute",
    left: 15,
    zIndex: 20,
  },
  imageCircle: {
    width: 95,
    height: 95,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    borderWidth: 5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  photoPlaceholder: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
  },
  crownWrapper: {
    position: "absolute",
    top: -30,
    zIndex: 30,
    transform: [{ rotate: "-25deg" }],
  },
  crownEmoji: {
    fontSize: 50,
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userMl: {
    fontSize: 22,
    fontWeight: "900",
    color: "#333",
    marginTop: 2,
  },
  medalContainer: {
    position: "absolute",
    top: -20,
    right: -20,
    alignItems: "center",
  },
  medalCircle: {
    width: 44,
    height: 44,
    borderRadius: 23,
    backgroundColor: "#FFD166",
    borderWidth: 3,
    borderColor: "#FFF4A3",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  medalNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B8860B",
  },
  ribbons: {
    flexDirection: "row",
    position: "absolute",
    bottom: -10,
  },
  ribbon: {
    width: 10,
    height: 20,
    backgroundColor: "#EF476F",
    marginHorizontal: 2,
  },
  reactionSection: {
    position: "absolute",
    bottom: -15,
    right: -15,
    flexDirection: "row",
    alignItems: "center",
  },
  othersReactions: {
    fontSize: 16,
    marginRight: 5,
    backgroundColor: "#FFFFFF",
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "#FF0040",
    borderWidth: 3,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
