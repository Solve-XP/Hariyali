
import React, { useEffect, useRef, useState, useCallback } from "react";
// Find your existing react-native import and just add Platform to it
import {
  View, Text, TextInput, Image, TouchableOpacity,
  ScrollView, StyleSheet, Platform, ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker   from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";


import Card           from "../Card";
import Input          from "../Input";
import Select         from "../Select";
import Button         from "../Button";
import MapPickerModal from "../MapPickerModal";

import { FarmsService } from "../../services/farmsService";
import { UploadService } from "../../services/uploadService";
import { CropsService }        from "../../services/cropsService";
import { MarketplaceService }  from "../../services/marketplaceService";
import { getCurrentLocation }  from "../../utils/location";
import { reverseGeocode }      from "../../utils/geocoding";
import { useApp }              from "../../context/AppContext";
import { colors, spacing, radius, fontSize } from "../../theme";


import * as ImageManipulator from "expo-image-manipulator";

const UNIT_OPTIONS = ["kg","quintal","ton","bag","crate","piece","other"];

// ── DateField — same as other screens ────────────────────────────────────────
function DateField({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  const dateObj = value ? new Date(value) : new Date();
  return (
    <View style={ds.field}>
      <Text style={ds.label}>{label} <Text style={ds.required}>*</Text></Text>
      <TouchableOpacity style={ds.trigger} onPress={() => setShow(true)}>
        <Text style={[ds.dateText, !value && ds.placeholder]}>{value || "YYYY-MM-DD"}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display={Platform.OS === "android" ? "default" : "spinner"}
          onChange={(_, sel) => {
            setShow(false);
            if (sel) onChange(sel.toISOString().split("T")[0]);
          }}
        />
      )}
    </View>
  );
}

