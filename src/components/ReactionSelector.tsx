import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const REACTIONS = ["🤩", "😂", "😳", "🥺", "😡"];

interface ReactionSelectorProps {
  currentReaction: string | null;
  onReactionSelect: (reaction: string) => void;
  isTop3?: boolean;
}

export function ReactionSelector({
  currentReaction,
  onReactionSelect,
  isTop3 = false,
}: ReactionSelectorProps) {
  const [open, setOpen] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const show = () => {
    setOpen(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hide = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.6,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => setOpen(false));
  };

  const pick = (emoji: string) => {
    onReactionSelect(emoji);
    hide();
  };

  return (
    <View style={styles.wrapper}>
      {/* Botão que abre/fecha */}
      <TouchableOpacity
        style={[
          styles.btn,
          isTop3 && styles.btnTop3,
          currentReaction && styles.btnActive,
        ]}
        onPress={() => (open ? hide() : show())}
        zIndex={11}
      >
        {currentReaction ? (
          <View>
            <Text style={styles.emojiActive}>{currentReaction}</Text>
            <View style={styles.xBadge}>
              <Ionicons name="close" size={9} color="white" />
            </View>
          </View>
        ) : (
          <Ionicons
            name="happy-outline"
            size={20}
            color={isTop3 ? "rgba(255,255,255,0.85)" : "#6B7D8F"}
          />
        )}
      </TouchableOpacity>

      {/* Bolha de reações — posicionada acima do botão */}
      {open && (
        <>
          {/* Camada transparente para captar toque fora */}
          <TouchableWithoutFeedback onPress={hide}>
            <View style={styles.outsideTouchLayer} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.bubble,
              { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.emojiRow}>
              {REACTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => pick(emoji)}
                  style={[
                    styles.emojiBtn,
                    currentReaction === emoji && styles.emojiBtnSelected,
                  ]}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Cauda da bolha */}
            <View style={styles.tail} />
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#E1EFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 11,
  },
  btnTop3: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "transparent",
  },
  btnActive: {
    backgroundColor: "#E8F4FF",
    borderColor: "#4CAFFF",
  },
  emojiActive: { fontSize: 20 },
  xBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF4D4D",
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  outsideTouchLayer: {
    position: "absolute",
    top: -600,
    left: -600,
    width: 1400,
    height: 1400,
    zIndex: 9,
  },
  bubble: {
    position: "absolute",
    bottom: 46,
    right: -10,
    zIndex: 10,
    alignItems: "center",
  },
  emojiRow: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "white",
    borderRadius: 26,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiBtnSelected: {
    backgroundColor: "#E8F4FF",
  },
  emojiText: { fontSize: 28 },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderTopWidth: 11,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
  },
});
