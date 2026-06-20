// CONVERTED FROM: ConfirmDialog.jsx + ConfirmDialog.css
// Web: position:fixed overlay + div dialog
// RN:  Modal component with same layout
import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Button from "./Button";
import { colors, radius, spacing, fontSize, shadows } from "../theme";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText  = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal visible={!!open} transparent animationType="fade" onRequestClose={onCancel}>
      {/* Overlay — replaces position:fixed inset:0 rgba(15,23,42,0.55) */}
      <View style={s.overlay}>
        <View style={s.dialog}>
          <Text style={s.title}>{title}</Text>
          <Text style={s.message}>{message}</Text>

          {/* Actions — replaces .confirm-actions flex justify-content:flex-end */}
          <View style={s.actions}>
            <Button
              variant="secondary"
              onPress={onCancel}
              disabled={loading}
              style={s.actionBtn}
            >
              {cancelText}
            </Button>
            <Button
              variant="danger"
              onPress={onConfirm}
              disabled={loading}
              loading={loading}
              style={s.actionBtn}
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: "rgba(15,23,42,0.55)",
    alignItems:      "center",
    justifyContent:  "center",
    padding:         spacing[4],
  },
  dialog: {
    width:           "100%",
    maxWidth:        420,
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    radius.xl,
    padding:         spacing[5],
    gap:             spacing[3],
    ...shadows.xl,
  },
  title: {
    fontSize:      fontSize.lg,
    fontWeight:    "700",
    color:         colors.text,
    letterSpacing: -0.2,
  },
  message: {
    fontSize:   fontSize.base,
    lineHeight: fontSize.base * 1.6,
    color:      colors.textMuted,
  },
  actions: {
    flexDirection:  "row",
    justifyContent: "flex-end",
    gap:            spacing[3],
    marginTop:      spacing[2],
    paddingTop:     spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  actionBtn: {
    minWidth: 90,
  },
});
