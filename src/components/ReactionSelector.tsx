import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const REACTIONS = ["❤️", "👏", "🔥", "💪", "🎉", "👍"];

interface ReactionSelectorProps {
  onReactionSelect?: (reaction: string) => void;
  currentReaction?: string | null;
}

export function ReactionSelector({
  onReactionSelect,
  currentReaction,
}: ReactionSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-200)).current;

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleReactionSelect = (reaction: string) => {
    onReactionSelect?.(reaction);
    closeModal();
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.actionButton,
          currentReaction ? styles.actionButtonActive : null,
        ]}
        onPress={() => {
          if (currentReaction) {
            onReactionSelect?.(currentReaction);
          } else {
            openModal();
          }
        }}
      >
        {currentReaction ? (
          <View style={styles.reactionActiveWrapper}>
            <Text style={styles.emojiText}>{currentReaction}</Text>
            {/* O "xizinho" indicando que pode cancelar */}
            <View style={styles.closeBadge}>
              <Ionicons name="close" size={10} color="white" />
            </View>
          </View>
        ) : (
          <Ionicons name="happy-outline" size={20} color="#6B7D8F" />
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.reactionModal,
                  { transform: [{ translateX: slideAnim }] },
                ]}
              >
                <View style={styles.reactionGrid}>
                  {REACTIONS.map((reaction) => (
                    <TouchableOpacity
                      key={reaction}
                      style={[
                        styles.reactionOption,
                        currentReaction === reaction &&
                          styles.reactionOptionSelected,
                      ]}
                      onPress={() => handleReactionSelect(reaction)}
                    >
                      <Text style={styles.reactionEmoji}>{reaction}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FBFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1EFFF",
  },
  actionButtonActive: {
    backgroundColor: "#E1EFFF",
    borderColor: "#4A90E2",
  },
  reactionActiveWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF4D4D", // Vermelho para indicar cancelamento
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  emojiText: { fontSize: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  reactionModal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 2,
    borderColor: "#E1EFFF",
  },
  reactionGrid: { flexDirection: "row", flexWrap: "wrap", width: 180, gap: 8 },
  reactionOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F8FBFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E1EFFF",
  },
  reactionOptionSelected: {
    backgroundColor: "#E1EFFF",
    borderColor: "#4A90E2",
  },
  reactionEmoji: { fontSize: 24 },
});
