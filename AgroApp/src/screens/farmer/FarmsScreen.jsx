import React, { useEffect, useMemo, useState, useCallback } from "react";

import * as ImageManipulator from "expo-image-manipulator";

import {
  View, Text, Image, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Platform,
} from "react-native";
import * as ImagePicker    from "expo-image-picker";

import { useTranslation }  from "react-i18next";

import ScreenShell   from "../../components/ScreenShell";
import Card          from "../../components/Card";
import Button        from "../../components/Button";
import EmptyState    from "../../components/EmptyState";
import Input         from "../../components/Input";
import Select        from "../../components/Select";
import Modal         from "../../components/Modal";
import SearchInput   from "../../components/SearchInput";
import ImageViewer   from "../../components/ImageViewer";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader    from "../../components/PageHeader";

import {
  IconFarm, IconPlus, IconTrash, IconEdit, IconLocation, IconSoil, IconField,
} from "../../components/Icons";

import { FarmsService } from "../../services/farmsService";
import { UploadService } from "../../services/uploadService";
import { useApp }           from "../../context/AppContext";
import { getErrorMessage }  from "../../utils/errorHandler";
import { validateRequired } from "../../utils/validators";
import { colors, spacing, radius, fontSize } from "../../theme";

const EMPTY_FORM = {
  farm_name:  "",
  acres:      "",
  location:   "",
  soil_type:  "",
  farm_photo: null,
};

const SOIL_TYPES = [
  "black", "red", "laterite", "alluvial",
  "sandy", "clay", "loamy", "mixed", "other",
];

const STAT_CARDS = [
  { key: "totalFarms", titleKey: "farms.stats.total_farms", subtitleKey: "farms.stats.farms_added",          icon: IconFarm,     variant: "success" },
  { key: "totalAcres", titleKey: "farms.stats.total_acres", subtitleKey: "farms.stats.acres_land",           icon: IconField,    variant: "warning" },
  { key: "soilTypes",  titleKey: "farms.stats.soil_types",  subtitleKey: "farms.stats.different_soil_types", icon: IconSoil,     variant: "purple"  },
  { key: "locations",  titleKey: "farms.stats.locations",   subtitleKey: "farms.stats.unique_locations",     icon: IconLocation, variant: "info"    },
];

const ICON_COLORS = {
  success: { bg: colors.successBg, color: colors.success },
  warning: { bg: colors.warningBg, color: colors.warning },
  purple:  { bg: colors.purpleBg,  color: colors.purple  },
  info:    { bg: colors.infoBg,    color: colors.info    },
};

