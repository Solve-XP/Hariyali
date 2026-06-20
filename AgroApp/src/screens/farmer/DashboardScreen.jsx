// CONVERTED FROM: src/pages/farmer/Dashboard.jsx + Dashboard.css
//
// Key changes:
//   recharts (browser only)     → victory-native (VictoryLine, VictoryPie)
//   <table> recent tables        → FlatList rows
//   useNavigate                  → useNavigation + navigate to tab screen names
//   grid-template-columns        → flexWrap / FlatList numColumns
//   <button> quick actions       → TouchableOpacity

import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  FlatList, ActivityIndicator, StyleSheet, Dimensions,
} from "react-native";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryPie,
} from "victory-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell from "../../components/ScreenShell";
import Card from "../../components/Card";
import Select from "../../components/Select";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";

import {
  IconFarm, IconIncome, IconExpense, IconCrop,
  IconRental, IconFertilizer, IconPesticide, IconPlus,
} from "../../components/Icons";

import { DashboardService } from "../../services/dashboardService";
import { useApp }           from "../../context/AppContext";
import { colors, spacing, radius, fontSize } from "../../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - spacing[4] * 2 - 32; // full width minus padding

const PIE_COLORS = ["#16a34a","#2563eb","#f59e0b","#dc2626","#9333ea","#0891b2"];

// ── Quick action colour map ────────────────────────────────────────────────────
const ACTION_COLORS = {
  farm:       ["#10b981","#059669"],
  income:     ["#3b82f6","#2563eb"],
  expense:    ["#ef4444","#dc2626"],
  fertilizer: ["#eab308","#ca8a04"],
  pesticide:  ["#a855f7","#9333ea"],
  rental:     ["#06b6d4","#0284c7"],
};

