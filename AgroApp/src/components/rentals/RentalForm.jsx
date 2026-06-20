// CONVERTED FROM: RentalForm.jsx + RentalForm.css
// browser-image-compression → expo-image-picker (quality: 0.8)
// <input type="file" multiple> → ImagePicker.launchImageLibraryAsync
// e.target.value → direct string via onChangeText
// <textarea> → TextInput multiline
// grid-template-columns: 1fr 1fr → flexDirection row

import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

import * as ImageManipulator from "expo-image-manipulator";

import Card           from "../Card";
import Input          from "../Input";
import Button         from "../Button";
import MapPickerModal from "../MapPickerModal";

import { getCurrentLocation } from "../../utils/location";
import { reverseGeocode }     from "../../utils/geocoding";
import { useApp }             from "../../context/AppContext";
import { colors, spacing, radius, fontSize } from "../../theme";

export default function RentalForm({
  initialValues = {},
  loading       = false,
  mode          = "create",
  onSubmit,
}) {
  const { t }         = useTranslation();
  const { pushToast } = useApp();

  const [form, setForm] = useState({
    equipment_name:   initialValues?.equipment_name   || "",
    price_per_hour:   initialValues?.price_per_hour   || "",
    price_per_day:    initialValues?.price_per_day    || "",
    village:          initialValues?.village          || "",
    taluka:           initialValues?.taluka           || "",
    district:         initialValues?.district         || "",
    state:            initialValues?.state            || "",
    latitude:         initialValues?.latitude  ?? null,
    longitude:        initialValues?.longitude ?? null,
    owner_name:       initialValues?.owner_name       || "",
    phone:            initialValues?.phone            || "",
    description:      initialValues?.description      || "",
    equipment_images: [],
  });

  const [previewImages,    setPreviewImages]    = useState(initialValues?.equipment_images || []);
  const [showLocationModal,setShowLocationModal]= useState(false);
  const [latitude,         setLatitude]         = useState(initialValues?.latitude  ?? null);
  const [longitude,        setLongitude]        = useState(initialValues?.longitude ?? null);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // Auto-fill location on create
  useEffect(() => {
    if (mode === "edit") return;
    (async () => {
      try {
        const loc     = await getCurrentLocation();
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
        const address = await reverseGeocode(loc.latitude, loc.longitude);
        setForm((prev) => ({
          ...prev,
          latitude:  loc.latitude,
          longitude: loc.longitude,
          village:   address.village  || "",
          taluka:    address.taluka   || "",
          district:  address.district || "",
          state:     `${address.state || ""} ${address.pincode || ""}`.trim(),
        }));
      } catch {}
    })();
  }, []);

  // Image picker — replaces <input type="file" multiple> + imageCompression
  // const handleImages = async () => {
  //   try {
  //     if (previewImages.length >= 5) { pushToast("Maximum 5 images allowed", "error"); return; }
  //     const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (!perm.granted) { pushToast("Photo library permission required", "error"); return; }

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes:              ImagePicker.MediaTypeOptions.Images,
  //       allowsMultipleSelection: true,
  //       quality:                 0.8,
  //       selectionLimit:          5 - previewImages.length,
  //     });
  //     if (result.canceled) return;

  //     const newFiles    = result.assets.map((a) => ({ uri: a.uri, name: a.fileName || `equip_${Date.now()}.jpg`, type: a.mimeType || "image/jpeg" }));
  //     const newPreviews = result.assets.map((a) => a.uri);

  //     setPreviewImages((prev) => [...prev, ...newPreviews]);
  //     setForm((prev) => ({ ...prev, equipment_images: [...prev.equipment_images, ...newFiles] }));
  //     pushToast("Images added", "success");
  //   } catch { pushToast("Failed to process images", "error"); }
  // };


const handleImages = async () => {
    try {
      if (previewImages.length >= 5) { pushToast("Maximum 5 images allowed", "error"); return; }
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { pushToast("Photo library permission required", "error"); return; }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:              ["images"],
        allowsMultipleSelection: true,
        quality:                 1,
        selectionLimit:          5 - previewImages.length,
      });
      if (result.canceled) return;

      // Show immediately — no lag
      const rawUris = result.assets.map((a) => a.uri);
      setPreviewImages((prev) => [...prev, ...rawUris]);
      pushToast("Optimizing images...", "info");

      // Compress in background
      const compressed = await Promise.all(
        result.assets.map(async (a, index) => {
          const manipulated = await ImageManipulator.manipulateAsync(
            a.uri,
            [{ resize: { width: 1200 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          return {
            uri:  manipulated.uri,
            name: a.fileName || `equip_${Date.now()}_${index}.jpg`,
            type: "image/jpeg",
          };
        })
      );

      // Swap raw previews with compressed
      setPreviewImages((prev) => {
        const kept = prev.slice(0, prev.length - rawUris.length);
        return [...kept, ...compressed.map((f) => f.uri)];
      });
      setForm((prev) => ({
        ...prev,
        equipment_images: [...prev.equipment_images, ...compressed],
      }));
      pushToast("Images ready", "success");
    } catch { pushToast("Failed to process images", "error"); }
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setForm((prev)  => ({ ...prev, equipment_images: prev.equipment_images.filter((_, i) => i !== index) }));
  };

  // Submit — replaces <form onSubmit>
  const handleSubmit = () => {
    const isValidPhone = /^[6-9]\d{9}$/.test(form.phone);
    if (!isValidPhone) { pushToast("Please enter valid 10-digit mobile number", "error"); return; }
    onSubmit?.(form);
  };

  return (
    <View style={s.form}>

      {/* Equipment section */}
      <Card style={s.section}>
        <Text style={s.sectionTitle}>{t("rentalForm.equipmentInfo")}</Text>
        <Input
          label={t("rentalForm.equipmentName")}
          placeholder={t("rentalForm.equipmentPlaceholder")}
          value={form.equipment_name}
          onChangeText={(v) => handleChange("equipment_name", v)}
        />
        {/* Price row — replaces grid-template-columns: 1fr 1fr */}
        <View style={s.row}>
          <View style={s.rowCol}>
            <Input
              label={t("rentalForm.hourlyPrice")} optional
              placeholder={t("rentalForm.hourlyPricePlaceholder")}
              type="number"
              value={String(form.price_per_hour)}
              onChangeText={(v) => handleChange("price_per_hour", v)}
            />
          </View>
          <View style={s.rowCol}>
            <Input
              label={t("rentalForm.dailyPrice")} optional
              placeholder={t("rentalForm.dailyPricePlaceholder")}
              type="number"
              value={String(form.price_per_day)}
              onChangeText={(v) => handleChange("price_per_day", v)}
            />
          </View>
        </View>
      </Card>

      {/* Location section */}
      <Card style={s.section}>
        <Text style={s.sectionTitle}>{t("listingDetails.location")}</Text>
        <View style={s.row}>
          <View style={s.rowCol}>
            <Input label={t("listingDetails.village")}  placeholder={t("rentalForm.villagePlaceholder")}  value={form.village}  onChangeText={(v) => handleChange("village",  v)} />
          </View>
          <View style={s.rowCol}>
            <Input label={t("listingDetails.taluka")}   placeholder={t("rentalForm.talukaPlaceholder")}   value={form.taluka}   onChangeText={(v) => handleChange("taluka",   v)} />
          </View>
        </View>
        <View style={s.row}>
          <View style={s.rowCol}>
            <Input label={t("listingDetails.district")} placeholder={t("rentalForm.districtPlaceholder")} value={form.district} onChangeText={(v) => handleChange("district", v)} />
          </View>
          <View style={s.rowCol}>
            <Input label={t("rentalForm.statePincode")} placeholder={t("rentalForm.statePincodePlaceholder")} value={form.state} onChangeText={(v) => handleChange("state", v)} />
          </View>
        </View>
        <Card style={s.mapCard}>
          <Text style={s.mapHint}>{t("location.notAtThisLocation")}</Text>
          <Button variant="primary" onPress={() => setShowLocationModal(true)}>
            {t("location.selectLocationOnMap")}
          </Button>
        </Card>
      </Card>

      {/* Owner section */}
      <Card style={s.section}>
        <Text style={s.sectionTitle}>{t("rentalForm.ownerDetails")}</Text>
        <View style={s.row}>
          <View style={s.rowCol}>
            <Input label={t("rentalForm.ownerName")} placeholder={t("rentalForm.ownerPlaceholder")} value={form.owner_name} onChangeText={(v) => handleChange("owner_name", v)} />
          </View>
          <View style={s.rowCol}>
            <Input
              label={t("rentalForm.phoneNumber")}
              placeholder={t("rentalForm.phonePlaceholder")}
              type="tel"
              value={form.phone}
              onChangeText={(v) => {
                const digits = v.replace(/\D/g, "");
                if (digits.length <= 10) handleChange("phone", digits);
              }}
            />
          </View>
        </View>
      </Card>

      {/* Description */}
      <Card style={s.section}>
        <Text style={s.sectionTitle}>
          {t("listingDetails.description")}
          <Text style={s.optional}> ({t("common.optional")})</Text>
        </Text>
        <TextInput
          style={s.textarea}
          multiline
          numberOfLines={5}
          placeholder={t("rentalForm.descriptionPlaceholder")}
          placeholderTextColor={colors.textMuted}
          value={form.description}
          onChangeText={(v) => handleChange("description", v)}
          textAlignVertical="top"
        />
      </Card>

      {/* Images */}
      <Card style={s.section}>
        <Text style={s.sectionTitle}>{t("rentalForm.equipmentImages")}</Text>

        {mode === "edit" ? (
          <>
            {previewImages.length > 0 && (
              <View style={s.previewGrid}>
                {previewImages.map((img, i) => (
                  <Image key={i} source={{ uri: img }} style={s.previewImage} resizeMode="cover" />
                ))}
              </View>
            )}
            <Text style={s.imageNote}>{t("rentalForm.imageEditNotSupported")}</Text>
          </>
        ) : (
          <>
            {/* Upload box — replaces .rental-upload-box dashed border */}
            <TouchableOpacity style={s.uploadBox} onPress={handleImages}>
              <View style={s.uploadIcon}><Text style={s.uploadIconText}>+</Text></View>
              <Text style={s.uploadTitle}>{t("rentalForm.uploadEquipmentImages")}</Text>
              <Text style={s.uploadNote}>{t("rentalForm.addUpTo5Images")}</Text>
              <Button variant="secondary" onPress={handleImages} style={s.uploadBtn}>
                {t("rentalForm.chooseImages")}
              </Button>
            </TouchableOpacity>

            {previewImages.length > 0 && (
              <View style={s.previewGrid}>
                {previewImages.map((img, i) => (
                  <View key={i} style={s.previewCard}>
                    <Image source={{ uri: img }} style={s.previewImage} resizeMode="cover" />
                    <TouchableOpacity style={s.removeBtn} onPress={() => removeImage(i)}>
                      <Text style={s.removeBtnText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </Card>

      <Button onPress={handleSubmit} loading={loading} disabled={loading}>
        {loading
          ? t("rentalForm.saving")
          : mode === "edit" ? t("rentalForm.updateRental") : t("rentalForm.createRental")}
      </Button>

      <MapPickerModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        latitude={latitude}
        longitude={longitude}
        onConfirm={(loc) => {
          setLatitude(loc.latitude);
          setLongitude(loc.longitude);
          setForm((prev) => ({
            ...prev,
            latitude:  loc.latitude,
            longitude: loc.longitude,
            village:   loc.village  || "",
            taluka:    loc.taluka   || "",
            district:  loc.district || "",
            state:     `${loc.state || ""} ${loc.pincode || ""}`.trim(),
          }));
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  form:    { gap: spacing[4] },
  section: { gap: spacing[4] },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  optional:     { fontSize: 13, fontWeight: "500", color: colors.textMuted },

  // Row — replaces grid-template-columns: 1fr 1fr
  row:    { flexDirection: "row", gap: spacing[3] },
  rowCol: { flex: 1 },

  mapCard: { gap: spacing[3] },
  mapHint: { fontSize: fontSize.sm, color: colors.textMuted },

  // Textarea
  textarea: {
    minHeight: 120, borderWidth: 1, borderColor: colors.border,
    borderRadius: 18, backgroundColor: colors.surface,
    padding: 14, fontSize: 15, color: colors.text,
  },
  imageNote: { fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing[2] },

  // Upload box
  uploadBox: {
    borderWidth: 2, borderColor: colors.border, borderStyle: "dashed",
    borderRadius: 28, backgroundColor: colors.surface2,
    alignItems: "center", justifyContent: "center",
    minHeight: 220, padding: spacing[5], gap: spacing[3],
  },
  uploadIcon:     { width: 72, height: 72, borderRadius: 36, backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center" },
  uploadIconText: { fontSize: 36, fontWeight: "500", color: colors.success },
  uploadTitle:    { fontSize: 20, fontWeight: "700", color: colors.text },
  uploadNote:     { fontSize: 15, color: colors.textMuted, textAlign: "center" },
  uploadBtn:      { marginTop: spacing[2] },

  // Preview grid — replaces grid auto-fill minmax(160px,1fr) → 2 col
  previewGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: spacing[4] },
  previewCard: { position: "relative", width: "47%", aspectRatio: 1, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  previewImage:{ width: "100%", height: "100%" },
  removeBtn:   { position: "absolute", top: 8, right: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(0,0,0,0.75)", alignItems: "center", justifyContent: "center" },
  removeBtnText:{ color: "#fff", fontSize: 20, lineHeight: 24 },
});