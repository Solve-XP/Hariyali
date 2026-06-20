// CONVERTED FROM: ListingSkeleton.jsx + ListingSkeleton.css
// CSS shimmer animation → Animated API loop
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

function SkeletonBox({ style }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 700,  useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 700,  useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  return <Animated.View style={[s.shimmer, { opacity }, style]} />;
}

function SkeletonCard() {
  return (
    <View style={s.card}>
      <SkeletonBox style={s.image} />
      <View style={s.body}>
        <SkeletonBox style={s.title} />
        <SkeletonBox style={s.subtitle} />
        <View style={s.metaRow}>
          <SkeletonBox style={s.box} />
          <SkeletonBox style={s.box} />
        </View>
        <SkeletonBox style={s.location} />
        <View style={s.actionsRow}>
          <SkeletonBox style={s.btn} />
          <SkeletonBox style={s.btn} />
        </View>
      </View>
    </View>
  );
}

export default function ListingSkeleton({ count = 4 }) {
  return (
    <View style={s.grid}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </View>
  );
}

const s = StyleSheet.create({
  grid:     { gap: 14 },
  card:     { borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: "hidden" },
  shimmer:  { backgroundColor: colors.surface2 },
  image:    { height: 180 },
  body:     { padding: 16, gap: 14 },
  title:    { height: 24, width: "70%", borderRadius: 8 },
  subtitle: { height: 14, width: "45%", borderRadius: 8 },
  metaRow:  { flexDirection: "row", gap: 10 },
  box:      { flex: 1, height: 62, borderRadius: 14 },
  location: { height: 40, borderRadius: 12 },
  actionsRow:{ flexDirection: "row", gap: 10 },
  btn:      { flex: 1, height: 42, borderRadius: 12 },
});