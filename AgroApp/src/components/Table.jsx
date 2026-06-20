// CONVERTED FROM: Table.jsx + Table.css
// Web: <table> with thead/tbody
// RN:  ScrollView with View rows — same columns/rows/render interface
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { colors, radius, spacing, fontSize } from "../theme";

export default function Table({ columns, rows, emptyMessage, rowKey }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.scroll}>
      <View style={s.wrap}>
        {/* Header row */}
        <View style={[s.row, s.headerRow]}>
          {columns.map((c) => (
            <View key={c.key} style={[s.cell, c.width ? { width: c.width } : s.flexCell]}>
              <Text style={s.th}>{c.header}</Text>
            </View>
          ))}
        </View>

        {/* Data rows */}
        {rows.length === 0 ? (
          <View style={s.emptyRow}>
            <Text style={s.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          rows.map((row) => (
            <View key={rowKey(row)} style={s.row}>
              {columns.map((c) => (
                <View key={c.key} style={[s.cell, c.width ? { width: c.width } : s.flexCell]}>
                  {typeof c.render(row) === "string" || typeof c.render(row) === "number"
                    ? <Text style={s.td}>{c.render(row)}</Text>
                    : c.render(row)
                  }
                </View>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { width: "100%" },
  wrap: {
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    radius.md,
    overflow:        "hidden",
  },
  headerRow: {
    backgroundColor: colors.surface2,
  },
  row: {
    flexDirection:   "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cell: {
    padding:      12,
    paddingHorizontal: spacing[4],
    justifyContent:"center",
    minWidth:      80,
  },
  flexCell: { flex: 1 },
  th: {
    fontSize:      11,
    fontWeight:    "600",
    color:         colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  td: {
    fontSize: fontSize.sm,
    color:    colors.text,
  },
  emptyRow: {
    padding:    spacing[7],
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSize.sm,
    color:    colors.textMuted,
    textAlign:"center",
  },
});