export default function DashboardScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const { pushToast } = useApp();

  const [loading,            setLoading]            = useState(true);
  const [summary,            setSummary]            = useState(null);
  const [financialAnalytics, setFinancialAnalytics] = useState([]);
  const [recentIncomes,      setRecentIncomes]      = useState([]);
  const [recentExpenses,     setRecentExpenses]     = useState([]);
  const [expenseBreakdown,   setExpenseBreakdown]   = useState([]);
  const [incomeBreakdown,    setIncomeBreakdown]    = useState([]);
  const [financialYears,     setFinancialYears]     = useState([]);
  const [selectedFY,         setSelectedFY]         = useState("");

  // ── Load filter options on mount ──────────────────────────────────────────
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const data   = await DashboardService.getFilterOptions();
  //       const years  = data.financial_years || [];
  //       setFinancialYears(years);
  //       if (years.length > 0) setSelectedFY(years[0]);
  //     } catch {
  //       pushToast(t("messages.GENERIC_ERROR"), "error");
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      try {
        const data  = await DashboardService.getFilterOptions();
        const years = data.financial_years || [];

        setFinancialYears(years);

        // Current financial year
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const currentFY =
          month >= 4
            ? `${year}-${year + 1}`
            : `${year - 1}-${year}`;

        // Set current FY if exists, otherwise first option
        if (years.includes(currentFY)) {
          setSelectedFY(currentFY);
        } else if (years.length > 0) {
          setSelectedFY(years[0]);
        }

      } catch {
        pushToast(t("messages.GENERIC_ERROR"), "error");
      }
    })();
  }, []);

  // ── Load dashboard data when FY changes ───────────────────────────────────
  useEffect(() => {
    if (!selectedFY) return;
    (async () => {
      try {
        setLoading(true);
        const [
          summaryRes, analyticsRes, incomesRes,
          expensesRes, expenseRes, incomeRes,
        ] = await Promise.all([
          DashboardService.getSummary(selectedFY),
          DashboardService.getFinancialAnalytics(selectedFY),
          DashboardService.getRecentIncomes(),
          DashboardService.getRecentExpenses(),
          DashboardService.getExpenseBreakdown(selectedFY),
          DashboardService.getIncomeBreakdown(selectedFY),
        ]);
        setSummary(summaryRes           || {});
        setFinancialAnalytics(analyticsRes || []);
        setRecentIncomes(incomesRes      || []);
        setRecentExpenses(expensesRes    || []);
        setExpenseBreakdown(expenseRes   || []);
        setIncomeBreakdown(incomeRes     || []);
      } catch {
        pushToast(t("messages.GENERIC_ERROR"), "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedFY]);

  const netProfit = useMemo(
    () => Number(summary?.total_income || 0) - Number(summary?.total_expenses || 0),
    [summary]
  );

  // ── Chart X-axis key — same logic as web ──────────────────────────────────
  const chartXKey = useMemo(
    () => (financialAnalytics?.length > 0 && financialAnalytics[0]?.year ? "year" : "month"),
    [financialAnalytics]
  );

  // ── Quick actions — navigate to tab screen names ───────────────────────────
  // Web used navigate("/farmer/farms") — RN uses tab + stack screen names
  const quickActions = [
    { label: t("dashboard.add_farm"),       screen: "FarmsHome",    type: "farm"       },
    { label: t("dashboard.add_income"),     screen: "IncomesHome",  type: "income"     },
    { label: t("dashboard.add_expense"),    screen: "Expenses",     type: "expense"    },
    { label: t("dashboard.add_fertilizer"), screen: "Fertilizers",  type: "fertilizer" },
    { label: t("dashboard.add_pesticide"),  screen: "Pesticides",   type: "pesticide"  },
    { label: t("dashboard.rent_equipment"), screen: "RentalsHome",  type: "rental"     },
  ];

  // ── KPI stats ─────────────────────────────────────────────────────────────
  const kpiCards = [
    { icon: <IconFarm size={20} color={colors.success} />, iconBg: colors.successBg, title: t("dashboard.total_farms"), value: summary?.total_farms || 0, sub: t("dashboard.connected_farms") },
    { icon: <IconCrop    size={20} color={colors.info}     />, iconBg: colors.infoBg,     title: t("dashboard.total_crops"),     value: summary?.total_crops     || 0, sub: t("dashboard.active_crops") },
    { icon: <IconIncome  size={20} color={colors.accent600}/>, iconBg: colors.accent50,   title: t("dashboard.total_income"),    value: `₹ ${summary?.total_income     || 0}`, sub: selectedFY },
    { icon: <IconExpense size={20} color={colors.purple}   />, iconBg: colors.purpleBg,   title: t("dashboard.total_expenses"),  value: `₹ ${summary?.total_expenses   || 0}`, sub: selectedFY },
    { icon: <IconRental  size={20} color={colors.cyan}     />, iconBg: colors.cyanBg,     title: t("dashboard.rental_listings"), value: summary?.total_rentals   || 0, sub: t("dashboard.equipment_marketplace") },
  ];

  if (loading) {
    return (
      <ScreenShell title={t("dashboard.title")}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} size="large" />
      </ScreenShell>
    );
  }

  
  return (
    <ScreenShell title={t("dashboard.title")}>
      <PageHeader title={t("dashboard.title")} subtitle={t("dashboard.subtitle")} />

      {/* ── Financial year filter ────────────────────────────────────────── */}
      <View style={s.fyWrap}>
        <Select value={selectedFY} onValueChange={setSelectedFY} style={s.fySelect}>
          {financialYears.map((fy) => <Select.Item key={fy} label={fy} value={fy} />)}
        </Select>
      </View>

      {/* ── KPI cards — replaces grid-template-columns: repeat(5, 1fr) ───── */}
      <View style={s.statsGrid}>
        {kpiCards.map((kpi) => (
          <View key={kpi.title} style={s.statsCardWrap}>
            <StatCard
              icon={kpi.icon}
              title={kpi.title}
              value={String(kpi.value)}
              subtitle={kpi.sub}
              colorVariant="default"
            />
          </View>
        ))}
      </View>

      {/* ── Financial overview chart + net profit ─────────────────────────── */}
      <Card style={s.chartCard}>
        <View style={s.cardHeader}>
          <View>
            <Text style={s.cardTitle}>{t("dashboard.financial_overview")}</Text>
            <Text style={s.cardSub}>{selectedFY}</Text>
          </View>
        </View>

        {/* Net profit — replaces .financial-overview-side */}
        <View style={s.profitSection}>
          <Text style={s.profitLabel}>{t("dashboard.net_profit")}</Text>
          <Text style={[s.profitValue, { color: netProfit >= 0 ? colors.success : colors.error }]}>
            ₹ {netProfit.toLocaleString()}
          </Text>
          <Text style={s.profitSub}>{t("dashboard.income_minus_expenses")}</Text>
        </View>

        {/* Line chart — replaces recharts LineChart */}
        {financialAnalytics.length > 0 ? (
          <VictoryChart
            width={CHART_WIDTH}
            height={260}
            padding={{ top: 20, bottom: 40, left: 60, right: 20 }}
          >
            <VictoryAxis
              tickValues={financialAnalytics.map((d) => d[chartXKey])}
              style={{ tickLabels: { fontSize: 10, fill: colors.textMuted } }}
            />
            <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 10, fill: colors.textMuted } }} />
            <VictoryLine
              data={financialAnalytics}
              x={chartXKey} y="income"
              style={{ data: { stroke: "#16a34a", strokeWidth: 3 } }}
            />
            <VictoryLine
              data={financialAnalytics}
              x={chartXKey} y="expenses"
              style={{ data: { stroke: "#dc2626", strokeWidth: 3 } }}
            />
            <VictoryLine
              data={financialAnalytics}
              x={chartXKey} y="profit"
              style={{ data: { stroke: "#2563eb", strokeWidth: 3 } }}
            />
          </VictoryChart>
        ) : (
          <Text style={s.noData}>{t("dashboard.no_data")}</Text>
        )}

        {/* Legend */}
        <View style={s.legend}>
          {[["#16a34a", t("dashboard.income")], ["#dc2626", t("dashboard.expenses")], ["#2563eb", t("dashboard.profit")]].map(([color, label]) => (
            <View key={label} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: color }]} />
              <Text style={s.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* ── Quick actions — replaces .quick-actions-grid ─────────────────── */}
      <Card style={s.actionsCard}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>{t("dashboard.quick_actions")}</Text>
          <Text style={s.cardSub}>{t("dashboard.quick_actions_subtitle")}</Text>
        </View>
        <View style={s.actionsGrid}>
          {quickActions.map((action) => {
            const [c1, c2] = ACTION_COLORS[action.type];
            return (
              <TouchableOpacity
                key={action.label}
                style={s.actionBtn}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <View style={[s.actionIcon, { backgroundColor: c1 }]}>
                  <IconPlus size={18} color="#fff" />
                </View>
                <Text style={s.actionLabel} numberOfLines={2}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* ── Recent incomes table ─────────────────────────────────────────── */}
      <Card>
        <View style={s.tableHeader}>
          <Text style={s.cardTitle}>{t("dashboard.recent_incomes")}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("IncomesHome")}>
            <Text style={s.viewAll}>{t("dashboard.view_all")}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.tableHead}>
          <Text style={[s.th, { flex: 1 }]}>{t("dashboard.amount")}</Text>
          <Text style={[s.th, { flex: 1 }]}>{t("dashboard.date")}</Text>
        </View>
        {recentIncomes.map((item) => (
          <View key={item._id} style={s.tableRow}>
            <Text style={[s.td, { flex: 1 }]}>₹ {item.amount}</Text>
            <Text style={[s.td, { flex: 1 }]}>{item.income_date?.split("T")[0]}</Text>
          </View>
        ))}
        {recentIncomes.length === 0 && <Text style={s.noData}>{t("dashboard.no_data")}</Text>}
      </Card>

      {/* ── Recent expenses table ────────────────────────────────────────── */}
      <Card>
        <View style={s.tableHeader}>
          <Text style={s.cardTitle}>{t("dashboard.recent_expenses")}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Expenses")}>
            <Text style={s.viewAll}>{t("dashboard.view_all")}</Text>
          </TouchableOpacity>
        </View>
        <View style={s.tableHead}>
          <Text style={[s.th, { flex: 1 }]}>{t("dashboard.name")}</Text>
          <Text style={[s.th, { flex: 1 }]}>{t("dashboard.amount")}</Text>
        </View>
        {recentExpenses.map((item) => (
          <View key={item._id} style={s.tableRow}>
            <Text style={[s.td, { flex: 1 }]} numberOfLines={1}>{item.item_name}</Text>
            <Text style={[s.td, { flex: 1 }]}>₹ {item.amount}</Text>
          </View>
        ))}
        {recentExpenses.length === 0 && <Text style={s.noData}>{t("dashboard.no_data")}</Text>}
      </Card>

      {/* ── Pie charts — replaces recharts PieChart ──────────────────────── */}
      <View style={s.pieRow}>

        {/* Expense breakdown */}
        <Card style={s.pieCard}>
          <Text style={s.cardTitle}>{t("dashboard.expense_breakdown")}</Text>
          {expenseBreakdown.length > 0 ? (
            <VictoryPie
              data={expenseBreakdown.map((d) => ({ x: d.category, y: d.total }))}
              width={CHART_WIDTH / 2 - spacing[4]}
              height={200}
              colorScale={PIE_COLORS}
              innerRadius={40}
              style={{ labels: { fontSize: 9, fill: colors.text } }}
              padding={30}
            />
          ) : (
            <Text style={s.noData}>{t("dashboard.no_data")}</Text>
          )}
        </Card>

        {/* Income breakdown */}
        <Card style={s.pieCard}>
          <Text style={s.cardTitle}>{t("dashboard.crop_income_breakdown")}</Text>
          {incomeBreakdown.length > 0 ? (
            <VictoryPie
              data={incomeBreakdown.map((d) => ({ x: d.crop_name, y: d.total }))}
              width={CHART_WIDTH / 2 - spacing[4]}
              height={200}
              colorScale={PIE_COLORS}
              innerRadius={40}
              style={{ labels: { fontSize: 9, fill: colors.text } }}
              padding={30}
            />
          ) : (
            <Text style={s.noData}>{t("dashboard.no_data")}</Text>
          )}
        </Card>

      </View>

      {/* ── Bottom stats ─────────────────────────────────────────────────── */}
      <View style={s.bottomGrid}>
        <View style={s.bottomCard}>
          <StatCard
            icon={<IconFertilizer size={20} color={colors.success} />}
            title={t("dashboard.fertilizers")}
            value={String(summary?.total_fertilizers || 0)}
            subtitle={t("dashboard.total_records")}
          />
        </View>
        <View style={s.bottomCard}>
          <StatCard
            icon={<IconPesticide size={20} color={colors.purple} />}
            title={t("dashboard.pesticides")}
            value={String(summary?.total_pesticides || 0)}
            subtitle={t("dashboard.total_records")}
          />
        </View>
      </View>

    </ScreenShell>
  );
}

const s = StyleSheet.create({
  // FY filter
  fyWrap:   { maxWidth: 160, marginBottom: spacing[3] },
  fySelect: { marginTop: 0 },

  // KPI stats — replaces grid-template-columns: repeat(5, 1fr) → 2-col wrap
  statsGrid:     { flexDirection: "row", flexWrap: "wrap", gap: spacing[3], marginBottom: spacing[3] },
  statsCardWrap: { width: "47%" },

  // Chart card
  chartCard:    { gap: spacing[4] },
  cardHeader:   { gap: 4 },
  cardTitle:    { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  cardSub:      { fontSize: fontSize.sm, color: colors.textMuted },

  // Net profit
  profitSection: { gap: 4 },
  profitLabel:   { fontSize: fontSize.sm, color: colors.textMuted },
  profitValue:   { fontSize: 36, fontWeight: "800", lineHeight: 40 },
  profitSub:     { fontSize: fontSize.sm, color: colors.textFaint },

  // Legend
  legend:     { flexDirection: "row", gap: spacing[4], flexWrap: "wrap", marginTop: spacing[2] },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: fontSize.xs, color: colors.textMuted },

  // Quick actions
  actionsCard: { gap: spacing[4] },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing[3] },
  actionBtn: {
    width:         "47%",
    minHeight:     72,
    flexDirection: "row",
    alignItems:    "center",
    gap:           12,
    padding:       14,
    borderRadius:  radius.xl,
    borderWidth:   1,
    borderColor:   colors.border,
    backgroundColor: colors.surface,
  },
  actionIcon: {
    width:          48,
    height:         48,
    borderRadius:   24,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  actionLabel: { fontSize: 13, fontWeight: "700", color: colors.text, flex: 1 },

  // Tables
  tableHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[3] },
  viewAll:     { fontSize: fontSize.sm, fontWeight: "600", color: colors.primary },
  tableHead:   { flexDirection: "row", backgroundColor: colors.surface2, paddingVertical: 10, paddingHorizontal: 14 },
  tableRow:    { flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 12, paddingHorizontal: 14 },
  th: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", color: colors.textFaint, letterSpacing: 0.5 },
  td: { fontSize: fontSize.sm, color: colors.text },
  noData: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center", padding: spacing[5] },

  // Pie charts — side by side
  pieRow:  { flexDirection: "row", gap: spacing[3] },
  pieCard: { flex: 1, gap: spacing[3], alignItems: "center" },

  // Bottom stats
  bottomGrid: { flexDirection: "row", gap: spacing[3] },
  bottomCard: { flex: 1 },
});