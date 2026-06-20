// CONVERTED FROM: ListingImageSlider.jsx + ListingImageSlider.css
// Web: <img> + CSS gallery — RN: Image + ScrollView thumbs
import React, { useEffect, useMemo, useState } from "react";
import { View, Image, TouchableOpacity, ScrollView, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, radius, spacing } from "../../theme";

export default function ListingImageSlider({ images = [] }) {
  const { t } = useTranslation();
  const validImages = useMemo(() => images.filter(Boolean), [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => { setSelectedIndex(0); }, [images]);

  const selectedImage = validImages[selectedIndex];

  if (!validImages.length) {
    return (
      <View style={s.emptyWrap}>
        <Text style={s.emptyIcon}>🖼️</Text>
        <Text style={s.emptyTitle}>{t("listingImage.noImagesAvailable")}</Text>
        <Text style={s.emptyText}>{t("listingImage.sellerNoImages")}</Text>
      </View>
    );
  }

  return (
    <View style={s.gallery}>
      {/* Main image — replaces .listing-gallery__main 500px height */}
      <View style={s.mainWrap}>
        <Image source={{ uri: selectedImage }} style={s.mainImage} resizeMode="contain" />
      </View>

      {/* Thumbnails — replaces .listing-gallery__thumbs horizontal scroll */}
      {validImages.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.thumbsContent}>
          {validImages.map((img, index) => (
            <TouchableOpacity
              key={index}
              style={[s.thumb, index === selectedIndex && s.thumbActive]}
              onPress={() => setSelectedIndex(index)}
            >
              <Image source={{ uri: img }} style={s.thumbImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  gallery: { gap: 14 },

  // Main image — replaces .listing-gallery__main height:300px on mobile
  mainWrap: {
    width:           "100%",
    height:          300,
    borderRadius:    20,
    overflow:        "hidden",
    backgroundColor: colors.surface2,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  mainImage: { width: "100%", height: "100%" },

  // Thumbnails
  thumbsContent: { paddingVertical: 6, gap: 10, flexDirection: "row" },
  thumb: {
    width:           70,
    height:          70,
    borderRadius:    14,
    overflow:        "hidden",
    borderWidth:     2,
    borderColor:     "transparent",
    backgroundColor: colors.surface,
  },
  thumbActive: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbImage: { width: "100%", height: "100%" },

  // Empty state
  emptyWrap: {
    height:          300,
    borderRadius:    20,
    borderWidth:     1,
    borderColor:     colors.border,
    backgroundColor: colors.surface,
    alignItems:      "center",
    justifyContent:  "center",
    padding:         spacing[5],
    gap:             spacing[3],
  },
  emptyIcon:  { fontSize: 42 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: colors.text, textAlign: "center" },
  emptyText:  { fontSize: 14, color: colors.textMuted, textAlign: "center" },
});