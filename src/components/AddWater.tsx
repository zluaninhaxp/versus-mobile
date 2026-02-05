import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "./BottomSheetModal";

interface AddWaterModalProps {
  onAdd: (quantidade: number) => void;
  isGold?: boolean;
}

export function AddWaterModal({ onAdd, isGold }: AddWaterModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [valorCustomizado, setValorCustomizado] = useState("");
  const [atalhos, setAtalhos] = useState([
    250, 500, 1000, 1500, 2000, 2500, 3000,
  ]);

  const getWaterIcon = (quantidade: number, size = 30) => {
    if (quantidade < 500)
      return (
        <MaterialCommunityIcons name="cup-water" size={size} color="#4CAFFF" />
      );
    if (quantidade < 1000)
      return (
        <MaterialCommunityIcons
          name="bottle-tonic-plus"
          size={size}
          color="#4CAFFF"
        />
      );
    return (
      <MaterialCommunityIcons
        name="bottle-wine"
        size={size + 5}
        color="#4CAFFF"
      />
    );
  };

  const handlePress = (valor: number) => {
    if (isEditMode) {
      if (atalhos.length <= 1) {
        Alert.alert("Ops!", "Mantenha pelo menos um atalho.");
        return;
      }
      setAtalhos(atalhos.filter((item) => item !== valor));
    } else {
      onAdd(valor);
      handleClose();
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setIsEditMode(false);
    setValorCustomizado("");
  };

  const adicionarNovoAtalho = () => {
    const num = Number(valorCustomizado);
    if (num > 0) {
      if (!atalhos.includes(num)) {
        setAtalhos([...atalhos, num].sort((a, b) => a - b));
      }
      onAdd(num);
      setSubModalVisible(false);
      handleClose();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.addButton, isGold && styles.buttonGold]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>

      <BottomSheetModal
        visible={modalVisible}
        onClose={handleClose}
        height={0.6}
      >
        {/* Header */}
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalTitle}>Bebeu quanto? 💧</Text>
            <Text style={styles.modalSub}>
              {isEditMode ? "Toque para remover" : "Toque para registrar"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
            <Ionicons
              name={isEditMode ? "checkmark-circle" : "trash-outline"}
              size={28}
              color={isEditMode ? "#2ECC71" : "#E74C3C"}
            />
          </TouchableOpacity>
        </View>

        {/* Grid de opções */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.optionsGrid}
        >
          {atalhos.map((valor) => (
            <TouchableOpacity
              key={valor}
              style={[
                styles.optionButton,
                isEditMode && styles.optionButtonEdit,
              ]}
              onPress={() => handlePress(valor)}
            >
              {isEditMode && (
                <View style={styles.deleteBadge}>
                  <Ionicons name="close" size={16} color="white" />
                </View>
              )}
              {getWaterIcon(valor)}
              <Text style={styles.optionText}>
                {valor >= 1000 ? `${valor / 1000}L` : `${valor}ml`}
              </Text>
            </TouchableOpacity>
          ))}
          {!isEditMode && (
            <TouchableOpacity
              style={styles.customAddBtn}
              onPress={() => setSubModalVisible(true)}
            >
              <Ionicons name="settings-outline" size={30} color="#4CAFFF" />
              <Text style={styles.moreText}>Novo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </BottomSheetModal>

      {/* Submodal para adicionar novo atalho */}
      <Modal animationType="fade" transparent visible={subModalVisible}>
        <View style={styles.subModalOverlay}>
          <View style={styles.subModalContent}>
            <Text style={styles.subModalTitle}>Novo Atalho 🥤</Text>
            <View style={styles.previewIcon}>
              {getWaterIcon(Number(valorCustomizado) || 0, 60)}
              <Text style={styles.previewText}>
                {valorCustomizado ? `${valorCustomizado}ml` : "---"}
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ex: 473"
              keyboardType="numeric"
              value={valorCustomizado}
              onChangeText={setValorCustomizado}
              autoFocus
            />
            <TouchableOpacity
              style={[
                styles.btnFinalAdd,
                !valorCustomizado && { opacity: 0.5 },
              ]}
              onPress={adicionarNovoAtalho}
              disabled={!valorCustomizado}
            >
              <Text style={styles.btnFinalText}>ADICIONAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSubModalVisible(false)}
              style={{ marginTop: 15 }}
            >
              <Text style={{ color: "#888" }}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: "#4CAFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  buttonGold: {
    backgroundColor: "#02BA96",
    shadowColor: "#02BA96",
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#2B5B8E" },
  modalSub: { fontSize: 12, color: "#888" },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 60,
    paddingTop: 5,
    justifyContent: "flex-start",
  },
  optionButton: {
    backgroundColor: "#F8FBFF",
    width: "30%",
    height: 100,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E1EFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: "1.5%",
  },
  optionButtonEdit: { borderColor: "#E74C3C", borderStyle: "dashed" },
  optionText: { color: "#2B5B8E", fontWeight: "bold", marginTop: 5 },
  deleteBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#E74C3C",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  customAddBtn: {
    backgroundColor: "#FFF",
    width: "30%",
    height: 100,
    borderRadius: 20,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#4CAFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: "1.5%",
  },
  moreText: {
    fontSize: 11,
    color: "#4CAFFF",
    fontWeight: "bold",
    marginTop: 5,
  },
  subModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  subModalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 35,
    padding: 30,
    alignItems: "center",
  },
  subModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2B5B8E",
    marginBottom: 20,
  },
  previewIcon: { marginBottom: 20, alignItems: "center" },
  previewText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAFFF",
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 18,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 25,
  },
  btnFinalAdd: {
    backgroundColor: "#4CAFFF",
    width: "100%",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  btnFinalText: { color: "white", fontWeight: "900", fontSize: 16 },
});