export default function FarmsScreen() {
  const { t }         = useTranslation();
  const { pushToast } = useApp();

  const [farms,            setFarms]            = useState([]);
  const [loading,          setLoading]          = useState(false);
  const [search,           setSearch]           = useState("");
  const [showModal,        setShowModal]        = useState(false);
  const [editingFarm,      setEditingFarm]      = useState(null);
  const [imageViewer,      setImageViewer]      = useState("");
  const [uploadPreview,    setUploadPreview]    = useState("");
  const [form,             setForm]             = useState(EMPTY_FORM);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFarmId,   setSelectedFarmId]   = useState(null);
  const [deleteLoading,    setDeleteLoading]    = useState(false);

  const loadFarms = useCallback(
    async (searchText = "") => {

      try {

        setLoading(true);

        const response =
          await FarmsService.getAll(
            searchText
          );

        setFarms(
          response || []
        );

      } catch (error) {

        pushToast(
          getErrorMessage(error),
          "error"
        );

      } finally {

        setLoading(false);
      }
    },
    [pushToast]
  );

  const openAddModal = () => {

    setEditingFarm(null);

    setForm(EMPTY_FORM);

    setUploadPreview("");

    setShowModal(true);
  };

  const openEditModal = (farm) => {

    setEditingFarm(farm);

    setForm({
      farm_name: farm.farm_name,
      acres: farm.acres,
      location: farm.location,
      soil_type: farm.soil_type,
      farm_photo: null,
    });

    setUploadPreview(
      farm.farm_photo
    );

    setShowModal(true);
  };

  const closeModal = () => {

    setShowModal(false);

    setEditingFarm(null);

    setForm(EMPTY_FORM);

    setUploadPreview("");
  };

  const updateField =
    (field) =>
    (value) => {

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadFarms(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const stats = useMemo(() => {

    const totalFarms =
      farms.length;

    const totalAcres =
      farms.reduce(
        (sum, farm) =>
          sum + Number(
            farm.acres || 0
          ),
        0
      );

    const soilTypes =
      new Set(
        farms.map(
          (farm) =>
            farm.soil_type
        )
      ).size;

    const locations =
      new Set(
        farms.map(
          (farm) =>
            farm.location
        )
      ).size;

    return {
      totalFarms,
      totalAcres,
      soilTypes,
      locations,
    };

  }, [farms]);

  // ── Image picker + compress (same pattern as marketplace/rentals) ─────────
  const handleImage = async () => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      pushToast("Photo library permission required", "error"); return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:    ["images"],
      allowsEditing: true,
      quality:       0.7,   // compress in picker, skip ImageManipulator
      aspect:        [16, 9],
    });

    if (result.canceled) return;
    const asset = result.assets[0];

    const compressed =
      await ImageManipulator.manipulateAsync(
        asset.uri,
        [
          {
            resize: {
              width: 1280,
            },
          },
        ],
        {
          compress: 0.6,
          format:
            ImageManipulator.SaveFormat.JPEG,
        }
      );

    const fileObj = {
      uri: compressed.uri,
      name: `farm_photo_${Date.now()}.jpg`,
      type: "image/jpeg",
    };

    setForm((prev) => ({ ...prev, farm_photo: fileObj }));
    setUploadPreview(
      compressed.uri
    );
    pushToast("Image selected", "success");
  } catch {
    pushToast("Failed to process image", "error");
  }
};

  const handleSubmit = async () => {

    if (
      !validateRequired(
        form,
        [
          "farm_name",
          "acres",
          "location",
          "soil_type",
        ]
      )
    ) {
      pushToast(
        t("messages.VALIDATION_ERROR"),
        "error"
      );
      return;
    }

    try {

      setLoading(true);

      let farmPhotoUrl =
        uploadPreview;

      if (form.farm_photo) {

        const uploadResponse =
          await UploadService.getUploadUrls(
            "farms",
            [form.farm_photo]
          );

        const uploadedUrls =
          await UploadService.uploadFilesToS3(
            [form.farm_photo],
            uploadResponse.uploads
          );

        farmPhotoUrl =
          uploadedUrls[0];
      }

      const payload = {

        farm_name:
          form.farm_name,

        acres:
          Number(form.acres),

        location:
          form.location,

        soil_type:
          form.soil_type,

        farm_photo:
          farmPhotoUrl,
      };

      if (editingFarm) {

        await FarmsService.update(
          editingFarm.id,
          payload
        );

        pushToast(
          t("messages.FARM_UPDATED_SUCCESS")
        );

      } else {

        if (!farmPhotoUrl) {

          pushToast(
            t("farms.photo_required"),
            "error"
          );

          return;
        }

        await FarmsService.create(
          payload
        );

        pushToast(
          t("messages.FARM_ADDED_SUCCESS")
        );
      }

      closeModal();

      await loadFarms(search);

    } catch (error) {

      console.log(
        "Farm create error status:",
        error?.response?.status
      );

      console.log(
        "Farm create error data:",
        JSON.stringify(
          error?.response?.data
        )
      );

      console.log(
        "Farm create error message:",
        error?.message
      );

      pushToast(
        getErrorMessage(error),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  const handleDelete = (farmId) => {
    setSelectedFarmId(farmId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await FarmsService.delete(selectedFarmId);
      pushToast(t("messages.FARM_DELETED_SUCCESS"));
      setShowDeleteDialog(false);
      setSelectedFarmId(null);
      loadFarms(search);
    } catch (error) {
      pushToast(getErrorMessage(error), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <ScreenShell title={t("farms.title")} scrollable={false} noPadding>
      <FlatList
        data={farms}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={
          <>
            <PageHeader
              title={t("farms.title")}
              subtitle={t("farms.subtitle")}
              action={
                <Button variant="primary" onPress={openAddModal} style={s.addBtn}>
                  <View style={s.addBtnContent}>
                    <IconPlus size={14} color="#fff" />
                    <Text style={s.addBtnText}>{t("farms.create_farm")}</Text>
                  </View>
                </Button>
              }
            />

            <View style={s.statsGrid}>
              {STAT_CARDS.map((sc) => {
                const c = ICON_COLORS[sc.variant];
                return (
                  <Card key={sc.key} style={s.statCard}>
                    <View style={[s.statIcon, { backgroundColor: c.bg }]}>
                      <sc.icon size={22} color={c.color} />
                    </View>
                    <View>
                      <Text style={s.statTitle}>{t(sc.titleKey)}</Text>
                      <Text style={s.statValue}>{stats[sc.key]}</Text>
                      <Text style={s.statSub}>{t(sc.subtitleKey)}</Text>
                    </View>
                  </Card>
                );
              })}
            </View>

            <View style={s.toolbar}>
              <SearchInput value={search} onChangeText={setSearch} placeholder={t("farms.search_placeholder")} />
            </View>

            {!loading && farms.length === 0 && (
              <EmptyState icon={<IconFarm size={24} color={colors.textMuted} />} message={t("farms.empty")} />
            )}
            {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: spacing[5] }} />}
          </>
        }
        renderItem={({ item: farm }) => (
          <Card style={s.farmRow}>
            <TouchableOpacity style={s.thumb} onPress={() => setImageViewer(farm.farm_photo)}>
              <Image source={{ uri: farm.farm_photo }} style={s.thumbImage} resizeMode="cover" />
              <View style={s.thumbOverlay}>
                <Text style={s.eyeIcon}>👁</Text>
              </View>
            </TouchableOpacity>

            <View style={s.farmInfo}>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>{t("farms.name")}</Text>
                <Text style={s.farmName} numberOfLines={1}>{farm.farm_name}</Text>
              </View>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>{t("farms.location")}</Text>
                <Text style={s.infoValue} numberOfLines={1}>{farm.location}</Text>
              </View>
              <View style={s.infoRow}>
                <View style={s.infoItem}>
                  <Text style={s.infoLabel}>{t("farms.soil_type")}</Text>
                  <Text style={s.infoValue}>{farm.soil_type}</Text>
                </View>
                <View style={s.infoItem}>
                  <Text style={s.infoLabel}>{t("farms.acres")}</Text>
                  <Text style={s.infoValue}>{farm.acres}</Text>
                </View>
              </View>
            </View>

            <View style={s.farmActions}>
              <Button variant="secondary" onPress={() => openEditModal(farm)} style={s.actionBtn}>
                <IconEdit size={15} color={colors.text} />
              </Button>
              <Button variant="danger" onPress={() => handleDelete(farm.id)} style={s.actionBtn}>
                <IconTrash size={15} color={colors.error} />
              </Button>
            </View>
          </Card>
        )}
      />

      <Modal
        open={showModal}
        title={editingFarm ? t("farms.update_farm") : t("farms.create_farm")}
        onClose={closeModal}
      >
        <View style={s.formGrid}>
          <Input label={t("farms.name")}     value={form.farm_name}    onChangeText={updateField("farm_name")}  placeholder={t("farms.name")} />
          <Input label={t("farms.acres")}    type="number" value={String(form.acres)} onChangeText={updateField("acres")} placeholder="e.g. 2.5" />
          <Input label={t("farms.location")} value={form.location}     onChangeText={updateField("location")}   placeholder={t("farms.location")} />
          <Select label={t("farms.soil_type")} value={form.soil_type} onValueChange={updateField("soil_type")}>
            <Select.Item label={t("farms.select_soil_type")} value="" />
            {SOIL_TYPES.map((soil) => (
              <Select.Item key={soil} label={t(`farms.soil_${soil}`)} value={soil} />
            ))}
          </Select>
        </View>

        <View style={s.uploadSection}>
          <Text style={s.uploadLabel}>{t("farms.farm_photo")}</Text>
          <Button variant="secondary" onPress={handleImage} style={s.uploadBtn}>
            📷 {uploadPreview ? t("farms.change_photo") : t("farms.select_photo", { defaultValue: "Select Photo" })}
          </Button>
          {!!uploadPreview && (
            <Image source={{ uri: uploadPreview }} style={s.uploadPreview} resizeMode="cover" />
          )}
        </View>

        <View style={s.modalActions}>
          <Button variant="secondary" onPress={closeModal}>{t("farms.cancel")}</Button>
          <Button variant="primary" loading={loading} disabled={loading} onPress={handleSubmit}>
            {editingFarm ? t("farms.update_farm") : t("farms.create_farm")}
          </Button>
        </View>
      </Modal>

      <ImageViewer image={imageViewer} onClose={() => setImageViewer("")} />

      <ConfirmDialog
        open={showDeleteDialog}
        title={t("farms.delete_title")}
        message={t("farms.delete_message")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={confirmDelete}
        onCancel={() => { setShowDeleteDialog(false); setSelectedFarmId(null); }}
        loading={deleteLoading}
      />
    </ScreenShell>
  );
}

const s = StyleSheet.create({
  listContent:   { padding: spacing[4], paddingBottom: spacing[7], gap: spacing[3] },
  statsGrid:     { flexDirection: "row", flexWrap: "wrap", gap: spacing[3], marginBottom: spacing[3] },
  statCard:      { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[4], width: "47%" },
  statIcon:      { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statTitle:     { fontSize: fontSize.xs, fontWeight: "600", color: colors.textMuted, marginBottom: 2 },
  statValue:     { fontSize: fontSize.xl, fontWeight: "700", color: colors.text, lineHeight: fontSize.xl * 1.1 },
  statSub:       { fontSize: fontSize.xs, color: colors.textFaint, marginTop: 2 },
  toolbar:       { marginBottom: spacing[3] },
  farmRow:       { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[3], borderRadius: radius.xl },
  thumb:         { width: 95, height: 78, borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.surface2, flexShrink: 0 },
  thumbImage:    { width: "100%", height: "100%" },
  thumbOverlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15,23,42,0.45)", alignItems: "center", justifyContent: "center" },
  eyeIcon:       { fontSize: 18 },
  farmInfo:      { flex: 1, gap: 4, minWidth: 0 },
  infoRow:       { flexDirection: "row", gap: spacing[3] },
  infoItem:      { gap: 2, minWidth: 0 },
  infoLabel:     { fontSize: 10, fontWeight: "700", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.5 },
  farmName:      { fontSize: fontSize.sm, fontWeight: "700", color: colors.text },
  infoValue:     { fontSize: fontSize.xs, fontWeight: "600", color: colors.text },
  farmActions:   { flexDirection: "column", gap: spacing[2] },
  actionBtn:     { width: 38, height: 38, paddingHorizontal: 0, paddingVertical: 0, minHeight: 38 },
  formGrid:      { gap: spacing[4] },
  uploadSection: { marginTop: spacing[4], gap: spacing[2] },
  uploadLabel:   { fontSize: fontSize.sm, fontWeight: "600", color: colors.text2 },
  uploadBtn:     { alignSelf: "flex-start" },
  uploadPreview: { width: "100%", height: 180, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginTop: spacing[2] },
  modalActions:  { flexDirection: "row", justifyContent: "flex-end", gap: spacing[3], marginTop: spacing[5] },
  addBtn:        { paddingHorizontal: 14 },
  addBtnContent: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  addBtnText:    { color: "#fff", fontWeight: "600" },
});