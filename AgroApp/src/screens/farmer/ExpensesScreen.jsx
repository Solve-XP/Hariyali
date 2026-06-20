// CONVERTED FROM: src/pages/farmer/Expenses.jsx + Expenses.css
//
// Same pattern as IncomesScreen plus:
//   category badge — replaces .expense-category pill (primary-50 bg)
//   payment_method dropdown
//   quantity + unit are optional (crop_id also optional)
//   6-field mobile grid (farm, crop, qty, payment, date, financial_year)

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

import { FarmsService }    from "../../services/farmsService";
import { CropsService }    from "../../services/cropsService";
import { ExpensesService } from "../../services/expensesService";
import { useApp }          from "../../context/AppContext";
import { colors, spacing, radius, fontSize } from "../../theme";

// ─── Constants ────────────────────────────────────────────────────────────────

const UNIT_OPTIONS = [
  "kg","gram","quintal","ton","liter","ml","piece","packet",
  "bag","box","bottle","bundle","acre","hectare","hour","day",
  "person","trip","unit","other",
];

const CATEGORY_OPTIONS = [
  "fertilizer","pesticide","seeds","labor","diesel",
  "transport","equipment","electricity","water","maintenance","other",
];

const PAYMENT_OPTIONS = ["cash","upi","bank_transfer","credit","other"];

const EMPTY_FORM = {
  farm_id:"", crop_id:"", category:"", item_name:"",
  quantity:"", unit:"", amount:"", payment_method:"",
  expense_date:"", notes:"",
};

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
      {danger ? <IconTrash size={15} color={colors.error} /> : <IconEdit size={15} color={colors.textMuted} />}
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