const ds = StyleSheet.create({
  field:       { gap: 6 },
  label:       { fontSize: fontSize.sm, fontWeight: "500", color: colors.text2 },
  required:    { color: "#ef4444" },
  trigger:     { paddingVertical: 9, paddingHorizontal: spacing[3], borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, backgroundColor: colors.surface },
  dateText:    { fontSize: fontSize.sm, color: colors.text },
  placeholder: { color: colors.textFaint },
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ListingForm({ mode = "create" }) {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const route         = useRoute();
  const { pushToast } = useApp();

  const { id } = route.params || {};
  const isEdit = mode === "edit";

  const [loading,      setLoading]      = useState(false);
  const [pageLoading,  setPageLoading]  = useState(isEdit);
  const [farms,        setFarms]        = useState([]);
  const [crops,        setCrops]        = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("kg");
  const [customUnit,   setCustomUnit]   = useState("");
  const [images,       setImages]       = useState([]);        // file-like objects
  const [previewImages,setPreviewImages]= useState([]);        // URI strings
  const [latitude,     setLatitude]     = useState(null);
  const [longitude,    setLongitude]    = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const [form, setForm] = useState({
    quantity: "", unit: "kg", expected_price: "",
    harvest_date: "", village: "", taluka: "", district: "", state: "", description: "",
  });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // ── Load farms ─────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await FarmsService.getAll();
        setFarms(res || []);
      } catch {
        pushToast("Failed to load farms", "error");
      }
    })();
  }, []);

  // ── Auto-fill location on mount ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const loc     = await getCurrentLocation();
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
        const address = await reverseGeocode(loc.latitude, loc.longitude);
        setForm((prev) => ({
          ...prev,
          village:  address.village  || "",
          taluka:   address.taluka   || "",
          district: address.district || "",
          state:    `${address.state || ""} ${address.pincode || ""}`.trim(),
        }));
      } catch {}
    })();
  }, []);

  // ── Load crops when farm changes ───────────────────────────────────────────
  useEffect(() => {
    if (!selectedFarm) return;
    (async () => {
      try {
        const res      = await CropsService.getAll({ farm_id: selectedFarm });
        const filtered = (res || []).filter((c) => c.farm_id === selectedFarm);
        setCrops(filtered);
      } catch {
        pushToast("Failed to load crops", "error");
      }
    })();
  }, [selectedFarm]);

  // ── Load listing for edit mode ─────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        setPageLoading(true);
        const res     = await MarketplaceService.getListingById(id);
        const listing = res?.data;
        if (!listing) return;

        setSelectedFarm(listing.farm_id);
        setSelectedCrop(listing.crop_id);

        const defaultUnits = UNIT_OPTIONS.filter((u) => u !== "other");
        if (defaultUnits.includes(listing.unit)) {
          setSelectedUnit(listing.unit);
        } else {
          setSelectedUnit("other");
          setCustomUnit(listing.unit);
        }

        setForm({
          quantity:       listing.quantity       || "",
          unit:           listing.unit           || "kg",
          expected_price: listing.expected_price || "",
          harvest_date:   listing.harvest_date?.split("T")[0] || "",
          village:        listing.village        || "",
          taluka:         listing.taluka         || "",
          district:       listing.district       || "",
          state:          listing.state          || "",
          description:    listing.description    || "",
        });
        setLatitude(listing.latitude);
        setLongitude(listing.longitude);
        setPreviewImages(listing.crop_images || []);
      } catch {
        pushToast("Failed to load listing", "error");
      } finally {
        setPageLoading(false);
      }
    })();
  }, [id]);

  // ── Unit change ────────────────────────────────────────────────────────────
  const handleUnitChange = (value) => {
    setSelectedUnit(value);
    if (value !== "other") handleChange("unit", value);
  };
  useEffect(() => {
    if (selectedUnit === "other") handleChange("unit", customUnit);
  }, [customUnit]);



  const handleImages = async () => {
    try {
      if (previewImages.length >= 5) {
        pushToast("Maximum 5 images allowed", "error"); return;
      }
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { pushToast("Photo library permission required", "error"); return; }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:              ["images"],   // fixes deprecated warning
        allowsMultipleSelection: true,
        quality:                 1,            // pick full, compress manually below
        selectionLimit:          5 - previewImages.length,
      });

      if (result.canceled) return;

      // ✅ Step 1 — show raw previews IMMEDIATELY, no lag
      const rawUris = result.assets.map((a) => a.uri);
      setPreviewImages((prev) => [...prev, ...rawUris]);
      pushToast("Optimizing images...", "info");

      // ✅ Step 2 — compress in background, UI is already updated
      const compressed = await Promise.all(
        result.assets.map(async (a, index) => {
          const manipulated = await ImageManipulator.manipulateAsync(
            a.uri,
            [{ resize: { width: 1200 } }],          // max 1200px wide like web
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          return {
            uri:  manipulated.uri,
            name: a.fileName || `crop_${Date.now()}_${index}.jpg`,
            type: "image/jpeg",
          };
        })
      );

      // ✅ Step 3 — swap raw previews with compressed URIs silently
      setPreviewImages((prev) => {
        const kept = prev.slice(0, prev.length - rawUris.length);
        return [...kept, ...compressed.map((f) => f.uri)];
      });

      // ✅ Step 4 — store compressed file objects for upload
      setImages((prev) => [...prev, ...compressed]);
      pushToast("Images ready", "success");

    } catch {
      pushToast("Failed to process images", "error");
    }
  };

  const removeImage = (index) => {
    setImages((prev)        => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    if (!selectedFarm)                             { pushToast("Please select farm",           "error"); return false; }
    if (!selectedCrop)                             { pushToast("Please select crop",           "error"); return false; }
    if (!form.quantity)                            { pushToast("Please enter quantity",        "error"); return false; }
    if (!form.expected_price)                      { pushToast("Please enter expected price",  "error"); return false; }
    if (!form.harvest_date)                        { pushToast("Please select harvest date",   "error"); return false; }
    if (selectedUnit === "other" && !customUnit.trim()) { pushToast("Please enter custom unit","error"); return false; }
    return true;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
  if (loading || !validateForm()) return;
  try {
    setLoading(true);
    const farmData = farms.find((f) => f.id === selectedFarm);
    const cropData = crops.find((c) => c.id === selectedCrop);

    if (!isEdit) {    
      const uploadData =
        await UploadService.getUploadUrls(
          "marketplace",
          images
        );


      const imageUrls =
        await UploadService.uploadFilesToS3(
          images,
          uploadData.uploads
        );


      const payload = {
        farm_id: selectedFarm,
        farm_name: farmData?.farm_name || "",
        crop_id: selectedCrop,
        crop_name: cropData?.crop_name || "",
        quantity: Number(form.quantity),
        unit: form.unit,
        expected_price: Number(form.expected_price),
        harvest_date: form.harvest_date,
        village: form.village,
        taluka: form.taluka,
        district: form.district,
        state: form.state,
        latitude,
        longitude,
        description: form.description || "",
        crop_images: imageUrls,
      };

      await MarketplaceService.createListing(
        payload
      );
      pushToast("Listing created successfully", "success");
      navigation.navigate("MarketplaceHome");
      return;
    }

    // Edit — JSON payload
    const payload = {
      farm_id:        selectedFarm,
      farm_name:      farmData?.farm_name || "",
      crop_id:        selectedCrop,
      crop_name:      cropData?.crop_name || "",
      quantity:       Number(form.quantity),
      unit:           form.unit,
      expected_price: Number(form.expected_price),
      harvest_date:   form.harvest_date,
      village:        form.village,
      taluka:         form.taluka,
      district:       form.district,
      state:          form.state,
      latitude,
      longitude,
      description:    form.description || "",
    };
    await MarketplaceService.updateListing(id, payload);
    pushToast("Listing updated successfully", "success");
    navigation.navigate("MarketplaceHome");

  } catch (error) {
    console.log("API Error status:", error?.response?.status);
    console.log("API Error data:",   JSON.stringify(error?.response?.data));
    console.log("API Error message:", error?.message);
    const detail = error?.response?.data?.detail;
    const msg = Array.isArray(detail) ? detail.map((e) => e.msg).join(", ")
              : typeof detail === "string" ? detail
              : isEdit ? "Failed to update listing" : "Failed to create listing";
    pushToast(msg, "error");
  } finally {
    setLoading(false);
  }
};

  if (pageLoading) {
    return <Card style={s.loadingCard}><ActivityIndicator color={colors.primary} /></Card>;
  }

  return (
    <Card>
      <View style={s.form}>

        {/* Farm */}
        <Select label={t("listingForm.farm")} value={selectedFarm} onValueChange={setSelectedFarm}>
          <Select.Item label={t("listingForm.selectFarm")} value="" />
          {farms.map((f) => <Select.Item key={f.id} label={f.farm_name} value={f.id} />)}
        </Select>

        {/* Crop */}
        <Select label={t("listingForm.crop")} value={selectedCrop} onValueChange={setSelectedCrop}>
          <Select.Item label={t("listingForm.selectCrop")} value="" />
          {crops.map((c) => <Select.Item key={c.id} label={c.crop_name} value={c.id} />)}
        </Select>

        {/* Quantity + Unit row — replaces grid-template-columns: 1fr 220px */}
        <View style={s.row}>
          <View style={s.rowFlex}>
            <Input
              label={t("listingForm.quantity")}
              placeholder={t("listingForm.enterQuantity")}
              value={form.quantity}
              onChangeText={(v) => handleChange("quantity", v)}
              type="number"
            />
          </View>
          <View style={s.rowUnit}>
            <Select label={t("listingForm.unit")} value={selectedUnit} onValueChange={handleUnitChange}>
              {UNIT_OPTIONS.map((u) => <Select.Item key={u} label={u} value={u} />)}
            </Select>
          </View>
        </View>

        {selectedUnit === "other" && (
          <Input
            label={t("listingForm.customUnit")}
            placeholder={t("listingForm.customUnitPlaceholder")}
            value={customUnit}
            onChangeText={setCustomUnit}
          />
        )}

        <Input
          label={t("listingForm.expectedPrice")}
          placeholder={t("listingForm.expectedPricePlaceholder")}
          value={form.expected_price}
          onChangeText={(v) => handleChange("expected_price", v)}
          type="number"
        />

        <DateField
          label={t("listingForm.harvestDate")}
          value={form.harvest_date}
          onChange={(v) => handleChange("harvest_date", v)}
        />

        <Input label={t("listingForm.village")}  value={form.village}  onChangeText={(v) => handleChange("village",  v)} placeholder={t("listingForm.enterVillage")} />
        <Input label={t("listingForm.taluka")}   value={form.taluka}   onChangeText={(v) => handleChange("taluka",   v)} placeholder={t("listingForm.enterTaluka")} />
        <Input label={t("listingForm.district")} value={form.district} onChangeText={(v) => handleChange("district", v)} placeholder={t("listingForm.enterDistrict")} />
        <Input label={t("listingForm.statePincode")} value={form.state} onChangeText={(v) => handleChange("state", v)} placeholder={t("listingForm.statePincodePlaceholder")} />

        {/* Map picker */}
        <Card style={s.mapCard}>
          <Text style={s.mapHint}>{t("location.notAtThisLocation")}</Text>
          <Button variant="primary" onPress={() => setShowMapModal(true)}>
            {t("location.selectLocationOnMap")}
          </Button>
        </Card>

        {/* Description textarea — replaces <textarea> */}
        <View style={s.textareaWrap}>
          <Text style={s.textareaLabel}>{t("listingForm.descriptionOptional")}</Text>
          <TextInput
            style={s.textarea}
            multiline
            numberOfLines={4}
            placeholder={t("listingForm.descriptionPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={form.description}
            onChangeText={(v) => handleChange("description", v)}
          />
        </View>

        {/* Image upload */}
        {isEdit ? (
          <View style={s.uploadSection}>
            <Text style={s.uploadTitle}>{t("listingForm.currentImages")}</Text>
            <Text style={s.uploadNote}>{t("listingForm.imagesCannotEdit")}</Text>
            {previewImages.length > 0 ? (
              <View style={s.previewGrid}>
                {previewImages.map((img, i) => (
                  <Image key={i} source={{ uri: img }} style={s.previewImage} resizeMode="cover" />
                ))}
              </View>
            ) : (
              <View style={s.noImagesBox}>
                <Text style={s.noImagesText}>{t("listingForm.noImagesAvailable")}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={s.uploadSection}>
            {/* Upload box — replaces .listing-upload__box dashed border */}
            <TouchableOpacity style={s.uploadBox} onPress={handleImages}>
              <View style={s.uploadIcon}><Text style={s.uploadIconText}>+</Text></View>
              <Text style={s.uploadTitle}>{t("listingForm.uploadCropImages")}</Text>
              <Text style={s.uploadNote}>{t("listingForm.addUpTo5Images")}</Text>
              <Button variant="secondary" onPress={handleImages}>{t("listingForm.chooseImages")}</Button>
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
          </View>
        )}

        <MapPickerModal
          open={showMapModal}
          onClose={() => setShowMapModal(false)}
          latitude={latitude}
          longitude={longitude}
          onConfirm={(loc) => {
            setLatitude(loc.latitude);
            setLongitude(loc.longitude);
            setForm((prev) => ({
              ...prev,
              village:  loc.village  || "",
              taluka:   loc.taluka   || "",
              district: loc.district || "",
              state:    `${loc.state || ""} ${loc.pincode || ""}`.trim(),
            }));
          }}
        />

        <Button onPress={handleSubmit} loading={loading} disabled={loading}>
          {isEdit ? t("listingForm.updateListing") : t("listingForm.createListing")}
        </Button>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  loadingCard: { minHeight: 220, alignItems: "center", justifyContent: "center" },
  form:        { gap: spacing[4] },

  // Quantity + unit row — replaces grid-template-columns: 1fr 220px
  row:         { flexDirection: "row", gap: spacing[3] },
  rowFlex:     { flex: 1 },
  rowUnit:     { width: 140 },

  // Map card
  mapCard: { gap: spacing[3] },
  mapHint: { fontSize: fontSize.sm, color: colors.textMuted },

  // Textarea — replaces <textarea>
  textareaWrap:  { gap: 8 },
  textareaLabel: { fontSize: 14, fontWeight: "600", color: colors.text },
  textarea: {
    minHeight: 100, borderWidth: 1, borderColor: colors.border,
    borderRadius: 16, backgroundColor: colors.surface, color: colors.text,
    padding: 14, fontSize: 14, textAlignVertical: "top",
  },

  // Upload section
  uploadSection: { gap: spacing[4] },
  uploadBox: {
    borderWidth: 2, borderColor: colors.border, borderStyle: "dashed",
    borderRadius: 20, backgroundColor: colors.surface2,
    padding: 24, alignItems: "center", gap: spacing[3],
  },
  uploadIcon:     { width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center" },
  uploadIconText: { fontSize: 28, fontWeight: "700", color: colors.primary },
  uploadTitle:    { fontSize: 16, fontWeight: "700", color: colors.text },
  uploadNote:     { fontSize: 13, color: colors.textMuted, textAlign: "center" },

  // Preview grid — replaces grid auto-fill minmax(180px,1fr) → 2 col
  previewGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  previewCard: { position: "relative", width: "47%", borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  previewImage:{ width: "100%", height: 150 },
  removeBtn:   { position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.72)", alignItems: "center", justifyContent: "center" },
  removeBtnText:{ color: "#fff", fontSize: 20, lineHeight: 24 },

  noImagesBox: { padding: 18, borderWidth: 1, borderColor: colors.border, borderRadius: 16, borderStyle: "dashed", alignItems: "center" },
  noImagesText:{ color: colors.textMuted, fontSize: 14 },
});