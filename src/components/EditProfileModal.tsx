import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "./BottomSheetModal";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatar: number;
  onSave: (name: string, avatar: number) => void;
}

const AVATARS = [
  { id: 1, icon: "person", color: "#2196F3" },
  { id: 2, icon: "happy", color: "#10B981" },
  { id: 3, icon: "star", color: "#FFD700" },
  { id: 4, icon: "heart", color: "#EF4444" },
  { id: 5, icon: "flash", color: "#F59E0B" },
  { id: 6, icon: "rocket", color: "#9B59B6" },
  { id: 7, icon: "leaf", color: "#27AE60" },
  { id: 8, icon: "water", color: "#3498DB" },
];

export function EditProfileModal({
  visible,
  onClose,
  currentName,
  currentAvatar,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentName);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  const handleSave = () => {
    if (name.trim().length < 2) {
      Alert.alert("Ops!", "O nome precisa ter pelo menos 2 caracteres.");
      return;
    }
    onSave(name.trim(), selectedAvatar);
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose} height={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Perfil</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome"
            maxLength={30}
          />
          <Text style={styles.charCount}>{name.length}/30</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Escolher Avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar.id && styles.avatarSelected,
                  { borderColor: avatar.color },
                ]}
                onPress={() => setSelectedAvatar(avatar.id)}
              >
                <Ionicons
                  name={avatar.icon as any}
                  size={32}
                  color={avatar.color}
                />
                {selectedAvatar === avatar.id && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={14} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
            <Text style={styles.btnSaveText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#334155" },
  content: { paddingBottom: 40 },

  section: { marginBottom: 25 },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#334155",
  },
  charCount: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "right",
    marginTop: 5,
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  avatarOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    position: "relative",
  },
  avatarSelected: {
    backgroundColor: "#BBDEFB",
    borderWidth: 3,
  },
  checkBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#10B981",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  btnCancelText: {
    color: "#64748B",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnSave: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  btnSaveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
