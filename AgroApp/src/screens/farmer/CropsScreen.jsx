// CONVERTED FROM: src/pages/farmer/Crops.jsx + Crops.css
//
// Key changes:
//   Desktop table / mobile card CSS toggle  → always mobile card layout (RN is always mobile)
//   <div className="icon-btn">              → TouchableOpacity with icon
//   <input type="date">                     → @react-native-community/datetimepicker
//   handleChange(field)(e) => e.target.value → handleChange(field)(value) direct string
//   StatsCard with Select inside value prop  → financial year Select rendered separately
//   <option> / <Select onChange>             → <Select.Item> / onValueChange

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

import ScreenShell   from "../../components/ScreenShell";
import Card          from "../../components/Card";
import Button        from "../../components/Button";
import Input         from "../../components/Input";
import Select        from "../../components/Select";
import Modal         from "../../components/Modal";
import SearchInput   from "../../components/SearchInput";
import EmptyState    from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader    from "../../components/PageHeader";
import Badge         from "../../components/Badge";

import {
  IconCrop, IconPlus, IconEdit, IconTrash, IconFarm, IconSeason, IconFarmYear,
} from "../../components/Icons";

import { FarmsService } from "../../services/farmsService";
import { CropsService } from "../../services/cropsService";
import { useApp }       from "../../context/AppContext";
import { colors, spacing, radius, fontSize, shadows } from "../../theme";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  farm_id:               "",
  crop_name:             "",
  season:                "",
  sowing_date:           "",
  expected_harvest_date: "",
};

const SEASON_OPTIONS = [
  "kharif", "rabi", "zaid", "perennial", "whole_year", "other",
];

// ─── Date picker helper ───────────────────────────────────────────────────────
// Replaces <Input type="date"> — shows native Android date picker
function DateField({ label, value, onChange, optional }) {
  const [show, setShow] = useState(false);
  const dateObj = value ? new Date(value) : new Date();

  return (
    <View style={ds.field}>
      <View style={ds.labelRow}>
        <Text style={ds.label}>{label}</Text>
        {optional
          ? <Text style={ds.optional}> (Optional)</Text>
          : <Text style={ds.required}>*</Text>
        }
      </View>
      <TouchableOpacity style={ds.dateTrigger} onPress={() => setShow(true)}>
        <Text style={[ds.dateText, !value && ds.placeholder]}>
          {value || "YYYY-MM-DD"}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display={Platform.OS === "android" ? "default" : "spinner"}
          onChange={(_, selected) => {
            setShow(false);
            if (selected) {
              const iso = selected.toISOString().split("T")[0];
              onChange(iso);
            }
          }}
        />
      )}
    </View>
  );
}

const ds = StyleSheet.create({
  field:    { gap: 6 },
  labelRow: { flexDirection: "row", alignItems: "center" },
  label:    { fontSize: fontSize.sm, fontWeight: "500", color: colors.text2 },
  required: { color: "#ef4444", fontSize: 15, fontWeight: "700", marginLeft: 4 },
  optional: { fontSize: fontSize.sm, color: colors.textMuted },
  dateTrigger: {
    paddingVertical: 9, paddingHorizontal: spacing[3],
    borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radius.md, backgroundColor: colors.surface,
  },
  dateText:    { fontSize: fontSize.sm, color: colors.text },
  placeholder: { color: colors.textFaint },
});

