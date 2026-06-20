// // CONVERTED FROM: Select.jsx + Select.css
// // Web: native <select> with CSS chevron
// // RN:  @react-native-picker/picker wrapped in styled View
// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useTranslation } from "react-i18next";
// import { colors, radius, spacing, fontSize } from "../theme";

// export default function Select({
//   label,
//   id,
//   optional  = false,
//   children,
//   value,
//   onValueChange,
//   onChange,
//   style,
//   ...rest
// }) {
//   const { t } = useTranslation();

//   // Support both onValueChange (RN Picker) and onChange (web event style)
//   const handleChange = (val) => {
//     if (onValueChange) onValueChange(val);
//     if (onChange)      onChange({ target: { value: val } });
//   };

//   return (
//     <View style={[s.field, style]}>
//       {label && (
//         <View style={s.labelRow}>
//           <Text style={s.label}>{label}</Text>
//           {optional
//             ? <Text style={s.optional}> ({t("common.optional")})</Text>
//             : <Text style={s.required}>*</Text>
//           }
//         </View>
//       )}
//       <View style={s.pickerWrap}>
//         <Picker
//           selectedValue={value}
//           onValueChange={handleChange}
//           style={s.picker}
//           dropdownIconColor={colors.textMuted}
//           {...rest}
//         >
//           {children}
//         </Picker>
//       </View>
//     </View>
//   );
// }

// // Re-export Picker.Item so callers can do <Select.Item label="..." value="..." />
// Select.Item = Picker.Item;

// const s = StyleSheet.create({
//   field:    { gap: 6 },
//   labelRow: { flexDirection: "row", alignItems: "center" },
//   label:    { fontSize: fontSize.sm, fontWeight: "500", color: colors.text2 },
//   required: { color: "#ef4444", fontSize: 15, fontWeight: "700", marginLeft: 4 },
//   optional: { fontSize: fontSize.sm, fontWeight: "500", color: colors.textMuted },
//   pickerWrap: {
//     borderWidth:     1,
//     borderColor:     colors.borderStrong,
//     borderRadius:    radius.md,
//     backgroundColor: colors.surface,
//     overflow:        "hidden",
//   },
//   picker: {
//     color:  colors.text,
//     height: 44,
//   },
// });


// FIXED: Select.jsx — Picker height and text not cut off
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { colors, radius, spacing, fontSize } from "../theme";

export default function Select({
  label,
  id,
  optional   = false,
  children,
  value,
  onValueChange,
  onChange,
  style,
  enabled = true,
  ...rest
}) {
  const { t } = useTranslation();

  const handleChange = (val) => {
    if (onValueChange) onValueChange(val);
    if (onChange)      onChange({ target: { value: val } });
  };

  return (
    <View style={[s.field, style]}>
      {label && (
        <View style={s.labelRow}>
          <Text style={s.label}>{label}</Text>
          {optional
            ? <Text style={s.optional}> ({t("common.optional")})</Text>
            : <Text style={s.required}>*</Text>
          }
        </View>
      )}
      <View style={[s.pickerWrap, !enabled && s.disabled]}>
        <Picker
          selectedValue={value}
          onValueChange={handleChange}
          enabled={enabled}
          style={s.picker}
          itemStyle={s.pickerItem}
          dropdownIconColor={colors.textMuted}
          mode="dropdown"
          {...rest}
        >
          {children}
        </Picker>
      </View>
    </View>
  );
}

Select.Item = Picker.Item;

const s = StyleSheet.create({
  field:    { gap: 6 },
  labelRow: { flexDirection: "row", alignItems: "center" },
  label:    { fontSize: fontSize.sm, fontWeight: "500", color: colors.text2 },
  required: { color: "#ef4444", fontSize: 15, fontWeight: "700", marginLeft: 4 },
  optional: { fontSize: fontSize.sm, fontWeight: "500", color: colors.textMuted },
  pickerWrap: {
    borderWidth:     1,
    borderColor:     colors.borderStrong,
    borderRadius:    radius.md,
    backgroundColor: colors.surface,
    overflow:        "hidden",
    // Fix Android cut-off: don't set fixed height, let content breathe
    minHeight:       52,
    justifyContent:  "center",
  },
  disabled: { opacity: 0.5 },
  picker: {
    color:   colors.text,
    // Android: height must be larger than content to avoid clipping
    height:  Platform.OS === "android" ? 52 : undefined,
  },
  pickerItem: {
    fontSize: fontSize.sm,
    color:    colors.text,
  },
});