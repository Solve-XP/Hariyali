// // CONVERTED FROM: ToastStack.jsx + ToastStack.css
// // Web: position:fixed bottom-right
// // RN:  position:absolute bottom — same visual result
// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { useApp } from "../context/AppContext";
// import { colors, radius, fontSize, spacing, shadows } from "../theme";

// const VARIANTS = {
//   success: { border: colors.success },
//   error:   { border: colors.error },
//   info:    { border: colors.info },
//   warning: { border: colors.warning },
// };

// function Toast({ toast }) {
//   const v = VARIANTS[toast.variant] || VARIANTS.info;
//   return (
//     <View style={[s.toast, { borderLeftColor: v.border }]}>
//       <Text style={s.message}>{toast.message}</Text>
//     </View>
//   );
// }

// export default function ToastStack() {
  
//   const { toasts } = useApp();
//   if (!toasts.length) return null;
//   return (
//     <View style={s.stack} pointerEvents="none">
//       {/* {toasts.map((t) => <Toast key={t.id} toast={t} />)} */}
//       {Array.from(
//   new Map(
//     toasts.map((t) => [
//       t.message,
//       t,
//     ])
//   ).values()
// ).map((t) => (
//   <Toast
//     key={t.id}
//     toast={t}
//   />
// ))}
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   stack: {
//     position: "absolute",
//     bottom:   80,
//     left:     spacing[4],
//     right:    spacing[4],
//     gap:      spacing[2],
//     zIndex:   9999,
//   },
//   toast: {
//     backgroundColor: colors.surface,
//     borderWidth:     1,
//     borderColor:     colors.border,
//     borderLeftWidth: 3,
//     borderRadius:    radius.md,
//     paddingVertical:  12,
//     paddingHorizontal: spacing[4],
//     ...shadows.lg,
//   },
//   message: {
//     fontSize:   fontSize.sm,
//     fontWeight: "500",
//     color:      colors.text,
//   },
// });



import React, {
  useRef,
} from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import {
  useApp,
} from "../context/AppContext";

import {
  colors,
  radius,
  fontSize,
  spacing,
  shadows,
} from "../theme";

const VARIANTS = {
  success: {
    border:
      colors.success,
  },

  error: {
    border:
      colors.error,
  },

  info: {
    border:
      colors.info,
  },

  warning: {
    border:
      colors.warning,
  },
};

let rendered =
  false;

function Toast({
  toast,
}) {
  const variant =
    VARIANTS[
      toast.variant
    ] ||
    VARIANTS.info;

  return (
    <View
      style={[
        s.toast,
        {
          borderLeftColor:
            variant.border,
        },
      ]}
    >
      <Text
        style={
          s.message
        }
      >
        {
          toast.message
        }
      </Text>
    </View>
  );
}

export default function ToastStack() {

  const mounted =
    useRef(false);

  if (
    rendered &&
    !mounted.current
  ) {
    return null;
  }

  mounted.current =
    true;

  rendered = true;

  const {
    toasts,
  } = useApp();

  if (
    !toasts.length
  )
    return null;

  return (
    <View
      style={
        s.stack
      }
      pointerEvents="none"
    >
      {toasts.map(
        (t) => (
          <Toast
            key={t.id}
            toast={t}
          />
        )
      )}
    </View>
  );
}

const s =
  StyleSheet.create({
    stack: {
      position:
        "absolute",

      top: 60,

      left:
        spacing[4],

      right:
        spacing[4],

      gap:
        spacing[2],

      zIndex:
        999999,
    },

    toast: {
      backgroundColor:
        colors.surface,

      borderWidth:
        1,

      borderColor:
        colors.border,

      borderLeftWidth:
        4,

      borderRadius:
        radius.md,

      paddingVertical:
        12,

      paddingHorizontal:
        spacing[4],

      ...shadows.lg,
    },

    message: {
      fontSize:
        fontSize.sm,

      fontWeight:
        "600",

      color:
        colors.text,
    },
  });