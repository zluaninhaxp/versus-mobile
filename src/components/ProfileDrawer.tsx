import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Animated,
  Modal,
  Easing,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Pegamos a altura da 'screen' para cobrir inclusive as barras de navegação do Android
const { width, height: screenHeight } = Dimensions.get("screen");
const DRAWER_WIDTH = width * 0.75;

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
}

export function ProfileDrawer({
  visible,
  onClose,
  userName,
}: ProfileDrawerProps) {
  const [showModal, setShowModal] = useState(visible);

  // Animação de slide (começa fora da tela à esquerda)
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  // Animação de opacidade do fundo escuro
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.back(0.3)), // Efeito de frenagem suave
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      onRequestClose={onClose}
      animationType="none"
      // RESOLVE O GLITCH: Faz o modal vazar por baixo da barra de status e botões
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {/* Fundo escuro (Overlay) animado */}
        <Animated.View style={[styles.pressableArea, { opacity: opacityAnim }]}>
          <Pressable style={styles.fullScreen} onPress={onClose} />
        </Animated.View>

        {/* Conteúdo do Menu (Drawer) que desliza */}
        <Animated.View
          style={[
            styles.drawerContent,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Sessão do Perfil */}
          <View style={styles.profileSection}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#4CAFFF" />
            </View>
            <Text style={styles.userNameText}>{userName}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>EDITAR PERFIL</Text>
            </TouchableOpacity>
          </View>

          {/* Opções do Menu */}
          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color="#2B5B8E"
                />
              </View>
              <Text style={styles.menuItemText}>Escolher Mascote</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="trophy-outline" size={20} color="#2B5B8E" />
              </View>
              <Text style={styles.menuItemText}>Conquistas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="settings-outline" size={20} color="#2B5B8E" />
              </View>
              <Text style={styles.menuItemText}>Preferências</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Sair */}
          <TouchableOpacity style={styles.logoutBtn} onPress={onClose}>
            <Text style={styles.logoutText}>SAIR DO APP</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  fullScreen: {
    flex: 1,
  },
  pressableArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContent: {
    width: DRAWER_WIDTH,
    backgroundColor: "white",
    height: screenHeight,
    padding: 25,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 40 : 80,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.3,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F7FF",
  },
  avatarPlaceholder: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#F5F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E1EFFF",
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2B5B8E",
    letterSpacing: 0.5,
  },
  editBtn: {
    marginTop: 12,
    backgroundColor: "#E1EFFF",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  editBtnText: {
    color: "#4CAFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  menuItems: { flex: 1 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FBFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F7FF",
  },
  menuItemText: {
    fontSize: 16,
    color: "#2B5B8E",
    marginLeft: 15,
    fontWeight: "600",
  },
  logoutBtn: {
    marginBottom: 60, // Espaço extra para não ficar colado nos botões do sistema
    paddingVertical: 15,
    alignItems: "center",
  },
  logoutText: {
    color: "#FF6B6B",
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: 11,
  },
});
