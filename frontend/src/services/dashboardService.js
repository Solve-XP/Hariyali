// src/services/dashboardService.js

import api from "../api/axios";

const BASE_URL = "/dashboard";

export const DashboardService = {

  /* =========================================================
     SUMMARY
  ========================================================= */

  async getSummary(financial_year) {

    const response = await api.get(
      `${BASE_URL}/summary`,
      {
        params: {
          financial_year,
        },
      }
    );

    return response.data?.data;
  },

  /* =========================================================
     FINANCIAL ANALYTICS
  ========================================================= */

  async getFinancialAnalytics(financial_year) {

    const response = await api.get(
      `${BASE_URL}/financial-analytics`,
      {
        params: {
          financial_year,
        },
      }
    );

    return response.data?.data || [];
  },

  /* =========================================================
     RECENT INCOMES
  ========================================================= */

  async getRecentIncomes() {

    const response = await api.get(
      `${BASE_URL}/recent-incomes`
    );

    return response.data?.data || [];
  },

  /* =========================================================
     RECENT EXPENSES
  ========================================================= */

  async getRecentExpenses() {

    const response = await api.get(
      `${BASE_URL}/recent-expenses`
    );

    return response.data?.data || [];
  },

  /* =========================================================
     RECENT RENTALS
  ========================================================= */

  async getRecentRentals() {

    const response = await api.get(
      `${BASE_URL}/recent-rentals`
    );

    return response.data?.data || [];
  },

  /* =========================================================
     EXPENSE BREAKDOWN
  ========================================================= */

  async getExpenseBreakdown(financial_year) {

    const response = await api.get(
      `${BASE_URL}/expense-breakdown`,
      {
        params: {
          financial_year,
        },
      }
    );

    return response.data?.data || [];
  },

  /* =========================================================
     INCOME BREAKDOWN
  ========================================================= */

  async getIncomeBreakdown(financial_year) {

    const response = await api.get(
      `${BASE_URL}/income-breakdown`,
      {
        params: {
          financial_year,
        },
      }
    );

    return response.data?.data || [];
  },

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  async getFilterOptions() {

    const response = await api.get(
      `${BASE_URL}/filter-options`
    );

    return response.data?.data || {
      financial_years: [],
      expense_categories: [],
    };
  },
};