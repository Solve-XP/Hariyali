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
    useState("All Financial Years");

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
            "All Financial Years"
          )
            ? "All Financial Years"
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
      label: "Add Farm",
      path: "/farmer/farms",
      className: "farm",
    },

    {
      label: "Add Income",
      path: "/farmer/incomes",
      className: "income",
    },

    {
      label: "Add Expense",
      path: "/farmer/expenses",
      className: "expense",
    },

    {
      label: "Add Fertilizer",
      path: "/farmer/fertilizers",
      className: "fertilizer",
    },

    {
      label: "Add Pesticide",
      path: "/farmer/pesticides",
      className: "pesticide",
    },

    {
      label: "Rent Equipment",
      path: "/farmer/rentals",
      className: "rental",
    },
  ];

  if (loading) {

    return (

      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (

    <div className="page dashboard-page">

      <PageHeader
        title="Dashboard"
        subtitle="Manage your farming business efficiently."
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
          title="Total Farms"
          value={
            summary?.total_farms || 0
          }
          subtitle="Connected farms"
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={<IconIncome size={22} />}
          title="Total Income"
          value={`₹ ${
            summary?.total_income || 0
          }`}
          subtitle={selectedFY}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          icon={<IconExpense size={22} />}
          title="Total Expenses"
          value={`₹ ${
            summary?.total_expenses || 0
          }`}
          subtitle={selectedFY}
          colorClass="stat-card__icon--purple"
        />

        <StatsCard
          icon={<IconCrop size={22} />}
          title="Total Crops"
          value={
            summary?.total_crops || 0
          }
          subtitle="Active crops"
          colorClass="stat-card__icon--info"
        />

        <StatsCard
          icon={<IconRental size={22} />}
          title="Rental Listings"
          value={
            summary?.total_rentals || 0
          }
          subtitle="Equipment marketplace"
          colorClass="stat-card__icon--cyan"
        />

      </div>

      {/* =====================================================
          MAIN SECTION
      ====================================================== */}

      <div className="dashboard-main-grid">

        {/* =================================================
            FINANCIAL OVERVIEW
        ================================================== */}

        <Card className="dashboard-chart-card">

          <div className="dashboard-card-header">

            <div>

              <h3>
                Financial Overview
              </h3>

              <p>
                {selectedFY}
              </p>

            </div>

          </div>

          <div className="financial-overview-layout">

            <div className="financial-overview-side">

              <div className="net-profit-label">
                Net Profit
              </div>

              <div className="net-profit-value">

                ₹ {netProfit}

              </div>

              <div className="net-profit-sub">

                Income - Expenses

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
                    name="Income"
                  />

                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#dc2626"
                    strokeWidth={3}
                    name="Expenses"
                  />

                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#2563eb"
                    strokeWidth={3}
                    name="Profit"
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </Card>

        {/* =================================================
            QUICK ACTIONS
        ================================================== */}

        <Card className="dashboard-actions-card">

          <div className="dashboard-card-header">
            <div>
              <h3>Quick Actions</h3>
              <p>
                Manage your farming activities quickly
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

        {/* =================================================
            RECENT INCOMES
        ================================================== */}

        <Card>

          <div className="dashboard-card-header dashboard-card-header-flex">

            <h3> Recent Incomes </h3>

            <button
            className="dashboard-view-all-btn"
            onClick={() =>
              navigate("/farmer/incomes")
            }
            >
            View All
           </button>

          </div>

          <div className="dashboard-table-wrap">

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    Amount
                  </th>

                  <th>
                    Date
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

        {/* =================================================
            RECENT EXPENSES
        ================================================== */}

        <Card>

          <div className="dashboard-card-header dashboard-card-header-flex">

            <h3> Recent Expenses </h3>

            <button
              className="dashboard-view-all-btn"
              onClick={() =>
              navigate("/farmer/expenses")
              }
            >
              View All
            </button>

          </div>

          <div className="dashboard-table-wrap">

            <table className="dashboard-table">

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Amount
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

        {/* =================================================
            EXPENSE BREAKDOWN
        ================================================== */}

        <Card>

          <div className="dashboard-card-header">

            <h3>
              Expense Breakdown
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

        {/* =================================================
            INCOME BREAKDOWN
        ================================================== */}

        <Card>

          <div className="dashboard-card-header">

            <h3>
              Crop Income Breakdown
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
          MARKETPLACE
      ====================================================== */}

      {/* <Card>

        <div className="dashboard-card-header">

          <h3>
            Equipment Marketplace
          </h3>

        </div>

        <div className="dashboard-rental-grid">

          {recentRentals.map(
            (item) => (

              <div
                key={item._id}
                className="dashboard-rental-card"
              >

                <img
                  src={
                    item.equipment_photo
                  }
                  alt={
                    item.equipment_name
                  }
                  className="dashboard-rental-image"
                />

                <div className="dashboard-rental-body">

                  <h4>

                    {
                      item.equipment_name
                    }

                  </h4>

                  <div className="dashboard-rental-price">

                    {item.price_per_hour && (

                      <span>

                        ₹
                        {
                          item.price_per_hour
                        }
                        /hr

                      </span>

                    )}

                    {item.price_per_day && (

                      <span>

                        ₹
                        {
                          item.price_per_day
                        }
                        /day

                      </span>

                    )}

                  </div>

                  <div className="dashboard-rental-location">

                    {item.location}

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </Card> */}

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
          title="Fertilizers"
          value={
            summary?.total_fertilizers ||
            0
          }
          subtitle="Total records"
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={
            <IconPesticide
              size={20}
            />
          } 
          title="Pesticides"
          value={
            summary?.total_pesticides ||
            0
          }
          subtitle="Total records"
          colorClass="stat-card__icon--purple"
        />

      </div>

    </div>
  );
}