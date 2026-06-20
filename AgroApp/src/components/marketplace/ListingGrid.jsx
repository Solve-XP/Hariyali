// CONVERTED FROM: ListingGrid.jsx + ListingGrid.css
// CSS auto-fill grid → FlatList 1-col (mobile is always 1 col)
import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useApp }            from "../../context/AppContext";
import { calculateDistance } from "../../utils/location";
import ListingCard           from "./ListingCard";
import { spacing }           from "../../theme";

export default function ListingGrid({
  listings    = [],
  isOwner     = false,
  type        = "marketplace",
  showDistance = false,
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}) {
  const { userLocation } = useApp();
  if (!listings?.length) return null;

  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.grid}
      scrollEnabled={false}       // parent ScrollView handles scrolling
      renderItem={({ item: listing }) => {
        let distance = null;
        if (
          showDistance &&
          userLocation?.latitude && userLocation?.longitude &&
          listing?.latitude     && listing?.longitude
        ) {
          distance = calculateDistance(
            userLocation.latitude, userLocation.longitude,
            listing.latitude,      listing.longitude
          );
        }
        return (
          <ListingCard
            listing={listing}
            distance={distance}
            type={type}
            isOwner={isOwner}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onImageClick={onImageClick}
          />
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  grid: { gap: 14, paddingBottom: spacing[4] },  
});