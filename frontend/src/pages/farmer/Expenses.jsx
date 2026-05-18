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

  /* =========================================================
     DEBOUNCE
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
     FILTER CHANGE
  ========================================================= */

  useEffect(() => {

    applyFilters(debouncedFilters);

  }, [debouncedFilters, allExpenses]);

  /* =========================================================
     LOAD DATA
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
     APPLY FILTERS
  ========================================================= */

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
     MAPS
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
     FINANCIAL YEARS
  ========================================================= */

  const financialYears = useMemo(() => {

    const years = allExpenses
      .map((i) => i.financial_year)
      .filter(Boolean);

    return [...new Set(years)].sort();

  }, [allExpenses]);

  /* =========================================================
     STATS
  ========================================================= */

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

  /* =========================================================
     MODAL
  ========================================================= */

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

  /* =========================================================
     CHANGE
  ========================================================= */

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
        "Please fill required fields",
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
          "Expense updated"
        );

      } else {

        await ExpensesService.create(
          form
        );

        pushToast(
          "Expense created"
        );
      }

      closeModal();

      await loadInitialData();

    } catch (error) {

      pushToast(
        error?.response?.data?.detail ||
        "Something went wrong",
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
        "Expense deleted"
      );

      setDeleteExpense(null);

      await loadInitialData();

    } catch (error) {

      pushToast(
        "Delete failed",
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
     TABLE
  ========================================================= */

  const columns = [

    {
      key: "farm",
      header: "Farm",
      render: (row) => (
        <span className="farm-name">
          {farmsMap[row.farm_id] || "—"}
        </span>
      ),
    },

    {
      key: "crop",
      header: "Crop",
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
      header: "Financial Year",
      render: (row) => (
        <span className="financial-year">
          {row.financial_year || "—"}
        </span>
      ),
    },

    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="expense-category">
          {row.category || "—"}
        </span>
      ),
    },

    {
      key: "item_name",
      header: "Item",
      render: (row) => (
        <strong className="expense-item">
          {row.item_name || "—"}
        </strong>
      ),
    },

    {
      key: "quantity",
      header: "Quantity",
      render: (row) => (
        <span className="expense-quantity">
          {row.quantity || 0} {row.unit || ""}
        </span>
      ),
    },

    {
      key: "payment_method",
      header: "Payment",
      render: (row) => (
        <span className="expense-payment">
          {row.payment_method || "—"}
        </span>
      ),
    },

    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <strong className="expense-amount">
          ₹ {Number(row.amount || 0).toLocaleString()}
        </strong>
      ),
    },

    {
      key: "expense_date",
      header: "Expense Date",
      render: (row) => (
        <span className="expense-date">
          {row.expense_date?.split("T")[0] || "—"}
        </span>
      ),
    },

    {
      key: "actions",
      header: "Actions",
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
        title="Expense Management"
        subtitle="Track farming expenses and spending."
        action={
          <Button
            variant="primary"
            onClick={openCreateModal}
          >
            <IconPlus />
            Add Expense
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
              Financial Year
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
                  All Financial Years
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
          title="Total Expenses"
          value={`₹ ${stats.totalExpenses.toLocaleString()}`}
          subtitle="Expense amount"
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={<IconFarm size={22} />}
          title="Farms"
          value={stats.farms}
          subtitle="Connected farms"
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          icon={<IconCrop size={22} />}
          title="Crops"
          value={stats.crops}
          subtitle="Expense crops"
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
            placeholder="Search expenses..."
          />

          {/* <Select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                category:
                  e.target.value,
              }))
            }
          >

            <option value="all">
              All Categories
            </option>

            {CATEGORY_OPTIONS.map(
              (category) => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              )
            )}

          </Select> */}

        </div>

      </Card>

      <div className="page__section">

        {loading ? (

          <Card>

            <div className="loading-state">
              Loading expenses...
            </div>

          </Card>

        ) : expenses.length === 0 ? (

          <EmptyState
            icon={<IconExpense />}
            message="No expenses found"
          />

        ) : (

          <>

            <div className="expenses-desktop-table">

              <Table
                columns={columns}
                rows={expenses}
                rowKey={(row) => row.id}
                emptyMessage="No expenses found"
              />

            </div>

            <div className="expenses-mobile-list">

              {expenses.map((expense) => (

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
                      ₹ {Number(expense.amount || 0).toLocaleString()}
                    </strong>

                  </div>

                  <div className="expense-mobile-card__body">

                    <div className="expense-mobile-grid">

                      <div className="expense-mobile-item">

                        <div className="expense-mobile-label">
                          Farm
                        </div>

                        <div className="expense-mobile-value">
                          {farmsMap[expense.farm_id] || "—"}
                        </div>

                      </div>

                      <div className="expense-mobile-item">

                        <div className="expense-mobile-label">
                          Crop
                        </div>

                        <div className="expense-mobile-value">
                          {expense.crop_name ||
                            expense.crop?.crop_name ||
                            cropsMap[expense.crop_id] ||
                            "—"}
                        </div>

                      </div>

                      <div className="expense-mobile-item">

                        <div className="expense-mobile-label">
                          Financial Year
                        </div>

                        <div className="expense-mobile-value">
                          {expense.financial_year || "—"}
                        </div>

                      </div>

                      <div className="expense-mobile-item">

                        <div className="expense-mobile-label">
                          Payment
                        </div>

                        <div className="expense-mobile-value">
                          {expense.payment_method || "—"}
                        </div>

                      </div>

                      <div className="expense-mobile-item">

                        <div className="expense-mobile-label">
                          Quantity
                        </div>

                        <div className="expense-mobile-value">
                          {expense.quantity || 0} {expense.unit || ""}
                        </div>

                      </div>

                      <div className="expense-mobile-item">

                        <div className="expense-mobile-label">
                          Expense Date
                        </div>

                        <div className="expense-mobile-value">
                          {expense.expense_date?.split("T")[0] || "—"}
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

                  </div>

                </Card>

              ))}

            </div>

          </>

        )}

      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingExpense
            ? "Edit Expense"
            : "Add Expense"
        }
      >

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <Select
              label="Farm"
              value={form.farm_id}
              onChange={(e) =>
                handleFarmSelect(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Farm
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
              label="Crop"
              value={form.crop_id}
              onChange={handleChange(
                "crop_id"
              )}
            >

              <option value="">
                Select Crop
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
              label="Category"
              value={form.category}
              onChange={handleChange(
                "category"
              )}
            >

              <option value="">
                Select Category
              </option>

              {CATEGORY_OPTIONS.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )}

            </Select>

            <Input
              label="Item Name"
              value={form.item_name}
              onChange={handleChange(
                "item_name"
              )}
            />

            <Input
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange(
                "quantity"
              )}
            />

            <Input
              label="Unit"
              value={form.unit}
              onChange={handleChange(
                "unit"
              )}
            />

            <Input
              label="Amount"
              type="number"
              value={form.amount}
              onChange={handleChange(
                "amount"
              )}
            />

            <Select
              label="Payment Method"
              value={form.payment_method}
              onChange={handleChange(
                "payment_method"
              )}
            >

              <option value="">
                Select Payment
              </option>

              {PAYMENT_OPTIONS.map(
                (method) => (

                  <option
                    key={method}
                    value={method}
                  >
                    {method}
                  </option>

                )
              )}

            </Select>

            <Input
              type="date"
              label="Expense Date"
              value={form.expense_date}
              onChange={handleChange(
                "expense_date"
              )}
            />

            <Input
              label="Notes"
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
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {editingExpense
                ? "Update Expense"
                : "Create Expense"}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmDialog
        open={!!deleteExpense}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteExpense(null)
        }
        loading={loading}
      />

    </div>
  );
}