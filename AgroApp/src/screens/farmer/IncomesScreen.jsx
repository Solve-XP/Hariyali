// CONVERTED FROM: src/pages/farmer/Incomes.jsx + Incomes.css
//
// Extra changes vs Fertilizers/Pesticides:
//   Farm → Crop cascade dropdown: handleFarmSelect fetches crops by farm_id
//   Amount formatted with ₹ + toLocaleString
//   Income card header shows crop name + farm name + green amount
//   Promise.all for initial load

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

import {
  IconPlus, IconEdit, IconTrash,
  IconFarm, IconCrop, IconFarmYear, IconExpense,
} from "../../components/Icons";

import { FarmsService }   from "../../services/farmsService";
import { CropsService }   from "../../services/cropsService";
import { IncomesService } from "../../services/incomesService";
import { useApp }         from "../../context/AppContext";
import { colors, spacing, radius, fontSize } from "../../theme";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  farm_id:          "",
  crop_id:          "",
  harvest_quantity: "",
  unit:             "",
  amount:           "",
  income_date:      "",
  notes:            "",
};

const UNIT_OPTIONS = [
  "kg", "quintal", "ton", "gram",
  "bag", "crate", "dozen", "piece", "liter", "ml", "other",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

export default function IncomesScreen() {
  const { t }         = useTranslation();
  const { pushToast } = useApp();

  const [farms,         setFarms]         = useState([]);
  const [allCrops,      setAllCrops]      = useState([]);
  const [crops,         setCrops]         = useState([]);  // filtered by selected farm
  const [incomes,       setIncomes]       = useState([]);
  const [financialYears,setFinancialYears]= useState([]);
  const [loading,       setLoading]       = useState(false);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deleteIncome,  setDeleteIncome]  = useState(null);
  const [form,          setForm]          = useState(EMPTY_FORM);

  const [filters, setFilters] = useState({
    search: "", farm_id: "all", financial_year: "all",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // ── Debounce ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  // ── Initial load — Promise.all same as web ─────────────────────────────────
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [farmsRes, cropsRes, incomesRes] = await Promise.all([
        FarmsService.getAll(),
        CropsService.getAll(),
        IncomesService.getAll(),
      ]);
      setFarms(farmsRes    ?? []);
      setAllCrops(cropsRes ?? []);
      const data = incomesRes ?? [];
      setIncomes(data);
      const years = [...new Set(data.map((x) => x.financial_year).filter(Boolean))].sort();
      setFinancialYears(years);
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadInitialData(); }, []);

  // ── Load with filters ──────────────────────────────────────────────────────
  const loadIncomes = useCallback(async (f = debouncedFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (f.search?.trim())                              params.search         = f.search.trim();
      if (f.farm_id        && f.farm_id        !== "all") params.farm_id        = f.farm_id;
      if (f.financial_year && f.financial_year !== "all") params.financial_year = f.financial_year;

      const data = (await IncomesService.getAll(params)) ?? [];
      setIncomes(data);
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

  useEffect(() => { loadIncomes(debouncedFilters); }, [debouncedFilters]);

  // ── Farm → Crop cascade — same as web handleFarmSelect ────────────────────
  const handleFarmSelect = async (farmId) => {
    setForm((prev) => ({ ...prev, farm_id: farmId, crop_id: "" }));
    if (!farmId) { setCrops([]); return; }
    try {
      const res = await CropsService.getAll({ farm_id: farmId });
      setCrops(res ?? []);
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    }
  };

  // ── Maps for display ───────────────────────────────────────────────────────
  const farmsMap = useMemo(
    () => Object.fromEntries(farms.map((f) => [f.id, f.farm_name])),
    [farms]
  );
  const cropsMap = useMemo(
    () => Object.fromEntries(allCrops.map((c) => [c.id, c.crop_name])),
    [allCrops]
  );

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total:        incomes.length,
    farms:        new Set(incomes.map((x) => x.farm_id)).size,
    crops:        new Set(incomes.map((x) => x.crop_id)).size,
    totalIncome:  incomes.reduce((sum, x) => sum + Number(x.amount || 0), 0),
  };

  // ── Modal ──────────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingIncome(null); setForm(EMPTY_FORM); setCrops([]); setModalOpen(true);
  };

  const openEditModal = async (income) => {
    setEditingIncome(income);
    setForm({
      farm_id:          income.farm_id          || "",
      crop_id:          income.crop_id          || "",
      harvest_quantity: String(income.harvest_quantity || ""),
      unit:             income.unit             || "",
      amount:           String(income.amount    || ""),
      income_date:      income.income_date?.split("T")[0] || "",
      notes:            income.notes            || "",
    });
    setModalOpen(true);
    try {
      const res = await CropsService.getAll({ farm_id: income.farm_id });
      setCrops(res ?? []);
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    }
  };

  const closeModal = () => {
    setModalOpen(false); setEditingIncome(null); setForm(EMPTY_FORM); setCrops([]);
  };

  const handleChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.farm_id || !form.crop_id || !form.amount) {
      pushToast(t("messages.VALIDATION_ERROR"), "error"); return;
    }
    try {
      setLoading(true);
      if (editingIncome) {
        await IncomesService.update(editingIncome.id, form);
        pushToast("Income updated");
      } else {
        await IncomesService.create(form);
        pushToast("Income created");
      }
      closeModal();
      await loadIncomes(debouncedFilters);
      await loadInitialData();
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteIncome) return;
    try {
      setLoading(true);
      await IncomesService.delete(deleteIncome.id);
      pushToast("Income deleted");
      setDeleteIncome(null);
      await loadIncomes(debouncedFilters);
      await loadInitialData();
    } catch {
      pushToast(t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Income card ────────────────────────────────────────────────────────────
  const renderItem = ({ item: income }) => {
    const cropName = income.crop_name || income.crop?.crop_name || cropsMap[income.crop_id];
    const farmName = farmsMap[income.farm_id];

    return (
      <Card style={s.itemCard}>
        {/* Header: crop + farm + ₹ amount */}
        <View style={s.cardHeader}>
          <View style={s.headerLeft}>
            <Text style={s.cropName} numberOfLines={1}>{cropName || "—"}</Text>
            <Text style={s.farmName}  numberOfLines={1}>{farmName || "—"}</Text>
          </View>
          <Text style={s.amount}>₹ {Number(income.amount || 0).toLocaleString()}</Text>
        </View>

        {/* Body grid */}
        <View style={s.cardGrid}>
          <View style={s.gridItem}>
            <Text style={s.gridLabel}>{t("incomes.financial_year")}</Text>
            <Text style={s.gridValue}>{income.financial_year || "—"}</Text>
          </View>
          <View style={s.gridItem}>
            <Text style={s.gridLabel}>Harvest</Text>
            <Text style={s.gridValue}>{income.harvest_quantity} {income.unit}</Text>
          </View>
          <View style={s.gridItem}>
            <Text style={s.gridLabel}>Income Date</Text>
            <Text style={s.gridValue}>{income.income_date?.split("T")[0] || "—"}</Text>
          </View>
        </View>

        <View style={s.cardActions}>
          <IconBtn onPress={() => openEditModal(income)} />
          <IconBtn onPress={() => setDeleteIncome(income)} danger />
        </View>
      </Card>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <ScreenShell title={t("incomes.title")} scrollable={false}>
      <FlatList
        data={incomes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <PageHeader
              title={t("incomes.title")}
              subtitle={t("incomes.subtitle")}
              action={
                // <Button variant="primary" onPress={openCreateModal}>
                //   <IconPlus size={14} color="#fff" />
                //   {t("incomes.add")}
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
                      {t("incomes.add")}
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
                {t("incomes.financial_year")}
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
                  label={t("incomes.all_financial_years")}
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

            {/* Stats */}
            <View style={s.statsGrid}>
              {/* Financial year filter */}
              {/* <StatCard icon={<IconFarmYear />} iconBg={colors.infoBg} iconColor={colors.info} title={t("incomes.financial_year")}>
                <Select value={filters.financial_year} onValueChange={(v) => setFilters((p) => ({ ...p, financial_year: v }))} style={s.fySelect}>
                  <Select.Item label={t("incomes.all_financial_years")} value="all" />
                  {financialYears.map((fy) => <Select.Item key={fy} label={fy} value={fy} />)}
                </Select>
              </StatCard> */}

              {/* Total income */}
              <StatCard icon={<IconExpense />} iconBg={colors.successBg} iconColor={colors.success} title={t("incomes.total_income")}>
                <Text style={[s.statValue, { fontSize: fontSize.sm, color: colors.success }]}>
                  ₹ {stats.totalIncome.toLocaleString()}
                </Text>
              </StatCard>

              {/* Connected farms */}
              <StatCard icon={<IconFarm />} iconBg={colors.accent50} iconColor={colors.accent600} title={t("incomes.connected_farms")}>
                <Text style={s.statValue}>{stats.farms}</Text>
              </StatCard>

              {/* Income crops */}
              <StatCard icon={<IconCrop />} iconBg={colors.purpleBg} iconColor={colors.purple} title={t("incomes.income_crops")}>
                <Text style={s.statValue}>{stats.crops}</Text>
              </StatCard>
            </View>

            {/* Search */}
            <Card style={s.filterCard}>
              <SearchInput
                value={filters.search}
                onChangeText={(v) => setFilters((p) => ({ ...p, search: v }))}
                placeholder={t("incomes.search")}
              />
            </Card>

            {loading && <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing[4] }} />}
            {!loading && incomes.length === 0 && (
              <EmptyState icon={<IconExpense size={24} color={colors.textMuted} />} message={t("incomes.empty")} />
            )}
          </>
        }
      />

      {/* ── Add / Edit Modal ──────────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingIncome ? "Edit Income" : "Add Income"}
      >
        <View style={s.formGrid}>

          {/* Farm dropdown → triggers crop cascade load */}
          <Select label={t("incomes.farm")} value={form.farm_id} onValueChange={handleFarmSelect}>
            <Select.Item label={t("incomes.select_farm")} value="" />
            {farms.map((f) => <Select.Item key={f.id} label={f.farm_name} value={f.id} />)}
          </Select>

          {/* Crop dropdown — disabled until farm selected, same as web */}
          <Select
            label={t("incomes.crop")}
            value={form.crop_id}
            onValueChange={handleChange("crop_id")}
            enabled={!!form.farm_id}
          >
            <Select.Item label={t("incomes.select_farm")} value="" />
            {crops.map((c) => <Select.Item key={c.id} label={c.crop_name} value={c.id} />)}
          </Select>

          <Input
            label={t("incomes.harvest_quantity")}
            type="number"
            value={form.harvest_quantity}
            onChangeText={handleChange("harvest_quantity")}
            placeholder="e.g. 100"
          />

          <Select label={t("incomes.unit")} value={form.unit} onValueChange={handleChange("unit")}>
            <Select.Item label={t("incomes.select_unit")} value="" />
            {UNIT_OPTIONS.map((u) => <Select.Item key={u} label={t(`incomes.unit_${u}`)} value={u} />)}
          </Select>

          <Input
            label={t("incomes.amount")}
            type="number"
            value={form.amount}
            onChangeText={handleChange("amount")}
            placeholder="e.g. 250000"
          />

          <DateField
            label={t("incomes.income_date")}
            value={form.income_date}
            onChange={handleChange("income_date")}
          />

          <Input
            label={t("incomes.notes")}
            optional
            value={form.notes}
            onChangeText={handleChange("notes")}
            placeholder={t("incomes.notes")}
          />
        </View>

        <View style={s.formActions}>
          <Button variant="secondary" onPress={closeModal}>{t("common.cancel")}</Button>
          <Button variant="primary" loading={loading} disabled={loading} onPress={handleSubmit}>
            {editingIncome ? t("incomes.update") : t("incomes.create")}
          </Button>
        </View>
      </Modal>

      {/* ── Delete confirm ────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteIncome}
        title={t("incomes.delete")}
        message={t("incomes.delete_confirm")}
        confirmText={t("incomes.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteIncome(null)}
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

  statsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: spacing[3], marginBottom: spacing[3] },
  statCard:   { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[3], width: "47%" },
  statIcon:   { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statBody:   { flex: 1, gap: 2 },
  statTitle:  { fontSize: fontSize.xs, fontWeight: "600", color: colors.textMuted },
  statValue:  { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  fySelect:   { marginTop: 2 },
  filterCard: { padding: spacing[3], marginBottom: spacing[2] },

  // Income card
  itemCard:   { padding: spacing[4], borderRadius: radius.xl, gap: spacing[3] },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[3] },
  headerLeft: { flex: 1, gap: 4 },
  cropName:   { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  farmName:   { fontSize: fontSize.sm, fontWeight: "500", color: colors.textMuted },
  amount:     { fontSize: fontSize.md, fontWeight: "700", color: colors.success, whiteSpace: "nowrap" },

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