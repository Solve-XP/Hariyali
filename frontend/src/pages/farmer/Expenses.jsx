// File: src/pages/farmer/Expenses.jsx

import "./Expenses.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { useApp } from "../../context/AppContext";

import { FarmsService } from "../../services/farmsService";
import { CropsService } from "../../services/cropsService";
import { ExpensesService } from "../../services/expensesService";

import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import StatsCard from "../../components/StatsCard";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader from "../../components/PageHeader";

import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconFarm,
  IconCrop,
  IconFarmYear,
  IconExpense,
} from "../../components/Icons";

const UNIT_OPTIONS = [
  "kg",
  "gram",
  "quintal",
  "ton",
  "liter",
  "ml",
  "piece",
  "packet",
  "bag",
  "box",
  "bottle",
  "bundle",
  "acre",
  "hectare",
  "hour",
  "day",
  "person",
  "trip",
  "unit",
  "other",
];

const CATEGORY_OPTIONS = [
  "fertilizer",
  "pesticide",
  "seeds",
  "labor",
  "diesel",
  "transport",
  "equipment",
  "electricity",
  "water",
  "maintenance",
  "other",
];

const PAYMENT_OPTIONS = [
  "cash",
  "upi",
  "bank_transfer",
  "credit",
  "other",
];

const EMPTY_FORM = {
  farm_id: "",
  crop_id: "",
  category: "",
  item_name: "",
  quantity: "",
  unit: "",
  amount: "",
  payment_method: "",
  expense_date: "",
  notes: "",
};

