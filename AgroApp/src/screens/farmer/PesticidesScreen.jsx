// CONVERTED FROM: src/pages/farmer/Pesticides.jsx + Pesticides.css
// Identical pattern to FertilizersScreen — only names differ (pesticide_name vs fertilizer_name)

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
  IconPlus, IconEdit, IconTrash, IconPesticide,
  IconFinancialYear, IconTotalQuantity, IconTotalRecords, IconLatestApplication,
} from "../../components/Icons";

import { PesticidesService } from "../../services/pesticidesService";
import { useApp }            from "../../context/AppContext";
import { colors, spacing, radius, fontSize } from "../../theme";

const EMPTY_FORM = {
  pesticide_name:   "",
  quantity:         "",
  unit:             "",
  application_date: "",
  notes:            "",
};

const UNIT_OPTIONS = [
  "kg", "gram", "liter", "ml", "bag",
  "packet", "quintal", "ton", "piece", "other",
];

// ─── Shared sub-components (same as Fertilizers) ─────────────────────────────

function DateField({ label, value, onChange, optional }) {
  const [show, setShow] = useState(false);
  const dateObj = value ? new Date(value) : new Date();
  return (
    <View style={ds.field}>
      <View style={ds.labelRow}>
        <Text style={ds.label}>{label}</Text>
        {optional ? <Text style={ds.optional}> (Optional)</Text> : <Text style={ds.required}>*</Text>}
      </View>
      <TouchableOpacity style={ds.trigger} onPress={() => setShow(true)}>
        <Text style={[ds.dateText, !value && ds.placeholder]}>{value || "YYYY-MM-DD"}</Text>
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

function IconBtn({ onPress, danger }) {
  return (
    <TouchableOpacity style={[s.iconBtn, danger && s.iconBtnDanger]} onPress={onPress} hitSlop={8}>
      {danger
        ? <IconTrash size={15} color={colors.error} />
        : <IconEdit  size={15} color={colors.textMuted} />}
    </TouchableOpacity>
  );
}

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

export default function PesticidesScreen() {
  const { t }         = useTranslation();
  const { pushToast } = useApp();

  const [pesticides,      setPesticides]      = useState([]);
  const [financialYears,  setFinancialYears]  = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [modalOpen,       setModalOpen]       = useState(false);
  const [editingPesticide,setEditingPesticide]= useState(null);
  const [deletePesticide, setDeletePesticide] = useState(null);
  const [form,            setForm]            = useState(EMPTY_FORM);

  const [filters, setFilters] = useState({ search: "", financial_year: "all" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const loadPesticides = useCallback(async (f = debouncedFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (f.search?.trim())                              params.search         = f.search.trim();
      if (f.financial_year && f.financial_year !== "all") params.financial_year = f.financial_year;

      const data = (await PesticidesService.getAll(params)) ?? [];
      setPesticides(data);
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

  useEffect(() => { loadPesticides(debouncedFilters); }, [debouncedFilters]);

  const stats = {
    total:             pesticides.length,
    totalQuantity:     pesticides.reduce((acc, x) => acc + Number(x.quantity || 0), 0),
    latestApplication: pesticides[0]?.application_date?.split("T")[0] || "—",
  };

  const openCreateModal = () => { setEditingPesticide(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEditModal   = (item) => {
    setEditingPesticide(item);
    setForm({
      pesticide_name:   item.pesticide_name   || "",
      quantity:         String(item.quantity  || ""),
      unit:             item.unit             || "",
      application_date: item.application_date?.split("T")[0] || "",
      notes:            item.notes            || "",
    });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingPesticide(null); setForm(EMPTY_FORM); };

  const handleChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.pesticide_name || !form.quantity || !form.unit || !form.application_date) {
      pushToast(t("messages.VALIDATION_ERROR"), "error"); return;
    }
    const qty = Number(form.quantity);
    if (qty <= 0 || !Number.isInteger(qty)) {
      pushToast("Quantity must be a positive integer", "error"); return;
    }
    try {
      setLoading(true);
      if (editingPesticide) {
        await PesticidesService.update(editingPesticide.id, form);
        pushToast(t("pesticides.updated"));
      } else {
        await PesticidesService.create(form);
        pushToast(t("pesticides.created"));
      }
      closeModal();
      await loadPesticides(debouncedFilters);
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePesticide) return;
    try {
      setLoading(true);
      await PesticidesService.delete(deletePesticide.id);
      pushToast(t("pesticides.deleted"));
      setDeletePesticide(null);
      await loadPesticides(debouncedFilters);
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={s.itemCard}>
      <View style={s.cardHeader}>
        <Text style={s.itemName} numberOfLines={1}>{item.pesticide_name}</Text>
        <Text style={s.qtyChip}>{item.quantity} {item.unit}</Text>
      </View>
      <View style={s.cardGrid}>
        <View style={s.gridItem}>
          <Text style={s.gridLabel}>{t("pesticides.financial_year")}</Text>
          <Text style={s.gridValue}>{item.financial_year || "—"}</Text>
        </View>
        <View style={s.gridItem}>
          <Text style={s.gridLabel}>{t("pesticides.application_date")}</Text>
          <Text style={s.gridValue}>{item.application_date?.split("T")[0] || "—"}</Text>
        </View>
        {!!item.notes && (
          <View style={[s.gridItem, { flex: 2 }]}>
            <Text style={s.gridLabel}>{t("pesticides.notes")}</Text>
            <Text style={s.gridValue} numberOfLines={2}>{item.notes}</Text>
          </View>
        )}
      </View>
      <View style={s.cardActions}>
        <IconBtn onPress={() => openEditModal(item)} />
        <IconBtn onPress={() => setDeletePesticide(item)} danger />
      </View>
    </Card>
  );

  return (
    <ScreenShell title={t("pesticides.title")} scrollable={false}>
      <FlatList
        data={pesticides}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <PageHeader
              title={t("pesticides.title")}
              subtitle={t("pesticides.subtitle")}
              action={
                // <Button variant="primary" onPress={openCreateModal}>
                //   <IconPlus size={14} color="#fff" />
                //   {t("pesticides.add")}
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
                      {t("pesticides.add")}
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
                {t("pesticides.financial_year")}
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
                  label={t("pesticides.all_financial_years")}
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

            <View style={s.statsGrid}>
              {/* <StatCard icon={<IconFinancialYear />} iconBg={colors.infoBg} iconColor={colors.info} title={t("pesticides.financial_year")}>
                <Select value={filters.financial_year} onValueChange={(v) => setFilters((p) => ({ ...p, financial_year: v }))} style={s.fySelect}>
                  <Select.Item label={t("pesticides.all_financial_years")} value="all" />
                  {financialYears.map((fy) => <Select.Item key={fy} label={fy} value={fy} />)}
                </Select>
              </StatCard> */}

              <StatCard icon={<IconTotalRecords />} iconBg={colors.successBg} iconColor={colors.success} title={t("pesticides.total_records")}>
                <Text style={s.statValue}>{stats.total}</Text>
                <Text style={s.statSub}>{t("pesticides.records")}</Text>
              </StatCard>

              <StatCard icon={<IconTotalQuantity />} iconBg={colors.accent50} iconColor={colors.accent600} title={t("pesticides.total_quantity")}>
                <Text style={s.statValue}>{stats.totalQuantity}</Text>
                <Text style={s.statSub}>{t("pesticides.total_used")}</Text>
              </StatCard>

              <StatCard icon={<IconLatestApplication />} iconBg={colors.purpleBg} iconColor={colors.purple} title={t("pesticides.latest_application")}>
                <Text style={[s.statValue, { fontSize: fontSize.sm }]}>{stats.latestApplication}</Text>
                <Text style={s.statSub}>{t("pesticides.latest_record")}</Text>
              </StatCard>
            </View>

            <Card style={s.filterCard}>
              <SearchInput
                value={filters.search}
                onChangeText={(v) => setFilters((p) => ({ ...p, search: v }))}
                placeholder={t("pesticides.search")}
              />
            </Card>

            {loading && <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing[4] }} />}
            {!loading && pesticides.length === 0 && (
              <EmptyState icon={<IconPesticide size={24} color={colors.textMuted} />} message={t("pesticides.empty")} />
            )}
          </>
        }
      />

      <Modal open={modalOpen} onClose={closeModal} title={editingPesticide ? t("pesticides.edit") : t("pesticides.create")}>
        <View style={s.formGrid}>
          <Input label={t("pesticides.name")} value={form.pesticide_name} onChangeText={handleChange("pesticide_name")} placeholder={t("pesticides.name")} />
          <Input label={t("pesticides.quantity")} type="number" value={form.quantity} onChangeText={handleChange("quantity")} placeholder="e.g. 5" />
          <Select label={t("pesticides.unit")} value={form.unit} onValueChange={handleChange("unit")}>
            <Select.Item label={t("pesticides.select_unit")} value="" />
            {UNIT_OPTIONS.map((u) => <Select.Item key={u} label={t(`pesticides.unit_${u}`)} value={u} />)}
          </Select>
          <DateField label={t("pesticides.application_date")} value={form.application_date} onChange={handleChange("application_date")} />
          <Input label={t("pesticides.notes")} optional value={form.notes} onChangeText={handleChange("notes")} placeholder={t("pesticides.notes")} />
        </View>
        <View style={s.formActions}>
          <Button variant="secondary" onPress={closeModal}>{t("common.cancel")}</Button>
          <Button variant="primary" loading={loading} disabled={loading} onPress={handleSubmit}>
            {editingPesticide ? t("pesticides.update") : t("pesticides.create")}
          </Button>
        </View>
      </Modal>

      <ConfirmDialog
        open={!!deletePesticide}
        title={t("pesticides.delete")}
        message={`${t("pesticides.delete_confirm")} "${deletePesticide?.pesticide_name}"?`}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setDeletePesticide(null)}
        loading={loading}
      />
    </ScreenShell>
  );
}

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
  statsGrid:   { flexDirection: "row", flexWrap: "wrap", gap: spacing[3], marginBottom: spacing[3] },
  statCard:    { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[3], width: "47%" },
  statIcon:    { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statBody:    { flex: 1, gap: 2 },
  statTitle:   { fontSize: fontSize.xs, fontWeight: "600", color: colors.textMuted },
  statValue:   { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  statSub:     { fontSize: fontSize.xs, color: colors.textFaint },
  fySelect:    { marginTop: 2 },
  filterCard:  { padding: spacing[3], marginBottom: spacing[2] },

  itemCard:    { padding: spacing[4], borderRadius: radius.xl, gap: spacing[3] },
  cardHeader:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing[3] },
  itemName:    { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flex: 1 },
  qtyChip:     { fontSize: fontSize.sm, fontWeight: "600", color: colors.textMuted },
  cardGrid:    { flexDirection: "row", flexWrap: "wrap", gap: spacing[3] },
  gridItem:    { flex: 1, minWidth: "45%", gap: 4 },
  gridLabel:   { fontSize: 11, fontWeight: "700", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
  gridValue:   { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  cardActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing[2] },

  iconBtn:       { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  iconBtnDanger: { borderColor: "#fecaca", backgroundColor: colors.errorBg },

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