// ─── Icon button ──────────────────────────────────────────────────────────────
// Replaces <button className="icon-btn"> and <button className="icon-btn--danger">
function IconBtn({ onPress, danger }) {
  return (
    <TouchableOpacity
      style={[s.iconBtn, danger && s.iconBtnDanger]}
      onPress={onPress}
      hitSlop={8}
    >
      {danger
        ? <IconTrash size={15} color={colors.error} />
        : <IconEdit  size={15} color={colors.textMuted} />
      }
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CropsScreen() {
  const { t }         = useTranslation();
  const { pushToast } = useApp();

  const [farms,          setFarms]          = useState([]);
  const [allCrops,       setAllCrops]       = useState([]);
  const [crops,          setCrops]          = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingCrop,    setEditingCrop]    = useState(null);
  const [deleteCrop,     setDeleteCrop]     = useState(null);
  const [form,           setForm]           = useState(EMPTY_FORM);

  const [filters, setFilters] = useState({
    search: "", farm_id: "all", season: "all", financial_year: "all",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // ── Debounce ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  // ── Initial load ───────────────────────────────────────────────────────────
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const farmsRes = await FarmsService.getAll();
      setFarms(farmsRes ?? []);
      const cropsRes = await CropsService.getAll();
      const data = cropsRes ?? [];
      setAllCrops(data);
      setCrops(data);
      const years = [...new Set(data.map((c) => c.financial_year).filter(Boolean))].sort();
      setFinancialYears(years);
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadInitialData(); }, []);

  // ── Load with filters ──────────────────────────────────────────────────────
  const loadCrops = useCallback(async (f = debouncedFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (f.search?.trim())                      params.search         = f.search.trim();
      if (f.farm_id       && f.farm_id       !== "all") params.farm_id        = f.farm_id;
      if (f.season        && f.season        !== "all") params.season         = f.season;
      if (f.financial_year && f.financial_year !== "all") params.financial_year = f.financial_year;

      const data = (await CropsService.getAll(params)) ?? [];
      setCrops(data);
      setFinancialYears((prev) => {
        const merged = [...new Set([...prev, ...data.map((c) => c.financial_year).filter(Boolean)])];
        return merged.sort();
      });
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => { loadCrops(debouncedFilters); }, [debouncedFilters]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const farmsMap = useMemo(
    () => Object.fromEntries(farms.map((f) => [f.id, f.farm_name])),
    [farms]
  );
  const farmName = (id) => farmsMap[id] || "—";

  const stats = {
    total:   crops.length,
    farms:   new Set(crops.map((c) => c.farm_id)).size,
    seasons: new Set(crops.map((c) => c.season)).size,
  };

  // ── Modal ──────────────────────────────────────────────────────────────────
  const openCreateModal = () => { setEditingCrop(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEditModal   = (crop) => {
    setEditingCrop(crop);
    setForm({
      farm_id:               crop.farm_id || "",
      crop_name:             crop.crop_name || "",
      season:                crop.season || "",
      sowing_date:           crop.sowing_date?.split("T")[0] || "",
      expected_harvest_date: crop.expected_harvest_date?.split("T")[0] || "",
    });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingCrop(null); setForm(EMPTY_FORM); };

  // handleChange(field)(value) — replaces handleChange(field)(e) => e.target.value
  const handleChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.farm_id || !form.crop_name) {
      pushToast(t("messages.VALIDATION_ERROR"), "error"); return;
    }
    try {
      setLoading(true);
      const payload = { ...form, expected_harvest_date: form.expected_harvest_date || null };
      if (editingCrop) {
        await CropsService.update(editingCrop.id, payload);
        pushToast(t("crops.crop_updated"));
      } else {
        await CropsService.create(payload);
        pushToast(t("crops.crop_added"));
      }
      closeModal();
      await loadCrops(debouncedFilters);
      await loadInitialData();
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteCrop) return;
    try {
      setLoading(true);
      await CropsService.delete(deleteCrop.id);
      pushToast(t("crops.crop_deleted"));
      setDeleteCrop(null);
      await loadCrops(debouncedFilters);
      await loadInitialData();
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Crop card — replaces .crop-mobile-card (always shown, no desktop table) ─
  const renderCrop = ({ item: crop }) => (
    <Card style={s.cropCard}>
      {/* Header: name + season badge */}
      <View style={s.cropHeader}>
        <Text style={s.cropName} numberOfLines={1}>{crop.crop_name}</Text>
        <View style={s.seasonBadge}>
          <Text style={s.seasonText}>{crop.season || "—"}</Text>
        </View>
      </View>

      {/* Body: farm + financial year */}
      <View style={s.cropGrid}>
        <View style={s.cropItem}>
          <Text style={s.cropLabel}>{t("crops.farm")}</Text>
          <Text style={s.cropValue} numberOfLines={1}>{farmName(crop.farm_id)}</Text>
        </View>
        <View style={s.cropItem}>
          <Text style={s.cropLabel}>{t("crops.financial_year")}</Text>
          <Text style={s.cropValue}>{crop.financial_year || "—"}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={s.cropActions}>
        <IconBtn onPress={() => openEditModal(crop)} />
        <IconBtn onPress={() => setDeleteCrop(crop)} danger />
      </View>
    </Card>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <ScreenShell title={t("crops.title")} scrollable={false}>
      <FlatList
        data={crops}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        renderItem={renderCrop}
        ListHeaderComponent={
          <>
            <PageHeader
              title={t("crops.title")}
              subtitle={t("crops.subtitle")}
              action={
                // <Button variant="primary" onPress={openCreateModal}>
                //   <IconPlus size={14} color="#fff" />
                //   {t("crops.add_crop")}
                // </Button>

                <Button
                  variant="primary"
                  onPress={openCreateModal}
                  style={s.addBtn}
                  textStyle={s.addBtnText}
                >
                  <View style={s.addBtnContent}>  
                    <IconPlus size={14} color="#fff" />
                    <Text style={s.addBtnText}>
                      {t("crops.add_crop")}
                    </Text>
                  </View>
                </Button>
              }
            />

            <Card style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: colors.text,
                }}
              >
                {t("crops.financial_year")}
              </Text>

              <Select
                value={filters.financial_year}
                onValueChange={(v) =>
                  setFilters((p) => ({
                    ...p,
                    financial_year: v,
                  }))
                }
              >
                <Select.Item
                  label={t("crops.all_financial_years")}
                  value="all"
                />

                {financialYears.map((fy) => (
                  <Select.Item
                    key={fy}
                    label={fy}
                    value={fy}
                  />
                ))}
              </Select>
            </Card>

            {/* ── Stats row ────────────────────────────────────────────── */}
            <View style={s.statsGrid}>

              {/* Financial year filter card — replaces StatsCard with Select in value */}
              {/* <Card style={s.statCard}>
                <View style={[s.statIcon, { backgroundColor: colors.infoBg }]}>
                  <IconFarmYear size={20} color={colors.info} />
                </View>
                <View style={s.statBody}>
                  <Text style={s.statTitle}>{t("crops.financial_year")}</Text>
                  <Select
                    value={filters.financial_year}
                    onValueChange={(v) => setFilters((p) => ({ ...p, financial_year: v }))}
                    style={s.fySelect}
                  >
                    <Select.Item label={t("crops.all_financial_years")} value="all" />
                    {financialYears.map((fy) => (
                      <Select.Item key={fy} label={fy} value={fy} />
                    ))}
                  </Select>
                </View>
              </Card> */}

              {/* Total crops */}
              <Card style={s.statCard}>
                <View style={[s.statIcon, { backgroundColor: colors.successBg }]}>
                  <IconCrop size={20} color={colors.success} />
                </View>
                <View style={s.statBody}>
                  <Text style={s.statTitle}>{t("crops.total_crops")}</Text>
                  <Text style={s.statValue}>{stats.total}</Text>
                  <Text style={s.statSub}>{t("crops.registered_crops")}</Text>
                </View>
              </Card>

              {/* Connected farms */}
              <Card style={s.statCard}>
                <View style={[s.statIcon, { backgroundColor: colors.accent50 }]}>
                  <IconFarm size={20} color={colors.accent600} />
                </View>
                <View style={s.statBody}>
                  <Text style={s.statTitle}>{t("crops.connected_farms")}</Text>
                  <Text style={s.statValue}>{stats.farms}</Text>
                  <Text style={s.statSub}>{t("crops.farm_coverage")}</Text>
                </View>
              </Card>

              {/* Seasons */}
              <Card style={s.statCard}>
                <View style={[s.statIcon, { backgroundColor: colors.purpleBg }]}>
                  <IconSeason size={20} color={colors.purple} />
                </View>
                <View style={s.statBody}>
                  <Text style={s.statTitle}>{t("crops.seasons_count")}</Text>
                  <Text style={s.statValue}>{stats.seasons}</Text>
                  <Text style={s.statSub}>{t("crops.season_categories")}</Text>
                </View>
              </Card>
            </View>

            {/* ── Search bar ────────────────────────────────────────────── */}
            <Card style={s.filterCard}>
              <SearchInput
                value={filters.search}
                onChangeText={(v) => setFilters((p) => ({ ...p, search: v }))}
                placeholder={t("crops.search_placeholder")}
              />
            </Card>

            {loading && <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing[4] }} />}
            {!loading && crops.length === 0 && (
              <EmptyState icon={<IconCrop size={24} color={colors.textMuted} />} message={t("crops.no_crops_found")} />
            )}
          </>
        }
      />

      {/* ── Add / Edit Modal ───────────────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingCrop ? t("crops.edit_crop") : t("crops.add_crop")}
      >
        <View style={s.formGrid}>

          {/* Farm dropdown */}
          <Select
            label={t("crops.farm")}
            value={form.farm_id}
            onValueChange={handleChange("farm_id")}
          >
            <Select.Item label={t("crops.select_farm")} value="" />
            {farms.map((farm) => (
              <Select.Item key={farm.id} label={farm.farm_name} value={farm.id} />
            ))}
          </Select>

          {/* Crop name */}
          <Input
            label={t("crops.name")}
            value={form.crop_name}
            onChangeText={handleChange("crop_name")}
            placeholder={t("crops.enter_crop_name")}
          />

          {/* Season dropdown */}
          <Select
            label={t("crops.season")}
            optional
            value={form.season}
            onValueChange={handleChange("season")}
          >
            <Select.Item label={t("crops.select_season")} value="" />
            {SEASON_OPTIONS.map((s) => (
              <Select.Item key={s} label={t(`crops.season_${s}`)} value={s} />
            ))}
          </Select>

          {/* Sowing date — replaces <Input type="date"> */}
          <DateField
            label={t("crops.sowing_date")}
            value={form.sowing_date}
            onChange={handleChange("sowing_date")}
          />

          {/* Expected harvest date */}
          <DateField
            label={t("crops.expected_harvest")}
            value={form.expected_harvest_date}
            onChange={handleChange("expected_harvest_date")}
            optional
          />
        </View>

        {/* Modal actions */}
        <View style={s.formActions}>
          <Button variant="secondary" onPress={closeModal}>{t("crops.cancel")}</Button>
          <Button variant="primary" loading={loading} disabled={loading} onPress={handleSubmit}>
            {editingCrop ? t("crops.update_crop") : t("crops.create_crop")}
          </Button>
        </View>
      </Modal>

      {/* ── Delete confirm ─────────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteCrop}
        title={t("crops.delete_crop")}
        message={`${t("crops.delete_confirm")} "${deleteCrop?.crop_name}"?`}
        confirmText={t("crops.delete_crop")}
        cancelText={t("crops.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteCrop(null)}
        loading={loading}
      />
    </ScreenShell>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  listContent: {
    paddingBottom: spacing[7],
    gap:           spacing[3],
  },

  addBtn: {
    paddingHorizontal: 14,
  },

  addBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  addBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Stats — replaces grid grid--4 → 2-col wrap
  statsGrid: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           spacing[3],
    marginBottom:  spacing[3],
  },
  statCard: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           spacing[3],
    padding:       spacing[3],
    width:         "47%",
  },
  statIcon: {
    width:          40,
    height:         40,
    borderRadius:   20,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  statBody:  { flex: 1, gap: 2 },
  statTitle: { fontSize: fontSize.xs, fontWeight: "600", color: colors.textMuted },
  statValue: { fontSize: fontSize.xl,  fontWeight: "700", color: colors.text },
  statSub:   { fontSize: fontSize.xs,  color: colors.textFaint },
  fySelect:  { marginTop: 2 },

  // Filter card
  filterCard: { marginBottom: spacing[2], padding: spacing[3] },

  // Crop card — replaces .crop-mobile-card (always shown in RN)
  cropCard: {
    padding:      spacing[4],
    borderRadius: radius.xl,
    gap:          spacing[3],
  },

  // Header
  cropHeader: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
    gap:            spacing[3],
  },
  cropName: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },

  // Season badge — replaces .season-badge
  seasonBadge: {
    paddingVertical:   6,
    paddingHorizontal: 12,
    borderRadius:      radius.pill,
    backgroundColor:   colors.primary50,
    borderWidth:       1,
    borderColor:       colors.primary100,
  },
  seasonText: { fontSize: fontSize.xs, fontWeight: "600", color: colors.primary },

  // Grid — replaces .crop-mobile-grid grid-template-columns: 1fr 1fr
  cropGrid: {
    flexDirection: "row",
    gap:           spacing[4],
  },
  cropItem:  { flex: 1, gap: 4 },
  cropLabel: { fontSize: 11, fontWeight: "700", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
  cropValue: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },

  // Actions
  cropActions: {
    flexDirection:  "row",
    justifyContent: "flex-end",
    gap:            spacing[2],
    marginTop:      spacing[1],
  },

  // Icon button — replaces .icon-btn
  iconBtn: {
    width:          36,
    height:         36,
    alignItems:     "center",
    justifyContent: "center",
    borderRadius:   radius.md,
    borderWidth:    1,
    borderColor:    colors.border,
    backgroundColor:colors.surface,
  },
  iconBtnDanger: {
    borderColor:     "#fecaca",
    backgroundColor: colors.errorBg,
  },

  // Form
  formGrid: { gap: spacing[4] },
  formActions: {
    flexDirection:  "row",
    justifyContent: "flex-end",
    gap:            spacing[3],
    marginTop:      spacing[5],
  },
});