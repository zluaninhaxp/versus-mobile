// Este arquivo já está correto! Não precisa de alterações
import React, { useRef, useEffect, useState, ReactNode } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
  backgroundColor?: string;
  dragHandleColor?: string;
}

export function BottomSheetModal({
  visible,
  onClose,
  children,
  height = 0.75,
  backgroundColor = "white",
  dragHandleColor = "#CBD5E1",
}: BottomSheetModalProps) {
  const SHEET_HEIGHT = screenHeight * height;
  const [showModal, setShowModal] = useState(visible);
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    } else {
      handleClose();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    }),
  ).current;

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      onRequestClose={handleClose}
      animationType="none"
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            {
              height: SHEET_HEIGHT,
              backgroundColor,
              transform: [{ translateY }],
            },
          ]}
        >
          <View
            {...panResponder.panHandlers}
            style={styles.invisibleDragShield}
          />

          <View style={styles.dragArea}>
            <View
              style={[styles.dragHandle, { backgroundColor: dragHandleColor }]}
            />
          </View>

          {children}

          <View style={[styles.bottomFill, { backgroundColor }]} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  invisibleDragShield: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "transparent",
    zIndex: 9999,
  },
  dragArea: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  bottomFill: {
    position: "absolute",
    bottom: -100,
    left: 0,
    right: 0,
    height: 100,
  },
});
