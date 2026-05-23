// src/pages/farmer/Dashboard.jsx

import "./Dashboard.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { useApp } from "../../context/AppContext";

import { DashboardService } from "../../services/dashboardService";

import Card from "../../components/Card";
import Select from "../../components/Select";
import PageHeader from "../../components/PageHeader";
import StatsCard from "../../components/StatsCard";

import {
  IconFarm,
  IconIncome,
  IconExpense,
  IconCrop,
  IconRental,
  IconFertilizer,
  IconPesticide,
  IconPlus,
} from "../../components/Icons";

const PIE_COLORS = [
  "#16a34a",
  "#2563eb",
  "#f59e0b",
  "#dc2626",
  "#9333ea",
  "#0891b2",
];

export default function Dashboard() {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const { pushToast } = useApp();

  const [loading, setLoading] =
    useState(true);

  const [summary, setSummary] =
    useState(null);

  const [
    financialAnalytics,
    setFinancialAnalytics,
  ] = useState([]);

  const [recentIncomes, setRecentIncomes] =
    useState([]);

  const [
    recentExpenses,
    setRecentExpenses,
  ] = useState([]);

  const [recentRentals, setRecentRentals] =
    useState([]);

  const [
    expenseBreakdown,
    setExpenseBreakdown,
  ] = useState([]);

  const [
    incomeBreakdown,
    setIncomeBreakdown,
  ] = useState([]);

  const [financialYears, setFinancialYears] =
    useState([]);

  const [selectedFY, setSelectedFY] =
    useState(
      t("dashboard.all_financial_years")
    );

  /* =========================================================
     LOAD FILTER OPTIONS
  ========================================================= */

  useEffect(() => {

    loadFilters();

  }, []);

  const loadFilters = async () => {

    try {

      const response =
        await DashboardService.getFilterOptions();

      const data =
        response?.data || response || {};

      const years =
        data.financial_years || [];

      setFinancialYears(years);

      if (years.length > 0) {

        setSelectedFY(
          years.includes(
            t("dashboard.all_financial_years")
          )
            ? t("dashboard.all_financial_years")
            : years[0]
        );
      }

    } catch (error) {

      console.error(error);

      pushToast(
        t("messages.GENERIC_ERROR"),
        "error"
      );
    }
  };

  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

  useEffect(() => {

    if (!selectedFY) return;

    loadDashboard();

  }, [selectedFY]);

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const [
        summaryRes,
        analyticsRes,
        incomesRes,
        expensesRes,
        rentalsRes,
        expenseRes,
        incomeRes,
      ] = await Promise.all([

        DashboardService.getSummary(
          selectedFY
        ),

        DashboardService.getFinancialAnalytics(
          selectedFY
        ),

        DashboardService.getRecentIncomes(),

        DashboardService.getRecentExpenses(),

        DashboardService.getRecentRentals(),

        DashboardService.getExpenseBreakdown(
          selectedFY
        ),

        DashboardService.getIncomeBreakdown(
          selectedFY
        ),
      ]);

      setSummary(
        summaryRes?.data ||
          summaryRes ||
          {}
      );

      setFinancialAnalytics(
        analyticsRes?.data ||
          analyticsRes ||
          []
      );

      setRecentIncomes(
        incomesRes?.data ||
          incomesRes ||
          []
      );

      setRecentExpenses(
        expensesRes?.data ||
          expensesRes ||
          []
      );

      setRecentRentals(
        rentalsRes?.data ||
          rentalsRes ||
          []
      );

      setExpenseBreakdown(
        expenseRes?.data ||
          expenseRes ||
          []
      );

      setIncomeBreakdown(
        incomeRes?.data ||
          incomeRes ||
          []
      );

    } catch (error) {

      console.error(error);

      pushToast(
        t("messages.GENERIC_ERROR"),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
     NET PROFIT
  ========================================================= */

  const netProfit = useMemo(() => {

    return (
      Number(summary?.total_income || 0) -
      Number(summary?.total_expenses || 0)
    );

  }, [summary]);

  /* =========================================================
     DYNAMIC CHART TYPE
  ========================================================= */

  const chartXAxisKey = useMemo(() => {

    if (
      financialAnalytics?.length > 0 &&
      financialAnalytics[0]?.year
    ) {

      return "year";
    }

    return "month";

  }, [financialAnalytics]);

  /* =========================================================
     QUICK ACTIONS
  ========================================================= */

  const quickActions = [

    {
      label: t("dashboard.add_farm"),
      path: "/farmer/farms",
      className: "farm",
    },

    {
      label: t("dashboard.add_income"),
      path: "/farmer/incomes",
      className: "income",
    },

    {
      label: t("dashboard.add_expense"),
      path: "/farmer/expenses",
      className: "expense",
    },

    {
      label: t("dashboard.add_fertilizer"),
      path: "/farmer/fertilizers",
      className: "fertilizer",
    },

    {
      label: t("dashboard.add_pesticide"),
      path: "/farmer/pesticides",
      className: "pesticide",
    },

    {
      label: t("dashboard.rent_equipment"),
      path: "/farmer/rentals",
      className: "rental",
    },
  ];

  if (loading) {

    return (

      <div className="dashboard-loading">
        {t("dashboard.loading")}
      </div>
    );
  }

  return (

    <div className="page dashboard-page">

      <PageHeader
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
      />

      {/* =====================================================
          FINANCIAL YEAR FILTER
      ====================================================== */}

      <div
        style={{
          marginBottom: "24px",
          maxWidth: "150px",
        }}
      >

        <Select
          value={selectedFY}
          onChange={(e) =>
            setSelectedFY(
              e.target.value
            )
          }
        >

          {financialYears.map((fy) => (

            <option
              key={fy}
              value={fy}
            >
              {fy}
            </option>

          ))}

        </Select>

      </div>

      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="dashboard-stats-grid">

        <StatsCard
          icon={<IconFarm size={22} />}
          title={t("dashboard.total_farms")}
          value={
            summary?.total_farms || 0
          }
          subtitle={t("dashboard.connected_farms")}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={<IconIncome size={22} />}
          title={t("dashboard.total_income")}
          value={`₹ ${
            summary?.total_income || 0
          }`}
          subtitle={selectedFY}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          icon={<IconExpense size={22} />}
          title={t("dashboard.total_expenses")}
          value={`₹ ${
            summary?.total_expenses || 0
          }`}
          subtitle={selectedFY}
          colorClass="stat-card__icon--purple"
        />

        <StatsCard
          icon={<IconCrop size={22} />}
          title={t("dashboard.total_crops")}
          value={
            summary?.total_crops || 0
          }
          subtitle={t("dashboard.active_crops")}
          colorClass="stat-card__icon--info"
        />

        <StatsCard
          icon={<IconRental size={22} />}
          title={t("dashboard.rental_listings")}
          value={
            summary?.total_rentals || 0
          }
          subtitle={t("dashboard.equipment_marketplace")}
          colorClass="stat-card__icon--cyan"
        />

      </div>

      {/* =====================================================
          MAIN SECTION
      ====================================================== */}

      <div className="dashboard-main-grid">

        <Card className="dashboard-chart-card">

          <div className="dashboard-card-header">

            <div>

              <h3>
                {t("dashboard.financial_overview")}
              </h3>

              <p>
                {selectedFY}
              </p>

            </div>

          </div>

          <div className="financial-overview-layout">

            <div className="financial-overview-side">

              <div className="net-profit-label">
                {t("dashboard.net_profit")}
              </div>

              <div className="net-profit-value">

                ₹ {netProfit}

              </div>

              <div className="net-profit-sub">

                {t("dashboard.income_minus_expenses")}

              </div>

            </div>

            <div className="financial-chart">

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <LineChart
                  data={
                    financialAnalytics
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey={
                      chartXAxisKey
                    }
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#16a34a"
                    strokeWidth={3}
                    name={t("dashboard.income")}
                  />

                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#dc2626"
                    strokeWidth={3}
                    name={t("dashboard.expenses")}
                  />

                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#2563eb"
                    strokeWidth={3}
                    name={t("dashboard.profit")}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </Card>

        <Card className="dashboard-actions-card">

          <div className="dashboard-card-header">

            <div>

              <h3>
                {t("dashboard.quick_actions")}
              </h3>

              <p>
                {t("dashboard.quick_actions_subtitle")}
              </p>

            </div>

          </div>

          <div className="quick-actions-grid">

            {quickActions.map((action) => (

              <button
                key={action.label}
                className={`quick-action-btn ${action.className || ""}`}
                onClick={() => navigate(action.path)}
              >

                <div className="quick-action-icon">
                  <IconPlus size={18} />
                </div>

                <div className="quick-action-content">

                  <span>{action.label}</span>

                  <small>
                    {action.description}
                  </small>

                </div>

              </button>

            ))}

          </div>

        </Card>

      </div>

      {/* =====================================================
          RECENT TABLES
      ====================================================== */}

      <div className="dashboard-tables-grid">

        <Card>

          <div className="dashboard-card-header dashboard-card-header-flex">

            <h3>
              {t("dashboard.recent_incomes")}
            </h3>

            <button
              className="dashboard-view-all-btn"
              onClick={() =>
                navigate("/farmer/incomes")
              }
            >
              {t("dashboard.view_all")}
            </button>

          </div>

          <div className="dashboard-table-wrap">

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    {t("dashboard.amount")}
                  </th>

                  <th>
                    {t("dashboard.date")}
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentIncomes.map(
                  (item) => (

                    <tr
                      key={item._id}
                    >

                      <td>
                        ₹ {item.amount}
                      </td>

                      <td>

                        {item.income_date?.split(
                          "T"
                        )[0]}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </Card>

        <Card>

          <div className="dashboard-card-header dashboard-card-header-flex">

            <h3>
              {t("dashboard.recent_expenses")}
            </h3>

            <button
              className="dashboard-view-all-btn"
              onClick={() =>
              navigate("/farmer/expenses")
              }
            >
              {t("dashboard.view_all")}
            </button>

          </div>

          <div className="dashboard-table-wrap">

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    {t("dashboard.name")}
                  </th>

                  <th>
                    {t("dashboard.amount")}
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentExpenses.map(
                  (item) => (

                    <tr
                      key={item._id}
                    >

                      <td>

                        {
                          item.item_name
                        }

                      </td>

                      <td>

                        ₹ {item.amount}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </Card>

      </div>

      {/* =====================================================
          PIE CHARTS
      ====================================================== */}

      <div className="dashboard-chart-grid">

        <Card>

          <div className="dashboard-card-header">

            <h3>
              {t("dashboard.expense_breakdown")}
            </h3>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={
                  expenseBreakdown
                }
                dataKey="total"
                nameKey="category"
                outerRadius={110}
                label
              >

                {expenseBreakdown.map(
                  (
                    _,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        PIE_COLORS[
                          index %
                            PIE_COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </Card>

        <Card>

          <div className="dashboard-card-header">

            <h3>
              {t("dashboard.crop_income_breakdown")}
            </h3>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={
                  incomeBreakdown
                }
                dataKey="total"
                nameKey="crop_name"
                outerRadius={110}
                label
              >

                {incomeBreakdown.map(
                  (
                    _,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        PIE_COLORS[
                          index %
                            PIE_COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </Card>

      </div>

      {/* =====================================================
          BOTTOM STATS
      ====================================================== */}

      <div className="dashboard-bottom-grid">

        <StatsCard
          icon={
            <IconFertilizer
              size={20}
            />
          }
          title={t("dashboard.fertilizers")}
          value={
            summary?.total_fertilizers ||
            0
          }
          subtitle={t("dashboard.total_records")}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={
            <IconPesticide
              size={20}
            />
          } 
          title={t("dashboard.pesticides")}
          value={
            summary?.total_pesticides ||
            0
          }
          subtitle={t("dashboard.total_records")}
          colorClass="stat-card__icon--purple"
        />

      </div>

    </div>
  );
}