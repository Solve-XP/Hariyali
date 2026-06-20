// CONVERTED FROM: ImageCarousel.jsx + ImageCarousel.css
// Web: <img src> with prev/next buttons
// RN:  ScrollView horizontal with FlatList or manual index — same props interface
import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, ScrollView, StyleSheet } from "react-native";
import { colors, radius } from "../theme";

const PLACEHOLDER = "https://placehold.co/600x400?text=No+Image";

export default function ImageCarousel({ images = [], height = 220, showThumbnails = false, onImageClick }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safe = images?.length ? images : [PLACEHOLDER];
  const current = safe[activeIndex];

  const goPrev = () => setActiveIndex((i) => (i === 0 ? safe.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === safe.length - 1 ? 0 : i + 1));

  return (
    <View style={[s.wrap, { height }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onImageClick?.(current)} style={s.imageWrap}>
        <Image source={{ uri: current }} style={s.image} resizeMode="cover" />
      </TouchableOpacity>

      {safe.length > 1 && (
        <>
          <TouchableOpacity style={[s.arrow, s.arrowLeft]}  onPress={goPrev}><Text style={s.arrowText}>‹</Text></TouchableOpacity>
          <TouchableOpacity style={[s.arrow, s.arrowRight]} onPress={goNext}><Text style={s.arrowText}>›</Text></TouchableOpacity>
          <View style={s.counter}>
            <Text style={s.counterText}>{activeIndex + 1}/{safe.length}</Text>
          </View>
        </>
      )}

      {showThumbnails && safe.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.thumbs} contentContainerStyle={s.thumbsContent}>
          {safe.map((img, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveIndex(i)}>
              <Image source={{ uri: img }} style={[s.thumb, i === activeIndex && s.thumbActive]} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:      { position: "relative", width: "100%", borderRadius: radius.xl, overflow: "hidden", backgroundColor: colors.surface2 },
  imageWrap: { flex: 1 },
  image:     { width: "100%", height: "100%" },
  arrow: {
    position:        "absolute",
    top:             "50%",
    transform:       [{ translateY: -17 }],
    width:           34,
    height:          34,
    borderRadius:    17,
    backgroundColor: "rgba(15,23,42,0.45)",
    alignItems:      "center",
    justifyContent:  "center",
    zIndex:          2,
  },
  arrowLeft:  { left: 10 },
  arrowRight: { right: 10 },
  arrowText:  { color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 26 },
  counter: {
    position:        "absolute",
    bottom:          10,
    right:           10,
    paddingVertical:  4,
    paddingHorizontal:10,
    borderRadius:    999,
    backgroundColor: "rgba(15,23,42,0.6)",
    zIndex:          2,
  },
  counterText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  thumbs:        { backgroundColor: colors.surface },
  thumbsContent: { padding: 10, gap: 10, flexDirection: "row" },
  thumb:         { width: 58, height: 58, borderRadius: radius.lg, borderWidth: 2, borderColor: "transparent" },
  thumbActive:   { borderColor: colors.primary },
});
