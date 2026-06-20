// CONVERTED FROM: src/pages/farmer/Fertilizers.jsx + Fertilizers.css
//
// Same pattern as CropsScreen:
//   Desktop table hidden / mobile card shown → always card layout in RN
//   handleChange(field)(e) → handleChange(field)(value)
//   <input type="date">    → DateField with DateTimePicker
//   StatsCard with Select  → card with icon + label + Select inline
//   <option> / onChange    → Select.Item / onValueChange

import React, { useEffect, useState, useCallback } from "react";
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

import {
  IconPlus, IconEdit, IconTrash,
  IconFertilizer, IconFinancialYear,
  IconTotalQuantity, IconTotalRecords, IconLatestApplication,
} from "../../components/Icons";

import { FertilizersService } from "../../services/fertilizersService";
import { useApp }             from "../../context/AppContext";
import { colors, spacing, radius, fontSize, shadows } from "../../theme";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  fertilizer_name:  "",
  quantity:         "",
  unit:             "",
  application_date: "",
  notes:            "",
};

const UNIT_OPTIONS = [
  "kg", "gram", "liter", "ml", "bag",
  "packet", "quintal", "ton", "piece", "other",
];

// ─── Reusable sub-components ──────────────────────────────────────────────────

// DateField — identical to CropsScreen, replaces <Input type="date">
function DateField({ label, value, onChange, optional }) {
  const [show, setShow] = useState(false);
  const dateObj = value ? new Date(value) : new Date();
  return (
    <View style={ds.field}>
      <View style={ds.labelRow}>
        <Text style={ds.label}>{label}</Text>
        {optional
          ? <Text style={ds.optional}> (Optional)</Text>
          : <Text style={ds.required}>*</Text>}
      </View>
      <TouchableOpacity style={ds.trigger} onPress={() => setShow(true)}>
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
            if (selected) onChange(selected.toISOString().split("T")[0]);
          }}
        />
      )}
    </View>
  );
}

// IconBtn — replaces .icon-btn / .icon-btn--danger
function IconBtn({ onPress, danger }) {
  return (
    <TouchableOpacity
      style={[s.iconBtn, danger && s.iconBtnDanger]}
      onPress={onPress}
      hitSlop={8}
    >
      {danger
        ? <IconTrash size={15} color={colors.error} />
        : <IconEdit  size={15} color={colors.textMuted} />}
    </TouchableOpacity>
  );
}