export default function Expenses() {

  const { t } = useTranslation();

  const { pushToast } = useApp();

  const [farms, setFarms] = useState([]);

  const [allCrops, setAllCrops] = useState([]);

  const [crops, setCrops] = useState([]);

  const [allExpenses, setAllExpenses] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  /* UPDATED */
  const [financialYears, setFinancialYears] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  const [deleteExpense, setDeleteExpense] =
    useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [filters, setFilters] = useState({
    search: "",
    farm_id: "all",
    category: "all",
    financial_year: "all",
  });

  const [debouncedFilters, setDebouncedFilters] =
    useState(filters);

  /* =========================================================
     SEARCH DEBOUNCE
  ========================================================= */

  useEffect(() => {

    const timer = setTimeout(() => {

      setDebouncedFilters(filters);

    }, 400);

    return () => clearTimeout(timer);

  }, [filters]);

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    loadInitialData();

  }, []);

  /* =========================================================
     FILTER CHANGE LOAD
  ========================================================= */

  useEffect(() => {

    loadExpenses(debouncedFilters);

  }, [debouncedFilters]);

  /* =========================================================
     LOAD INITIAL DATA
  ========================================================= */

  const loadInitialData = async () => {

    try {

      setLoading(true);

      const [
        farmsResponse,
        cropsResponse,
        expensesResponse,
      ] = await Promise.all([
        FarmsService.getAll(),
        CropsService.getAll(),
        ExpensesService.getAll(),
      ]);

      setFarms(farmsResponse ?? []);

      setAllCrops(cropsResponse ?? []);

      const expenseData =
        expensesResponse ?? [];

      setAllExpenses(expenseData);

      setExpenses(expenseData);

      /* UPDATED */

      const years = expenseData
        .map(
          (item) =>
            item.financial_year
        )
        .filter(Boolean);

      setFinancialYears([
        ...new Set(years),
      ].sort());

    } catch (error) {

      pushToast(
        t("messages.GENERIC_ERROR"),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
     LOAD EXPENSES
  ========================================================= */

  const loadExpenses = async (
    currentFilters = debouncedFilters
  ) => {

    try {

      setLoading(true);

      const params = {};

      /* SEARCH */

      if (
        currentFilters.search?.trim()
      ) {

        params.search =
          currentFilters.search.trim();
      }

      /* FARM */

      if (
        currentFilters.farm_id &&
        currentFilters.farm_id !== "all"
      ) {

        params.farm_id =
          currentFilters.farm_id;
      }

      /* CATEGORY */

      if (
        currentFilters.category &&
        currentFilters.category !== "all"
      ) {

        params.category =
          currentFilters.category;
      }

      /* FINANCIAL YEAR */

      if (
        currentFilters.financial_year &&
        currentFilters.financial_year !==
          "all"
      ) {

        params.financial_year =
          currentFilters.financial_year;
      }

      const response =
        await ExpensesService.getAll(
          params
        );

      const data = response ?? [];

      setExpenses(data);

      /* UPDATED */

      setFinancialYears((prev) => {

        const years = [
          ...prev,
          ...data
            .map(
              (item) =>
                item.financial_year
            )
            .filter(Boolean),
        ];

        return [
          ...new Set(years),
        ].sort();
      });

    } catch (error) {

      pushToast(
        t("messages.GENERIC_ERROR"),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
     FARM SELECT
  ========================================================= */

  const handleFarmSelect = async (
    farmId
  ) => {

    setForm((prev) => ({
      ...prev,
      farm_id: farmId,
      crop_id: "",
    }));

    if (!farmId) {

      setCrops([]);

      return;
    }

    try {

      const response =
        await CropsService.getAll({
          farm_id: farmId,
        });

      setCrops(response ?? []);

    } catch (error) {

      pushToast(
        t("messages.GENERIC_ERROR"),
        "error"
      );
    }
  };

  /* =========================================================
     MEMOIZED MAPS
  ========================================================= */

  const farmsMap = useMemo(() => {

    return Object.fromEntries(

      farms.map((farm) => [
        farm.id,
        farm.farm_name,
      ])

    );

  }, [farms]);

  const cropsMap = useMemo(() => {

    return Object.fromEntries(

      allCrops.map((crop) => [
        crop.id,
        crop.crop_name,
      ])

    );

  }, [allCrops]);

  /* =========================================================
     UPDATED STATS
  ========================================================= */

  const statsData = expenses;

  const stats = {

    totalExpenses: statsData.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    ),

    farms: new Set(
      statsData.map((i) => i.farm_id)
    ).size,

    crops: new Set(
      statsData
        .filter((i) => i.crop_id)
        .map((i) => i.crop_id)
    ).size,

    total: statsData.length,
  };

  /* =========================================================
     MODAL HELPERS
  ========================================================= */

  const openCreateModal = () => {

    setEditingExpense(null);

    setForm({
      ...EMPTY_FORM,
    });

    setCrops([]);

    setModalOpen(true);
  };

  const openEditModal = async (
    expense
  ) => {

    setEditingExpense(expense);

    setModalOpen(true);

    setForm({
      farm_id: expense.farm_id || "",
      crop_id: expense.crop_id || "",
      category: expense.category || "",
      item_name: expense.item_name || "",
      quantity: expense.quantity || "",
      unit: expense.unit || "",
      amount: expense.amount || "",
      payment_method:
        expense.payment_method || "",
      expense_date:
        expense.expense_date?.split("T")[0] ||
        "",
      notes: expense.notes || "",
    });

    if (expense.farm_id) {

      try {

        const response =
          await CropsService.getAll({
            farm_id: expense.farm_id,
          });

        setCrops(response ?? []);

      } catch (error) {}
    }
  };

  const closeModal = () => {

    setModalOpen(false);

    setEditingExpense(null);

    setForm({
      ...EMPTY_FORM,
    });

    setCrops([]);
  };


  

  const handleChange =
    (field) => (e) => {

      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.farm_id ||
      !form.category ||
      !form.item_name ||
      !form.amount ||
      !form.payment_method
    ) {

      pushToast(
        t("expenses.validation_error"),
        "error"
      );

      return;
    }

    try {

      // setLoading(true);

      // if (editingExpense) {

      //   await ExpensesService.update(
      //     editingExpense.id,
      //     form
      //   );

      //   pushToast(
      //     t("expenses.updated")
      //   );

      // } else {

      //   await ExpensesService.create(
      //     form
      //   );

      //   pushToast(
      //     t("expenses.created")
      //   );
      // }

      // closeModal();

      setLoading(true);

        const payload = {
          ...form,

          crop_id:
            form.crop_id || null,

          quantity:
            form.quantity === ""
              ? null
              : Number(form.quantity),

          unit:
            form.unit || null,

          notes:
            form.notes || null,
        };

        if (editingExpense) {

          await ExpensesService.update(
            editingExpense.id,
            payload
          );

          pushToast(
            t("expenses.updated"),
            "success"
          );

        } else {

          await ExpensesService.create(
            payload
          );

          pushToast(
            t("expenses.created"),
            "success"
          );
        }

        closeModal();

      /* UPDATED */

      await loadExpenses(
        debouncedFilters
      );

      await loadInitialData();

    } catch (error) {

      pushToast(
        error?.response?.data?.detail ||
        t("messages.GENERIC_ERROR"),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {

    if (!deleteExpense) return;

    try {

      setLoading(true);

      await ExpensesService.delete(
        deleteExpense.id
      );

      pushToast(
        t("expenses.deleted")
      );

      setDeleteExpense(null);

      /* UPDATED */

      await loadExpenses(
        debouncedFilters
      );

      await loadInitialData();

    } catch (error) {

      pushToast(
        t("expenses.delete_failed"),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
   TABLE COLUMNS
========================================================= */

const columns = [

  {
    key: "farm",
    header: t("expenses.farm"),
    render: (row) => (
      <span className="farm-name">
        {farmsMap[row.farm_id] || "—"}
      </span>
    ),
  },

  {
    key: "crop",
    header: t("expenses.crop"),
    render: (row) => {

      const cropName =
        row.crop_name ||
        row.crop?.crop_name ||
        cropsMap[row.crop_id];

      return (
        <span className="expense-crop">
          {cropName || "—"}
        </span>
      );
    },
  },

  {
    key: "financial_year",
    header: t("expenses.financial_year"),
    render: (row) => (
      <span className="financial-year">
        {row.financial_year || "—"}
      </span>
    ),
  },

  {
    key: "category",
    header: t("expenses.category"),
    render: (row) => (
      <span className="expense-category">
        {row.category || "—"}
      </span>
    ),
  },

  {
    key: "item_name",
    header: t("expenses.table_item"),
    render: (row) => (
      <strong className="expense-item">
        {row.item_name || "—"}
      </strong>
    ),
  },

  {
    key: "quantity",
    header: t("expenses.quantity"),
    render: (row) => (
      <span className="expense-quantity">
        {row.quantity || 0}{" "}
        {row.unit || ""}
      </span>
    ),
  },

  {
    key: "payment_method",
    header: t("expenses.payment_method"),
    render: (row) => (
      <span className="expense-payment">
        {row.payment_method || "—"}
      </span>
    ),
  },

  {
    key: "amount",
    header: t("expenses.amount"),
    render: (row) => (
      <strong className="expense-amount">
        ₹ {Number(
          row.amount || 0
        ).toLocaleString()}
      </strong>
    ),
  },

  {
    key: "expense_date",
    header: t("expenses.expense_date"),
    render: (row) => (
      <span className="expense-date">
        {row.expense_date?.split("T")[0] || "—"}
      </span>
    ),
  },

  {
    key: "actions",
    header: t("common.actions"),
    width: 140,
    render: (row) => (

      <div className="table-actions">

        <button
          className="icon-btn"
          onClick={() =>
            openEditModal(row)
          }
        >
          <IconEdit size={16} />
        </button>

        <button
          className="icon-btn icon-btn--danger"
          onClick={() =>
            setDeleteExpense(row)
          }
        >
          <IconTrash size={16} />
        </button>

      </div>
    ),
  },

];

  return (

    <div className="page">

      <PageHeader
        title={t("expenses.title")}
        subtitle={t("expenses.subtitle")}
        action={
          <Button
            variant="primary"
            onClick={openCreateModal}
          >
            <IconPlus />
            {t("expenses.add")}
          </Button>
        }
      />

      <div className="grid grid--4">

        <Card className="stats-card">

          <div className="stats-card__icon stat-card__icon--info">
            <IconFarmYear size={22} />
          </div>

          <div className="stats-card__content">

            <div className="stats-card__title">
              {t("expenses.financial_year")}
            </div>

            <div className="stats-select">

              <Select
                value={
                  filters.financial_year
                }
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    financial_year:
                      e.target.value,
                  }))
                }
              >

                <option value="all">
                  {t("expenses.all_financial_years")}
                </option>

                {financialYears.map(
                  (fy) => (

                    <option
                      key={fy}
                      value={fy}
                    >
                      {fy}
                    </option>

                  )
                )}

              </Select>

            </div>

          </div>

        </Card>

        <StatsCard
          icon={<IconExpense size={22} />}
          title={t("expenses.total_expenses")}
          value={`₹ ${stats.totalExpenses.toLocaleString()}`}
          subtitle={t("expenses.expense_amount")}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={<IconFarm size={22} />}
          title={t("expenses.farms")}
          value={stats.farms}
          subtitle={t("expenses.connected_farms")}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          icon={<IconCrop size={22} />}
          title={t("expenses.crops")}
          value={stats.crops}
          subtitle={t("expenses.expense_crops")}
          colorClass="stat-card__icon--purple"
        />

      </div>

      <Card>

        <div className="filters-bar">

          <SearchInput
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search:
                  e.target.value,
              }))
            }
            placeholder={t("expenses.search")}
          />

        </div>

      </Card>

      <div className="page__section">

        {loading ? (

          <Card>

            <div className="loading-state">
              {t("expenses.loading")}
            </div>

          </Card>

        ) : expenses.length === 0 ? (

          <EmptyState
            icon={<IconExpense />}
            message={t("expenses.empty")}
          />

        ) : (

          <>

            {/* Desktop Table */}
            <div className="expenses-desktop-table">

              <Table
                columns={columns}
                rows={expenses}
                rowKey={(row) => row.id}
                emptyMessage={t("expenses.empty")}
              />

            </div>

            {/* Mobile Cards */}
            <div className="expenses-mobile-list">

              {expenses.map((expense) => {

                const cropName =
                  expense.crop_name ||
                  expense.crop?.crop_name ||
                  cropsMap[expense.crop_id];

                return (

                  <Card
                    key={expense.id}
                    className="expense-mobile-card"
                  >

                    <div className="expense-mobile-card__header">

                      <div>

                        <h3>
                          {expense.item_name || "—"}
                        </h3>

                        <div className="expense-category">
                          {expense.category || "—"}
                        </div>

                      </div>

                      <strong className="expense-amount">
                        ₹ {Number(
                          expense.amount || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

                    <div className="expense-mobile-card__body">

                      <div className="expense-mobile-grid">

                        <div className="expense-mobile-item">

                          <span className="expense-mobile-label">
                            {t("expenses.farm")}
                          </span>

                          <span className="expense-mobile-value">
                            {farmsMap[
                              expense.farm_id
                            ] || "—"}
                          </span>

                        </div>

                        <div className="expense-mobile-item">

                          <span className="expense-mobile-label">
                            {t("expenses.crop")}
                          </span>

                          <span className="expense-mobile-value">
                            {cropName || "—"}
                          </span>

                        </div>

                        <div className="expense-mobile-item">

                          <span className="expense-mobile-label">
                            {t("expenses.quantity")}
                          </span>

                          <span className="expense-mobile-value">
                            {expense.quantity || 0}
                            {" "}
                            {expense.unit || ""}
                          </span>

                        </div>

                        <div className="expense-mobile-item">

                          <span className="expense-mobile-label">
                            {t("expenses.payment_method")}
                          </span>

                          <span className="expense-mobile-value">
                            {expense.payment_method || "—"}
                          </span>

                        </div>

                        <div className="expense-mobile-item">

                          <span className="expense-mobile-label">
                            {t("expenses.expense_date")}
                          </span>

                          <span className="expense-mobile-value">
                            {expense.expense_date
                              ?.split("T")[0] || "—"}
                          </span>

                        </div>

                        <div className="expense-mobile-item">

                          <span className="expense-mobile-label">
                            {t("expenses.financial_year")}
                          </span>

                          <span className="expense-mobile-value">
                            {expense.financial_year || "—"}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="expense-mobile-card__actions">

                      <button
                        className="icon-btn"
                        onClick={() =>
                          openEditModal(expense)
                        }
                      >
                        <IconEdit size={16} />
                      </button>

                      <button
                        className="icon-btn icon-btn--danger"
                        onClick={() =>
                          setDeleteExpense(expense)
                        }
                      >
                        <IconTrash size={16} />
                      </button>

                    </div>

                  </Card>

                );
              })}

            </div>

          </>

        )}

      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingExpense
            ? t("expenses.edit")
            : t("expenses.add")
        }
      >

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <Select
              label={t("expenses.farm")}
              value={form.farm_id}
              onChange={(e) =>
                handleFarmSelect(
                  e.target.value
                )
              }
            >

              <option value="">
                {t("expenses.select_farm")}
              </option>

              {farms.map((farm) => (

                <option
                  key={farm.id}
                  value={farm.id}
                >
                  {farm.farm_name}
                </option>

              ))}

            </Select>

            <Select
              label={t("expenses.crop")}
              optional
              value={form.crop_id}
              onChange={handleChange(
                "crop_id"
              )}
            >

              <option value="">
                {t("expenses.select_crop")}
              </option>

              {crops.map((crop) => (

                <option
                  key={crop.id}
                  value={crop.id}
                >
                  {crop.crop_name}
                </option>

              ))}

            </Select>

            <Select
              label={t("expenses.category")}
              value={form.category}
              onChange={handleChange(
                "category"
              )}
            >

              <option value="">
                {t("expenses.select_category")}
              </option>

              {CATEGORY_OPTIONS.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {t(`expenses.category_${category}`)}
                  </option>

                )
              )}

            </Select>

            <Input
              label={t("expenses.item_name")}
              value={form.item_name}
              onChange={handleChange(
                "item_name"
              )}
            />

            <Input
              label={t("expenses.quantity")}
              optional
              type="number"
              value={form.quantity}
              onChange={handleChange(
                "quantity"
              )}
            />

            <Select
              label={t("expenses.unit")}
              optional  
              value={form.unit}
              onChange={handleChange("unit")}
              >

              <option value="">
                 {t("expenses.select_unit")}
              </option>

              {UNIT_OPTIONS.map((unit) => (

              <option
                key={unit}
                value={unit}
              >
                {t(`expenses.units_${unit}`)}
              </option>

              ))}

            </Select>

            <Input
              label={t("expenses.amount")}
              type="number"
              value={form.amount}
              onChange={handleChange(
                "amount"
              )}
            />

            <Select
              label={t("expenses.payment_method")}
              value={form.payment_method}
              onChange={handleChange(
                "payment_method"
              )}
            >

              <option value="">
                {t("expenses.select_payment")}
              </option>

              {PAYMENT_OPTIONS.map(
                (method) => (

                  <option
                    key={method}
                    value={method}
                  >
                    {t(`expenses.payment_${method}`)}
                  </option>

                )
              )}

            </Select>

            <Input
              type="date"
              label={t("expenses.expense_date")}
              value={form.expense_date}
              onChange={handleChange(
                "expense_date"
              )}
            />

            <Input
              label={t("expenses.notes")}
              optional
              value={form.notes}
              onChange={handleChange(
                "notes"
              )}
            />

          </div>

          <div className="form-actions">

            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              {t("common.cancel")}
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {editingExpense
                ? t("expenses.update")
                : t("expenses.create")}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmDialog
        open={!!deleteExpense}
        title={t("expenses.delete")}
        message={t("expenses.delete_confirm")}
        confirmText={t("expenses.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteExpense(null)
        }
        loading={loading}
      />

    </div>
  );
}