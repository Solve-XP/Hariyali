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

  const [allExpenses, setAllExpenses] = useState([]);

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  const [deleteExpense, setDeleteExpense] =
    useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [filters, setFilters] = useState({
    search: "",
    farm_id: "all",
    category: "all",
    financial_year: "all",
  });

  const [debouncedFilters, setDebouncedFilters] =
    useState(filters);

  useEffect(() => {

    const timer = setTimeout(() => {

      setDebouncedFilters(filters);

    }, 400);

    return () => clearTimeout(timer);

  }, [filters]);

  useEffect(() => {

    loadInitialData();

  }, []);

  useEffect(() => {

    applyFilters(debouncedFilters);

  }, [debouncedFilters, allExpenses]);

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

    } catch (error) {

      pushToast(
        t("messages.GENERIC_ERROR"),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  const applyFilters = (
    customFilters = debouncedFilters
  ) => {

    let filtered = [...allExpenses];

    if (customFilters.search) {

      const search =
        customFilters.search.toLowerCase();

      filtered = filtered.filter((item) =>

        String(item.item_name || "")
          .toLowerCase()
          .includes(search)

        ||

        String(item.notes || "")
          .toLowerCase()
          .includes(search)

        ||

        String(item.category || "")
          .toLowerCase()
          .includes(search)

      );
    }

    if (
      customFilters.farm_id &&
      customFilters.farm_id !== "all"
    ) {

      filtered = filtered.filter(
        (item) =>
          item.farm_id ===
          customFilters.farm_id
      );
    }

    if (
      customFilters.category &&
      customFilters.category !== "all"
    ) {

      filtered = filtered.filter(
        (item) =>
          item.category ===
          customFilters.category
      );
    }

    if (
      customFilters.financial_year &&
      customFilters.financial_year !== "all"
    ) {

      filtered = filtered.filter(
        (item) =>
          item.financial_year ===
          customFilters.financial_year
      );
    }

    setExpenses(filtered);
  };

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

  const financialYears = useMemo(() => {

    const years = allExpenses
      .map((i) => i.financial_year)
      .filter(Boolean);

    return [...new Set(years)].sort();

  }, [allExpenses]);

  const statsData = useMemo(() => {

    if (
      filters.financial_year === "all"
    ) {

      return allExpenses;
    }

    return allExpenses.filter(
      (item) =>
        item.financial_year ===
        filters.financial_year
    );

  }, [
    allExpenses,
    filters.financial_year,
  ]);

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

  const openCreateModal = () => {

    setEditingExpense(null);

    setForm(EMPTY_FORM);

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

    setForm(EMPTY_FORM);

    setCrops([]);
  };

  const handleChange =
    (field) => (e) => {

      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

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

      setLoading(true);

      if (editingExpense) {

        await ExpensesService.update(
          editingExpense.id,
          form
        );

        pushToast(
          t("expenses.updated")
        );

      } else {

        await ExpensesService.create(
          form
        );

        pushToast(
          t("expenses.created")
        );
      }

      closeModal();

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
          {row.quantity || 0} {row.unit || ""}
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
          ₹ {Number(row.amount || 0).toLocaleString()}
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

            <div className="expenses-desktop-table">

              <Table
                columns={columns}
                rows={expenses}
                rowKey={(row) => row.id}
                emptyMessage={t("expenses.empty")}
              />

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
                    {t(`expenses.categories.${category}`)}
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
              type="number"
              value={form.quantity}
              onChange={handleChange(
                "quantity"
              )}
            />

            <Input
              label={t("expenses.unit")}
              value={form.unit}
              onChange={handleChange(
                "unit"
              )}
            />

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
                    {t(`expenses.payments.${method}`)}
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