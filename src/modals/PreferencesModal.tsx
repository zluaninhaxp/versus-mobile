import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "../components/BottomSheetModal";

interface PreferencesModalProps {
  visible: boolean;
  onClose: () => void;
  preferences: {
    notifications: boolean;
    reminderFrequency: number;
    darkMode: boolean;
    soundEffects: boolean;
  };
  onSave: (prefs: any) => void;
}

export function PreferencesModal({
  visible,
  onClose,
  preferences,
  onSave,
}: PreferencesModalProps) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleSave = () => {
    onSave(localPrefs);
    onClose();
  };

  const updatePref = (key: string, value: any) => {
    setLocalPrefs({ ...localPrefs, [key]: value });
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose} height={0.75}>
      <View style={styles.header}>
        <Ionicons name="settings" size={28} color="#2196F3" />
        <Text style={styles.title}>Preferências</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color="#2196F3" />
              <Text style={styles.settingLabel}>Ativar lembretes</Text>
            </View>
            <Switch
              value={localPrefs.notifications}
              onValueChange={(v) => updatePref("notifications", v)}
              trackColor={{ false: "#CBD5E1", true: "#2196F3" }}
              thumbColor="white"
            />
          </View>

          {localPrefs.notifications && (
            <View style={styles.subSetting}>
              <Text style={styles.subLabel}>Frequência de lembretes</Text>
              <View style={styles.frequencyOptions}>
                {[1, 2, 3, 4].map((hours) => (
                  <TouchableOpacity
                    key={hours}
                    style={[
                      styles.frequencyBtn,
                      localPrefs.reminderFrequency === hours &&
                        styles.frequencyBtnActive,
                    ]}
                    onPress={() => updatePref("reminderFrequency", hours)}
                  >
                    <Text
                      style={[
                        styles.frequencyText,
                        localPrefs.reminderFrequency === hours &&
                          styles.frequencyTextActive,
                      ]}
                    >
                      {hours}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Aparência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={20} color="#2196F3" />
              <Text style={styles.settingLabel}>Modo escuro</Text>
            </View>
            <Switch
              value={localPrefs.darkMode}
              onValueChange={(v) => updatePref("darkMode", v)}
              trackColor={{ false: "#CBD5E1", true: "#2196F3" }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Sons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sons</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={20} color="#2196F3" />
              <Text style={styles.settingLabel}>Efeitos sonoros</Text>
            </View>
            <Switch
              value={localPrefs.soundEffects}
              onValueChange={(v) => updatePref("soundEffects", v)}
              trackColor={{ false: "#CBD5E1", true: "#2196F3" }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Botões */}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#334155",
  },
  content: { paddingBottom: 40 },

  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 12,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "600",
  },

  subSetting: {
    marginTop: 12,
    marginLeft: 15,
  },
  subLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
  },
  frequencyOptions: {
    flexDirection: "row",
    gap: 10,
  },
  frequencyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  frequencyBtnActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748B",
  },
  frequencyTextActive: {
    color: "white",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
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
