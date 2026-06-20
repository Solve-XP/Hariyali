// // CONVERTED FROM: Modal.jsx + Modal.css
// // Web: position:fixed overlay with div
// // RN:  React Native Modal component — same props interface
// import React from "react";
// import { View, Text, TouchableOpacity, Modal as RNModal, ScrollView, StyleSheet } from "react-native";
// import { colors, radius, spacing, fontSize, shadows } from "../theme";

// export default function Modal({ open, title, children, onClose }) {
//   return (
//     <RNModal
//       visible={!!open}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//       statusBarTranslucent
//     >
//       {/* Overlay — replaces rgba(15,23,42,0.55) backdrop */}
//       <TouchableOpacity
//         style={s.overlay}
//         activeOpacity={1}
//         onPress={onClose}
//       >
//         {/* Stop propagation equivalent — inner press doesn't close */}
//         <TouchableOpacity activeOpacity={1} style={s.modal}>

//           {/* Header */}
//           <View style={s.header}>
//             <Text style={s.title}>{title}</Text>
//             <TouchableOpacity style={s.closeBtn} onPress={onClose}>
//               <Text style={s.closeX}>×</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Body */}
//           <ScrollView
//             style={s.body}
//             contentContainerStyle={s.bodyContent}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//           >
//             {children}
//           </ScrollView>

//         </TouchableOpacity>
//       </TouchableOpacity>
//     </RNModal>
//   );
// }

// const s = StyleSheet.create({
//   overlay: {
//     flex:            1,
//     backgroundColor: "rgba(15,23,42,0.55)",
//     alignItems:      "center",
//     justifyContent:  "flex-start",
//     padding:         spacing[4],
//     paddingTop:      60,
//   },
//   modal: {
//     width:           "100%",
//     maxHeight:       "90%",
//     backgroundColor: colors.surface,
//     borderWidth:     1,
//     borderColor:     colors.border,
//     borderRadius:    radius.xl,
//     ...shadows.xl,
//   },
//   header: {
//     flexDirection:   "row",
//     alignItems:      "center",
//     justifyContent:  "space-between",
//     gap:             spacing[3],
//     padding:         spacing[5],
//     paddingBottom:   spacing[3],
//     borderBottomWidth: 1,
//     borderBottomColor: colors.divider,
//   },
//   title: {
//     fontSize:      fontSize.lg,
//     fontWeight:    "600",
//     color:         colors.text,
//     letterSpacing: -0.2,
//     flex:          1,
//   },
//   closeBtn: {
//     width:           40,
//     height:          40,
//     borderRadius:    radius.pill,
//     alignItems:      "center",
//     justifyContent:  "center",
//     backgroundColor: "transparent",
//   },
//   closeX: {
//     fontSize: 26,
//     color:    colors.textMuted,
//     lineHeight:30,
//   },
//   body: { flex: 1 },
//   bodyContent: {
//     padding: spacing[5],
//   },
// });


import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

import {
  colors,
  radius,
  spacing,
  fontSize,
  shadows,
} from "../theme";

export default function Modal({
  open,
  title,
  children,
  onClose,
}) {

  return (
    <RNModal
      visible={open}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.modal}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>
              {title}
            </Text>

            <TouchableOpacity
              onPress={onClose}
              style={s.closeBtn}
            >
              <Text style={s.closeX}>
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={s.body}
            contentContainerStyle={s.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modal: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    ...shadows?.xl,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  title: {
    flex: 1,
    fontSize: fontSize?.lg || 18,
    fontWeight: "600",
    color: colors?.text || "#000",
  },

  closeBtn: {
    padding: 8,
  },

  closeX: {
    fontSize: 26,
  },

  body: {
    flexGrow: 0,
  },

  bodyContent: {
    padding: 20,
  },
});