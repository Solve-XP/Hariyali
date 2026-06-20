import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme";
export default function AdminDashboardScreen() {
  return (
    <View style={s.c}><Text style={s.t}>AdminDashboardScreen</Text><Text style={s.sub}>Placeholder — to be converted</Text></View>
  );
}
const s = StyleSheet.create({ c: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor: colors.background }, t: { fontSize:20, fontWeight:"700", color: colors.textPrimary }, sub: { fontSize:13, color: colors.textSecondary, marginTop:8 } });
