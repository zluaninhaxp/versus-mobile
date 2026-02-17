import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WaterSettingsProps {
  visible: boolean;
  onClose: () => void;
  currentMeta: number;
  onSave: (newMeta: number) => void;
}

export function WaterSettingsModal({
  visible,
  onClose,
  currentMeta,
  onSave,
}: WaterSettingsProps) {
  const [newMeta, setNewMeta] = useState(currentMeta.toString());

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="water"
                size={24}
                color="#2196F3"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.title}>Configurar Água</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#888" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>META DIÁRIA (ML)</Text>
          <TextInput
            style={styles.input}
            value={newMeta}
            onChangeText={setNewMeta}
            keyboardType="numeric"
          />

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#2196F3"
            />
            <Text style={styles.infoText}>
              Especialistas recomendam em média 35ml por kg de peso corporal.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              onSave(Number(newMeta));
              onClose();
            }}
          >
            <Text style={styles.btnText}>SALVAR META</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#334155" },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#94A3B8",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
    textAlign: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: { flex: 1, fontSize: 12, color: "#2196F3", marginLeft: 8 },
  btn: {
    backgroundColor: "#2196F3",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
});
