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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EditProfileModal } from "./EditProfileModal";
import { AchievementsModal } from "./AchievementsModal";
import { PreferencesModal } from "./PreferencesModal";

const { width, height: screenHeight } = Dimensions.get("screen");
const DRAWER_WIDTH = width * 0.75;

// Avatares disponíveis
const AVATARS = [
  { id: 1, icon: "person", color: "#4CAFFF" },
  { id: 2, icon: "happy", color: "#2ECC71" },
  { id: 3, icon: "star", color: "#FFD700" },
  { id: 4, icon: "heart", color: "#E74C3C" },
  { id: 5, icon: "flash", color: "#F39C12" },
  { id: 6, icon: "rocket", color: "#9B59B6" },
  { id: 7, icon: "leaf", color: "#27AE60" },
  { id: 8, icon: "water", color: "#3498DB" },
];

// Conquistas exemplo
const INITIAL_ACHIEVEMENTS = [
  {
    id: 1,
    title: "Primeira Gota",
    description: "Registre seu primeiro copo de água",
    icon: "water",
    color: "#4CAFFF",
    unlocked: true,
  },
  {
    id: 2,
    title: "Hidratação Consistente",
    description: "Bata sua meta 7 dias seguidos",
    icon: "flame",
    color: "#E74C3C",
    unlocked: false,
    progress: 3,
    total: 7,
  },
  {
    id: 3,
    title: "Mestre da Água",
    description: "Bata sua meta 30 dias seguidos",
    icon: "trophy",
    color: "#FFD700",
    unlocked: false,
    progress: 3,
    total: 30,
  },
  {
    id: 4,
    title: "Oceano de Saúde",
    description: "Beba 100 litros no total",
    icon: "boat",
    color: "#3498DB",
    unlocked: false,
    progress: 45,
    total: 100,
  },
];

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  userAvatar?: number;
  onUpdateProfile?: (name: string, avatar: number) => void;
}

export function ProfileDrawer({
  visible,
  onClose,
  userName,
  userAvatar = 1,
  onUpdateProfile,
}: ProfileDrawerProps) {
  const [showModal, setShowModal] = useState(visible);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [achievementsVisible, setAchievementsVisible] = useState(false);
  const [preferencesVisible, setPreferencesVisible] = useState(false);

  const [preferences, setPreferences] = useState({
    notifications: true,
    reminderFrequency: 2,
    darkMode: false,
    soundEffects: true,
  });

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.back(0.3)),
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

  const handleLogout = () => {
    Alert.alert(
      "Sair do App",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            onClose();
            // Aqui você implementaria a lógica de logout
            Alert.alert("Logout", "Funcionalidade em desenvolvimento");
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleSaveProfile = (name: string, avatar: number) => {
    onUpdateProfile?.(name, avatar);
  };

  const handleSavePreferences = (prefs: any) => {
    setPreferences(prefs);
    // Aqui você salvaria no AsyncStorage ou contexto global
  };

  if (!showModal) return null;

  const currentAvatar = AVATARS.find((a) => a.id === userAvatar) || AVATARS[0];

  return (
    <>
      <Modal
        transparent
        visible={showModal}
        onRequestClose={onClose}
        animationType="none"
        statusBarTranslucent={true}
      >
        <View style={styles.overlay}>
          <Animated.View
            style={[styles.pressableArea, { opacity: opacityAnim }]}
          >
            <Pressable style={styles.fullScreen} onPress={onClose} />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawerContent,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {/* Seção do Perfil */}
            <View style={styles.profileSection}>
              <View
                style={[
                  styles.avatarPlaceholder,
                  { borderColor: currentAvatar.color },
                ]}
              >
                <Ionicons
                  name={currentAvatar.icon as any}
                  size={40}
                  color={currentAvatar.color}
                />
              </View>
              <Text style={styles.userNameText}>{userName}</Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setEditProfileVisible(true)}
              >
                <Text style={styles.editBtnText}>EDITAR PERFIL</Text>
              </TouchableOpacity>
            </View>

            {/* Opções do Menu */}
            <View style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setAchievementsVisible(true)}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="trophy-outline" size={20} color="#2B5B8E" />
                </View>
                <Text style={styles.menuItemText}>Conquistas</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setPreferencesVisible(true)}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name="settings-outline" size={20} color="#2B5B8E" />
                </View>
                <Text style={styles.menuItemText}>Preferências</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#2B5B8E"
                  />
                </View>
                <Text style={styles.menuItemText}>Ajuda</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#2B5B8E"
                  />
                </View>
                <Text style={styles.menuItemText}>Sobre</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            {/* Botão Sair */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
              <Text style={styles.logoutText}>SAIR DO APP</Text>
            </TouchableOpacity>

            {/* Versão */}
            <Text style={styles.versionText}>Versão 1.0.0</Text>
          </Animated.View>
        </View>
      </Modal>

      {/* Modais das opções */}
      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        currentName={userName}
        currentAvatar={userAvatar}
        onSave={handleSaveProfile}
      />

      <AchievementsModal
        visible={achievementsVisible}
        onClose={() => setAchievementsVisible(false)}
        achievements={INITIAL_ACHIEVEMENTS}
      />

      <PreferencesModal
        visible={preferencesVisible}
        onClose={() => setPreferencesVisible(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </>
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
    borderWidth: 3,
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
    flex: 1,
  },
  logoutBtn: {
    marginBottom: 15,
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F7FF",
    paddingTop: 20,
  },
  logoutText: {
    color: "#FF6B6B",
    fontWeight: "800",
    letterSpacing: 1.5,
    fontSize: 11,
  },
  versionText: {
    textAlign: "center",
    color: "#CBD5E1",
    fontSize: 11,
    marginBottom: 20,
  },
});
