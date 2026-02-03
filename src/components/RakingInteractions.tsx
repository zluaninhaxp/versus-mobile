import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Sistema global "só um aberto por vez"
let _nextId = 0;
const _listeners: Set<(openedId: number | null) => void> = new Set();
function _broadcast(openedId: number | null) {
  _listeners.forEach((fn) => fn(openedId));
}

const REACTIONS = ["🤩", "😂", "😳", "🥺", "😡"];

export function ReactionSelector({
  onReactionSelect,
  currentReaction,
  isTop3 = false,
}: any) {
  const myIdRef = useRef<number | null>(null);
  if (myIdRef.current === null) myIdRef.current = _nextId++;
  const myId = myIdRef.current;

  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<View>(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // CORREÇÃO DO ERRO TS2345: O retorno do delete é booleano, o React exige void
  useEffect(() => {
    const listener = (openedId: number | null) => {
      if (openedId !== myId) setIsOpen(false);
    };
    _listeners.add(listener);

    return () => {
      _listeners.delete(listener); // Chaves garantem retorno void
    };
  }, [myId]);

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [isOpen]);

  const open = useCallback(() => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setPopoverPos({ x: x + width / 2, y: y + height + 2 });
      setIsOpen(true);
      _broadcast(myId);
    });
  }, [myId]);

  const close = useCallback(() => setIsOpen(false), []);

  const handlePress = useCallback(() => {
    open();
  }, [open]);

  const pick = useCallback(
    (emoji: string) => {
      onReactionSelect?.(emoji);
      close();
    },
    [onReactionSelect, close],
  );

  // --- AJUSTES DE DELICADEZA ---
  const bubbleWidth = 230;
  const bubbleLeft = Math.max(
    10,
    Math.min(popoverPos.x - bubbleWidth / 2, SCREEN_WIDTH - bubbleWidth - 10),
  );
  const tailLeft = popoverPos.x - bubbleLeft - 8;

  return (
    <View ref={buttonRef} collapsable={false}>
      <TouchableOpacity
        style={[
          styles.btn,
          isTop3 && styles.btnTop3,
          currentReaction && styles.btnActive,
        ]}
        onPress={handlePress}
      >
        {currentReaction ? (
          <Text style={styles.emojiActive}>{currentReaction}</Text>
        ) : (
          <Ionicons
            name="happy-outline"
            size={18}
            color={isTop3 ? "rgba(255,255,255,0.85)" : "#6B7D8F"}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={close}
      >
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.bubble,
            {
              top: popoverPos.y,
              left: bubbleLeft,
              width: bubbleWidth,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.tail, { left: tailLeft }]} />
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
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#E1EFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  btnTop3: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "transparent",
  },
  btnActive: { backgroundColor: "#E8F4FF", borderColor: "#4CAFFF" },
  emojiActive: { fontSize: 18 },
  overlay: { flex: 1, backgroundColor: "transparent" },
  bubble: { position: "absolute", alignItems: "flex-start" },
  emojiRow: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 4,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
    marginBottom: -1,
    zIndex: 11,
  },
  emojiBtn: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  emojiBtnSelected: { backgroundColor: "#E8F4FF" },
  emojiText: { fontSize: 22 },
});