export default function ExpensesScreen() {
  const { t }         = useTranslation();
  const { pushToast } = useApp();

  const [farms,          setFarms]          = useState([]);
  const [allCrops,       setAllCrops]       = useState([]);
  const [crops,          setCrops]          = useState([]);
  const [expenses,       setExpenses]       = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteExpense,  setDeleteExpense]  = useState(null);
  const [form,           setForm]           = useState({ ...EMPTY_FORM });

  const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  // India FY: Apr → Mar
  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
  };
  
  const [filters, setFilters] = useState({
    search: "", farm_id: "all", category: "all", financial_year: getCurrentFinancialYear(),
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
      const [farmsRes, cropsRes, expensesRes] = await Promise.all([
        FarmsService.getAll(),
        CropsService.getAll(),
        ExpensesService.getAll(),
      ]);
      setFarms(farmsRes    ?? []);
      setAllCrops(cropsRes ?? []);
      const data = expensesRes ?? [];
      setExpenses(data);
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
  const loadExpenses = useCallback(async (f = debouncedFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (f.search?.trim())                              params.search         = f.search.trim();
      if (f.farm_id        && f.farm_id        !== "all") params.farm_id        = f.farm_id;
      if (f.category       && f.category       !== "all") params.category       = f.category;
      if (f.financial_year && f.financial_year !== "all") params.financial_year = f.financial_year;

      const data = (await ExpensesService.getAll(params)) ?? [];
      setExpenses(data);
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

  useEffect(() => { loadExpenses(debouncedFilters); }, [debouncedFilters]);

  // ── Farm → Crop cascade ────────────────────────────────────────────────────
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

  // ── Maps ───────────────────────────────────────────────────────────────────
  const farmsMap = useMemo(
    () => Object.fromEntries(farms.map((f) => [f.id, f.farm_name])), [farms]
  );
  const cropsMap = useMemo(
    () => Object.fromEntries(allCrops.map((c) => [c.id, c.crop_name])), [allCrops]
  );

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    totalExpenses: expenses.reduce((s, x) => s + Number(x.amount || 0), 0),
    farms:         new Set(expenses.map((x) => x.farm_id)).size,
    crops:         new Set(expenses.filter((x) => x.crop_id).map((x) => x.crop_id)).size,
  };

  // ── Modal ──────────────────────────────────────────────────────────────────
  const openCreateModal = () => { setEditingExpense(null); setForm({ ...EMPTY_FORM }); setCrops([]); setModalOpen(true); };

  const openEditModal = async (expense) => {
    setEditingExpense(expense);
    setForm({
      farm_id:        expense.farm_id        || "",
      crop_id:        expense.crop_id        || "",
      category:       expense.category       || "",
      item_name:      expense.item_name      || "",
      quantity:       String(expense.quantity || ""),
      unit:           expense.unit           || "",
      amount:         String(expense.amount  || ""),
      payment_method: expense.payment_method || "",
      expense_date:   expense.expense_date?.split("T")[0] || "",
      notes:          expense.notes          || "",
    });
    setModalOpen(true);
    if (expense.farm_id) {
      try {
        const res = await CropsService.getAll({ farm_id: expense.farm_id });
        setCrops(res ?? []);
      } catch {}
    }
  };

  const closeModal = () => { setModalOpen(false); setEditingExpense(null); setForm({ ...EMPTY_FORM }); setCrops([]); };
  const handleChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.farm_id || !form.category || !form.item_name || !form.amount || !form.payment_method) {
      pushToast(t("expenses.validation_error"), "error"); return;
    }
    try {
      setLoading(true);
      const payload = {
        ...form,
        crop_id:  form.crop_id  || null,
        quantity: form.quantity === "" ? null : Number(form.quantity),
        unit:     form.unit     || null,
        notes:    form.notes    || null,
      };
      if (editingExpense) {
        await ExpensesService.update(editingExpense.id, payload);
        pushToast(t("expenses.updated"), "success");
      } else {
        await ExpensesService.create(payload);
        pushToast(t("expenses.created"), "success");
      }
      closeModal();
      await loadExpenses(debouncedFilters);
      await loadInitialData();
    } catch (error) {
      pushToast(error?.response?.data?.detail || t("messages.GENERIC_ERROR"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteExpense) return;
    try {
      setLoading(true);
      await ExpensesService.delete(deleteExpense.id);
      pushToast(t("expenses.deleted"));
      setDeleteExpense(null);
      await loadExpenses(debouncedFilters);
      await loadInitialData();
    } catch {
      pushToast(t("expenses.delete_failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Expense card ───────────────────────────────────────────────────────────
  const renderItem = ({ item: expense }) => {
    const cropName = expense.crop_name || expense.crop?.crop_name || cropsMap[expense.crop_id];
    return (
      <Card style={s.itemCard}>
        {/* Header: item name + category badge + ₹ amount */}
        <View style={s.cardHeader}>
          <View style={s.headerLeft}>
            <Text style={s.itemName} numberOfLines={1}>{expense.item_name || "—"}</Text>
            {/* Category badge — replaces .expense-category pill */}
            <View style={s.categoryBadge}>
              <Text style={s.categoryText}>{expense.category || "—"}</Text>
            </View>
          </View>
          <Text style={s.amount}>₹ {Number(expense.amount || 0).toLocaleString()}</Text>
        </View>

        {/* 6-field grid */}
        <View style={s.cardGrid}>
          {[
            { label: t("expenses.farm"),            value: farmsMap[expense.farm_id] || "—" },
            { label: t("expenses.crop"),            value: cropName || "—" },
            { label: t("expenses.quantity"),        value: `${expense.quantity || 0} ${expense.unit || ""}`.trim() },
            { label: t("expenses.payment_method"),  value: expense.payment_method || "—" },
            { label: t("expenses.expense_date"),    value: expense.expense_date?.split("T")[0] || "—" },
            { label: t("expenses.financial_year"),  value: expense.financial_year || "—" },
          ].map(({ label, value }) => (
            <View key={label} style={s.gridItem}>
              <Text style={s.gridLabel}>{label}</Text>
              <Text style={s.gridValue} numberOfLines={1}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={s.cardActions}>
          <IconBtn onPress={() => openEditModal(expense)} />
          <IconBtn onPress={() => setDeleteExpense(expense)} danger />
        </View>
      </Card>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <ScreenShell title={t("expenses.title")} scrollable={false}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <PageHeader
              title={t("expenses.title")}
              subtitle={t("expenses.subtitle")}
              action={
                // <Button variant="primary" onPress={openCreateModal}>
                //   <IconPlus size={14} color="#fff" />
                //   {t("expenses.add")}
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
                      {t("expenses.add")}
                    </Text>
                  </View>
                </Button>
              }
            />

            <Card style={s.financialYearCard}>
  <Text style={s.financialYearLabel}>
    {t("expenses.financial_year")}
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
          label={t("expenses.all_financial_years")}
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
              {/* <StatCard icon={<IconFarmYear />} iconBg={colors.infoBg} iconColor={colors.info} title={t("expenses.financial_year")}>
                <Select value={filters.financial_year} onValueChange={(v) => setFilters((p) => ({ ...p, financial_year: v }))} style={s.fySelect}>
                  <Select.Item label={t("expenses.all_financial_years")} value="all" />
                  {financialYears.map((fy) => <Select.Item key={fy} label={fy} value={fy} />)}
                </Select>
              </StatCard> */}

              <StatCard icon={<IconExpense />} iconBg={colors.successBg} iconColor={colors.success} title={t("expenses.total_expenses")}>
                <Text style={[s.statValue, { fontSize: fontSize.sm, color: colors.error }]}>
                  ₹ {stats.totalExpenses.toLocaleString()}
                </Text>
              </StatCard>

              <StatCard icon={<IconFarm />} iconBg={colors.accent50} iconColor={colors.accent600} title={t("expenses.farms")}>
                <Text style={s.statValue}>{stats.farms}</Text>
              </StatCard>

              <StatCard icon={<IconCrop />} iconBg={colors.purpleBg} iconColor={colors.purple} title={t("expenses.crops")}>
                <Text style={s.statValue}>{stats.crops}</Text>
              </StatCard>
            </View>

            {/* Search */}
            <Card style={s.filterCard}>
              <SearchInput
                value={filters.search}
                onChangeText={(v) => setFilters((p) => ({ ...p, search: v }))}
                placeholder={t("expenses.search")}
              />
            </Card>

            {loading && <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing[4] }} />}
            {!loading && expenses.length === 0 && (
              <EmptyState icon={<IconExpense size={24} color={colors.textMuted} />} message={t("expenses.empty")} />
            )}
          </>
        }
      />

      {/* ── Modal ─────────────────────────────────────────────── */}
      <Modal open={modalOpen} onClose={closeModal} title={editingExpense ? t("expenses.edit") : t("expenses.add")}>
        <View style={s.formGrid}>

          <Select label={t("expenses.farm")} value={form.farm_id} onValueChange={handleFarmSelect}>
            <Select.Item label={t("expenses.select_farm")} value="" />
            {farms.map((f) => <Select.Item key={f.id} label={f.farm_name} value={f.id} />)}
          </Select>

          {/* crop_id is optional for expenses */}
          <Select label={t("expenses.crop")} optional value={form.crop_id} onValueChange={handleChange("crop_id")}>
            <Select.Item label={t("expenses.select_crop")} value="" />
            {crops.map((c) => <Select.Item key={c.id} label={c.crop_name} value={c.id} />)}
          </Select>

          <Select label={t("expenses.category")} value={form.category} onValueChange={handleChange("category")}>
            <Select.Item label={t("expenses.select_category")} value="" />
            {CATEGORY_OPTIONS.map((c) => <Select.Item key={c} label={t(`expenses.category_${c}`)} value={c} />)}
          </Select>

          <Input
            label={t("expenses.item_name")}
            value={form.item_name}
            onChangeText={handleChange("item_name")}
            placeholder={t("expenses.item_name")}
          />

          <Input
            label={t("expenses.quantity")}
            optional
            type="number"
            value={form.quantity}
            onChangeText={handleChange("quantity")}
            placeholder="e.g. 10"
          />

          <Select label={t("expenses.unit")} optional value={form.unit} onValueChange={handleChange("unit")}>
            <Select.Item label={t("expenses.select_unit")} value="" />
            {UNIT_OPTIONS.map((u) => <Select.Item key={u} label={t(`expenses.units_${u}`)} value={u} />)}
          </Select>

          <Input
            label={t("expenses.amount")}
            type="number"
            value={form.amount}
            onChangeText={handleChange("amount")}
            placeholder="e.g. 450"
          />

          <Select label={t("expenses.payment_method")} value={form.payment_method} onValueChange={handleChange("payment_method")}>
            <Select.Item label={t("expenses.select_payment")} value="" />
            {PAYMENT_OPTIONS.map((m) => <Select.Item key={m} label={t(`expenses.payment_${m}`)} value={m} />)}
          </Select>

          <DateField
            label={t("expenses.expense_date")}
            value={form.expense_date}
            onChange={handleChange("expense_date")}
          />

          <Input
            label={t("expenses.notes")}
            optional
            value={form.notes}
            onChangeText={handleChange("notes")}
            placeholder={t("expenses.notes")}
          />
        </View>

        <View style={s.formActions}>
          <Button variant="secondary" onPress={closeModal}>{t("common.cancel")}</Button>
          <Button variant="primary" loading={loading} disabled={loading} onPress={handleSubmit}>
            {editingExpense ? t("expenses.update") : t("expenses.create")}
          </Button>
        </View>
      </Modal>

      {/* ── Delete confirm ─────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteExpense}
        title={t("expenses.delete")}
        message={t("expenses.delete_confirm")}
        confirmText={t("expenses.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteExpense(null)}
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

  statsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: spacing[3], marginBottom: spacing[3], marginTop: spacing[3] },
  statCard:   { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[3], width: "47%" },
  statIcon:   { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statBody:   { flex: 1, gap: 2 },
  statTitle:  { fontSize: fontSize.xs, fontWeight: "600", color: colors.textMuted },
  statValue:  { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  fySelect:   { marginTop: 2 },
  filterCard: { padding: spacing[3], marginBottom: spacing[2] },

  // Expense card
  itemCard:   { padding: spacing[4], borderRadius: radius.xl, gap: spacing[3] },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing[3] },
  headerLeft: { flex: 1, gap: 6 },
  itemName:   { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },

  // Category badge — replaces .expense-category pill (primary-50 bg, primary color)
  categoryBadge: {
    alignSelf:         "flex-start",
    paddingVertical:   4,
    paddingHorizontal: 10,
    borderRadius:      radius.pill,
    backgroundColor:   colors.primary50,
    borderWidth:       1,
    borderColor:       colors.primary100,
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
  categoryText: { fontSize: fontSize.xs, fontWeight: "600", color: colors.primary },

  amount: { fontSize: fontSize.md, fontWeight: "700", color: colors.error },

  // 6-field grid — replaces .expense-mobile-grid grid-template-columns: 1fr 1fr
  cardGrid:    { flexDirection: "row", flexWrap: "wrap", gap: spacing[3] },
  gridItem:    { width: "47%", gap: 4 },
  gridLabel:   { fontSize: 11, fontWeight: "700", color: colors.textFaint, textTransform: "uppercase", letterSpacing: 0.4 },
  gridValue:   { fontSize: fontSize.sm, fontWeight: "600", color: colors.text },
  cardActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing[2] },

  iconBtn:       { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  iconBtnDanger: { borderColor: "#fecaca", backgroundColor: colors.errorBg },

  formGrid:    { gap: spacing[4] },
  formActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing[3], marginTop: spacing[5] },
});