// StatCard — replaces StatsCard with colorClass + icon
function StatCard({ icon, iconBg, iconColor, title, children }) {
  return (
    <Card style={s.statCard}>
      <View style={[s.statIcon, { backgroundColor: iconBg }]}>
        {React.cloneElement(icon, { size: 20, color: iconColor })}
      </View>
      <View style={s.statBody}>
        <Text style={s.statTitle}>{title}</Text>
        {children}
      </View>
    </Card>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FertilizersScreen() {
  const { t }         = useTranslation();
  const { pushToast } = useApp();

  const [fertilizers,         setFertilizers]         = useState([]);
  const [financialYears,      setFinancialYears]       = useState([]);
  const [loading,             setLoading]             = useState(false);
  const [modalOpen,           setModalOpen]           = useState(false);
  const [editingFertilizer,   setEditingFertilizer]   = useState(null);
  const [deleteFertilizer,    setDeleteFertilizer]    = useState(null);
  const [form,                setForm]                = useState(EMPTY_FORM);

  const [filters, setFilters] = useState({ search: "", financial_year: "all" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // ── Debounce ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilters(filters), 400);
    return () => clearTimeout(t);
  }, [filters]);

  // ── Load ───────────────────────────────────────────────────────────────────
  const loadFertilizers = useCallback(async (f = debouncedFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (f.search?.trim())                              params.search         = f.search.trim();
      if (f.financial_year && f.financial_year !== "all") params.financial_year = f.financial_year;

      const data = (await FertilizersService.getAll(params)) ?? [];
      setFertilizers(data);
      setFinancialYears((prev) => {
        const merged = [...new Set([...prev, ...data.map((x) => x.financial_year).filter(Boolean)])];
        return merged.sort();
      });
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => { loadFertilizers(debouncedFilters); }, [debouncedFilters]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total:              fertilizers.length,
    totalQuantity:      fertilizers.reduce((acc, x) => acc + Number(x.quantity || 0), 0),
    latestApplication:  fertilizers[0]?.application_date?.split("T")[0] || "—",
  };

  // ── Modal ──────────────────────────────────────────────────────────────────
  const openCreateModal = () => { setEditingFertilizer(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEditModal   = (item) => {
    setEditingFertilizer(item);
    setForm({
      fertilizer_name:  item.fertilizer_name || "",
      quantity:         String(item.quantity  || ""),
      unit:             item.unit             || "",
      application_date: item.application_date?.split("T")[0] || "",
      notes:            item.notes            || "",
    });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingFertilizer(null); setForm(EMPTY_FORM); };

  // handleChange(field)(value) — replaces handleChange(field)(e) => e.target.value
  const handleChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.fertilizer_name || !form.quantity || !form.unit || !form.application_date) {
      pushToast(t("messages.VALIDATION_ERROR"), "error"); return;
    }
    const qty = Number(form.quantity);
    if (qty <= 0 || !Number.isInteger(qty)) {
      pushToast("Quantity must be a positive integer", "error"); return;
    }
    try {
      setLoading(true);
      if (editingFertilizer) {
        await FertilizersService.update(editingFertilizer.id, form);
        pushToast(t("fertilizers.updated"));
      } else {
        await FertilizersService.create(form);
        pushToast(t("fertilizers.created"));
      }
      closeModal();
      await loadFertilizers(debouncedFilters);
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteFertilizer) return;
    try {
      setLoading(true);
      await FertilizersService.delete(deleteFertilizer.id);
      pushToast(t("fertilizers.deleted"));
      setDeleteFertilizer(null);
      await loadFertilizers(debouncedFilters);
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Card render — replaces .fertilizer-mobile-card ────────────────────────
  const renderItem = ({ item }) => (
    <Card style={s.itemCard}>
      <View style={s.cardHeader}>
        <Text style={s.itemName} numberOfLines={1}>{item.fertilizer_name}</Text>
        <Text style={s.fyChip}>{item.financial_year || "—"}</Text>
      </View>
      <View style={s.cardGrid}>
        <View style={s.gridItem}>
          <Text style={s.gridLabel}>{t("fertilizers.quantity")}</Text>
          <Text style={s.gridValue}>{item.quantity} {item.unit}</Text>
        </View>
        <View style={s.gridItem}>
          <Text style={s.gridLabel}>{t("fertilizers.application_date")}</Text>
          <Text style={s.gridValue}>{item.application_date?.split("T")[0] || "—"}</Text>
        </View>
        {!!item.notes && (
          <View style={[s.gridItem, { flex: 2 }]}>
            <Text style={s.gridLabel}>{t("fertilizers.notes")}</Text>
            <Text style={s.gridValue} numberOfLines={2}>{item.notes}</Text>
          </View>
        )}
      </View>
      <View style={s.cardActions}>
        <IconBtn onPress={() => openEditModal(item)} />
        <IconBtn onPress={() => setDeleteFertilizer(item)} danger />
      </View>
    </Card>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <ScreenShell title={t("fertilizers.title")} scrollable={false}>
      <FlatList
        data={fertilizers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <PageHeader
              title={t("fertilizers.title")}
              subtitle={t("fertilizers.subtitle")}
              action={
                // <Button variant="primary" onPress={openCreateModal}>
                //   <IconPlus size={14} color="#fff" />
                //   {t("fertilizers.add")}
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
                      {t("fertilizers.add")}
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
                {t("fertilizers.financial_year")}
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
                  label={t("fertilizers.all_financial_years")}
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

            {/* ── Stats grid ───────────────────────────────────────── */}
            <View style={s.statsGrid}>

              {/* Financial year filter
              <StatCard
                icon={<IconFinancialYear />}
                iconBg={colors.infoBg} iconColor={colors.info}
                title={t("fertilizers.financial_year")}
              >
                <Select
                  value={filters.financial_year}
                  onValueChange={(v) => setFilters((p) => ({ ...p, financial_year: v }))}
                  style={s.fySelect}
                >
                  <Select.Item label={t("fertilizers.all_financial_years")} value="all" />
                  {financialYears.map((fy) => (
                    <Select.Item key={fy} label={fy} value={fy} />
                  ))}
                </Select>
              </StatCard> */}

              {/* Total records */}
              <StatCard
                icon={<IconTotalRecords />}
                iconBg={colors.successBg} iconColor={colors.success}
                title={t("fertilizers.total_records")}
              >
                <Text style={s.statValue}>{stats.total}</Text>
                <Text style={s.statSub}>{t("fertilizers.records")}</Text>
              </StatCard>

              {/* Total quantity */}
              <StatCard
                icon={<IconTotalQuantity />}
                iconBg={colors.accent50} iconColor={colors.accent600}
                title={t("fertilizers.total_quantity")}
              >
                <Text style={s.statValue}>{stats.totalQuantity}</Text>
                <Text style={s.statSub}>{t("fertilizers.total_used")}</Text>
              </StatCard>

              {/* Latest application */}
              <StatCard
                icon={<IconLatestApplication />}
                iconBg={colors.purpleBg} iconColor={colors.purple}
                title={t("fertilizers.latest_application")}
              >
                <Text style={[s.statValue, { fontSize: fontSize.sm }]}>{stats.latestApplication}</Text>
                <Text style={s.statSub}>{t("fertilizers.latest_record")}</Text>
              </StatCard>

            </View>

            {/* ── Search ───────────────────────────────────────────── */}
            <Card style={s.filterCard}>
              <SearchInput
                value={filters.search}
                onChangeText={(v) => setFilters((p) => ({ ...p, search: v }))}
                placeholder={t("fertilizers.search")}
              />
            </Card>

            {loading && <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing[4] }} />}
            {!loading && fertilizers.length === 0 && (
              <EmptyState
                icon={<IconFertilizer size={24} color={colors.textMuted} />}
                message={t("fertilizers.empty")}
              />
            )}
          </>
        }
      />

      {/* ── Add / Edit Modal ───────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingFertilizer ? t("fertilizers.edit") : t("fertilizers.create")}
      >
        <View style={s.formGrid}>
          <Input
            label={t("fertilizers.name")}
            value={form.fertilizer_name}
            onChangeText={handleChange("fertilizer_name")}
            placeholder={t("fertilizers.name")}
          />
          <Input
            label={t("fertilizers.quantity")}
            type="number"
            value={form.quantity}
            onChangeText={handleChange("quantity")}
            placeholder="e.g. 10"
          />
          <Select
            label={t("fertilizers.unit")}
            value={form.unit}
            onValueChange={handleChange("unit")}
          >
            <Select.Item label={t("fertilizers.select_unit")} value="" />
            {UNIT_OPTIONS.map((u) => (
              <Select.Item key={u} label={t(`fertilizers.unit_${u}`)} value={u} />
            ))}
          </Select>
          <DateField
            label={t("fertilizers.application_date")}
            value={form.application_date}
            onChange={handleChange("application_date")}
          />
          <Input
            label={t("fertilizers.notes")}
            optional
            value={form.notes}
            onChangeText={handleChange("notes")}
            placeholder={t("fertilizers.notes")}
          />
        </View>

        <View style={s.formActions}>
          <Button variant="secondary" onPress={closeModal}>{t("common.cancel")}</Button>
          <Button variant="primary" loading={loading} disabled={loading} onPress={handleSubmit}>
            {editingFertilizer ? t("fertilizers.update") : t("fertilizers.create")}
          </Button>
        </View>
      </Modal>

      {/* ── Delete confirm ─────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteFertilizer}
        title={t("fertilizers.delete")}
        message={`${t("fertilizers.delete_confirm")} "${deleteFertilizer?.fertilizer_name}"?`}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteFertilizer(null)}
        loading={loading}
      />
    </ScreenShell>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ds = StyleSheet.create({
  field:       { gap: 6 },
  labelRow:    { flexDirection: "row", alignItems: "center" },
  label:       { fontSize: fontSize.sm, fontWeight: "500", color: colors.text2 },
  required:    { color: "#ef4444", fontSize: 15, fontWeight: "700", marginLeft: 4 },
  optional:    { fontSize: fontSize.sm, color: colors.textMuted },
  trigger:     { paddingVertical: 9, paddingHorizontal: spacing[3], borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, backgroundColor: colors.surface },
  dateText:    { fontSize: fontSize.sm, color: colors.text },
  placeholder: { color: colors.textFaint },
});

const s = StyleSheet.create({
  listContent: { paddingBottom: spacing[7], gap: spacing[3] },

  // Stats
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing[3], marginBottom: spacing[3] },
  statCard:  { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[3], width: "47%" },
  statIcon:  { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statBody:  { flex: 1, gap: 2 },
  statTitle: { fontSize: fontSize.xs, fontWeight: "600", color: colors.textMuted },
  statValue: { fontSize: fontSize.xl,  fontWeight: "700", color: colors.text },
  statSub:   { fontSize: fontSize.xs,  color: colors.textFaint },
  fySelect:  { marginTop: 2 },

  filterCard: { padding: spacing[3], marginBottom: spacing[2] },

  // Item card — replaces .fertilizer-mobile-card
  itemCard:   { padding: spacing[4], borderRadius: radius.xl, gap: spacing[3] },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3] },
  itemName:   { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },
  fyChip:     { fontSize: fontSize.xs, fontWeight: "600", color: colors.textMuted },

  // Grid — replaces .fertilizer-mobile-grid grid-template-columns: 1fr 1fr
  cardGrid:  { flexDirection: "row", flexWrap: "wrap", gap: spacing[3] },
  gridItem:  { flex: 1, minWidth: "45%", gap: 4 },
  gridLabel: { fontSize: 11, fontWeight: "700", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
  gridValue: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },

  cardActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing[2] },

  // Icon button
  iconBtn:       { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  iconBtnDanger: { borderColor: "#fecaca", backgroundColor: colors.errorBg },

  // Form
  formGrid:    { gap: spacing[4] },
  formActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing[3], marginTop: spacing[5] },
  
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
});