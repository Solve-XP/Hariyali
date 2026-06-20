// CONVERTED FROM: ImageViewer.jsx + ImageViewer.css
// Web: position:fixed overlay with <img>
// RN:  Modal with Image — tap overlay to close
import React from "react";
import { Modal, View, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ImageViewer({ image, onClose }) {
  return (
    <Modal visible={!!image} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <View style={s.modal}>
          <Image source={{ uri: image }} style={s.image} resizeMode="contain" />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: "rgba(15,23,42,0.82)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  modal: { width: "90%", maxWidth: 950 },
  image: { width: "100%", height: undefined, aspectRatio: 4 / 3, borderRadius: 18 },
});
