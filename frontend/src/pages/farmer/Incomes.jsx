import "./Incomes.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { useApp } from "../../context/AppContext";

import { FarmsService } from "../../services/farmsService";
import { CropsService } from "../../services/cropsService";
import { IncomesService } from "../../services/incomesService";

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

const EMPTY_FORM = {
  farm_id: "",
  crop_id: "",
  harvest_quantity: "",
  unit: "",
  amount: "",
  income_date: "",
  notes: "",
};

export default function Incomes() {

  const { t } = useTranslation();

  const { pushToast } = useApp();

  const [farms, setFarms] = useState([]);

  const [allCrops, setAllCrops] = useState([]);

  const [crops, setCrops] = useState([]);

  const [allIncomes, setAllIncomes] = useState([]);

  const [incomes, setIncomes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingIncome, setEditingIncome] =
    useState(null);

  const [deleteIncome, setDeleteIncome] =
    useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [filters, setFilters] = useState({
    search: "",
    farm_id: "all",
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

  }, [debouncedFilters, allIncomes]);

  /* =========================================================
     LOAD INITIAL DATA
  ========================================================= */

  const loadInitialData = async () => {

    try {

      setLoading(true);

      const [
        farmsResponse,
        cropsResponse,
        incomesResponse,
      ] = await Promise.all([
        FarmsService.getAll(),
        CropsService.getAll(),
        IncomesService.getAll(),
      ]);

      setFarms(farmsResponse ?? []);

      setAllCrops(cropsResponse ?? []);

      const incomeData =
        incomesResponse ?? [];

      setAllIncomes(incomeData);

      setIncomes(incomeData);

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

    let filtered = [...allIncomes];

    if (customFilters.search) {

      const search =
        customFilters.search.toLowerCase();

      filtered = filtered.filter((item) =>

        String(item.notes || "")
          .toLowerCase()
          .includes(search)

        ||

        String(item.financial_year || "")
          .toLowerCase()
          .includes(search)

        ||

        String(
          cropsMap[item.crop_id] || ""
        )
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
          String(item.farm_id) ===
          String(customFilters.farm_id)
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

    setIncomes(filtered);
  };

  /* =========================================================
     FARM CHANGE
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

    const years = allIncomes
      .map((i) => i.financial_year)
      .filter(Boolean);

    return [...new Set(years)].sort();

  }, [allIncomes]);

  /* =========================================================
     FILTERED STATS
  ========================================================= */

  const statsData = useMemo(() => {

    if (
      filters.financial_year === "all"
    ) {

      return allIncomes;
    }

    return allIncomes.filter(
      (item) =>
        item.financial_year ===
        filters.financial_year
    );

  }, [
    allIncomes,
    filters.financial_year,
  ]);

  const stats = {

    financialYears:
      financialYears.length,

    total: statsData.length,

    farms: new Set(
      statsData.map((i) => i.farm_id)
    ).size,

    crops: new Set(
      statsData.map((i) => i.crop_id)
    ).size,

    totalIncome: statsData.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    ),
  };

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  const openCreateModal = () => {

    setEditingIncome(null);

    setForm(EMPTY_FORM);

    setCrops([]);

    setModalOpen(true);
  };

  const openEditModal = async (
    income
  ) => {

    setEditingIncome(income);

    setModalOpen(true);

    setForm({
      farm_id: income.farm_id || "",
      crop_id: income.crop_id || "",
      harvest_quantity:
        income.harvest_quantity || "",
      unit: income.unit || "",
      amount: income.amount || "",
      income_date:
        income.income_date?.split("T")[0] ||
        "",
      notes: income.notes || "",
    });

    try {

      const response =
        await CropsService.getAll({
          farm_id: income.farm_id,
        });

      setCrops(response ?? []);

    } catch (error) {

      pushToast(
        t("messages.GENERIC_ERROR"),
        "error"
      );
    }
  };

  const closeModal = () => {

    setModalOpen(false);

    setEditingIncome(null);

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
      !form.crop_id ||
      !form.amount
    ) {

      pushToast(
        t("messages.VALIDATION_ERROR"),
        "error"
      );

      return;
    }

    try {

      setLoading(true);

      if (editingIncome) {

        await IncomesService.update(
          editingIncome.id,
          form
        );

        pushToast(
          "Income updated"
        );

      } else {

        await IncomesService.create(
          form
        );

        pushToast(
          "Income created"
        );
      }

      closeModal();

      await loadInitialData();

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
     DELETE
  ========================================================= */

  const handleDelete = async () => {

    if (!deleteIncome) return;

    try {

      setLoading(true);

      await IncomesService.delete(
        deleteIncome.id
      );

      pushToast(
        "Income deleted"
      );

      setDeleteIncome(null);

      await loadInitialData();

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
     TABLE
  ========================================================= */

  const columns = [

    {
      key: "farm",
      header: t("incomes.farm"),
      render: (row) => (
        <span className="farm-name">
          {farmsMap[row.farm_id] || "—"}
        </span>
      ),
    },

    {
      key: "crop",
      header: t("incomes.crop"),
      render: (row) => {

        const cropName =
          row.crop_name ||
          row.crop?.crop_name ||
          cropsMap[row.crop_id];

        return (
          <div className="income-crop-cell">
            <strong>
              {cropName || "—"}
            </strong>
          </div>
        );
      },
    },

    {
      key: "financial_year",
      header: t("incomes.financial_year"),
      render: (row) => (
        <span className="financial-year">
          {row.financial_year || "—"}
        </span>
      ),
    },

    {
      key: "quantity",
      header: t("incomes.harvest"),
      render: (row) => (
        <span className="harvest-cell">
          {row.harvest_quantity}{" "}
          {row.unit}
        </span>
      ),
    },

    {
      key: "amount",
      header: t("incomes.amount"),
      render: (row) => (
        <strong className="amount-cell">
          ₹{" "}
          {Number(
            row.amount
          ).toLocaleString()}
        </strong>
      ),
    },

    {
      key: "income_date",
      header: t("incomes.income_date"),
      render: (row) => (
        <span className="date-cell">
          {row.income_date?.split("T")[0] ||
            "—"}
        </span>
      ),
    },

    {
      key: "actions",
      header: t("incomes.actions"),
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
              setDeleteIncome(row)
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
        title={t("incomes.title")}
        subtitle={t("incomes.subtitle")}
        action={
          <Button
            variant="primary"
            onClick={openCreateModal}
          >
            <IconPlus />
            {t("incomes.add")}
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
              {t("incomes.financial_year")}
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
                  {t("incomes.all_financial_years")}
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
          title={t("incomes.total_income")}
          value={`₹ ${stats.totalIncome.toLocaleString()}`}
          subtitle={t("incomes.total_income")}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={<IconFarm size={22} />}
          title={t("incomes.connected_farms")}
          value={stats.farms}
          subtitle={t("incomes.connected_farms")}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          icon={<IconCrop size={22} />}
          title={t("incomes.income_crops")}
          value={stats.crops}
          subtitle={t("incomes.income_crops")}
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
            placeholder={t("incomes.search")}
          />
{/* 
          <Select
            value={filters.farm_id}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                farm_id:
                  e.target.value,
              }))
            }
          >

            <option value="all">
              All Farms
            </option>

            {farms.map((farm) => (

              <option
                key={farm.id}
                value={farm.id}
              >
                {farm.farm_name}
              </option>

            ))}

          </Select> */}

        </div>

      </Card>

      <div className="page__section">

        {loading ? (

          <Card>

            <div className="loading-state">
              {t("incomes.loading")}
            </div>

          </Card>

        ) : incomes.length === 0 ? (

          <EmptyState
            icon={<IconExpense />}
            message={t("incomes.empty")}
          />

        ) : (

          <>

            <div className="incomes-desktop-table">

              <Table
                columns={columns}
                rows={incomes}
                rowKey={(row) => row.id}
                emptyMessage={t("incomes.empty")}
              />

            </div>

            <div className="incomes-mobile-list">

              {incomes.map((income) => {

                const cropName =
                  income.crop_name ||
                  income.crop?.crop_name ||
                  cropsMap[income.crop_id];

                return (

                  <Card
                    key={income.id}
                    className="income-mobile-card"
                  >

                    <div className="income-mobile-card__header">

                      <div>

                        <h3>
                          {cropName || "—"}
                        </h3>

                        <div className="income-mobile-farm">
                          {farmsMap[income.farm_id] || "—"}
                        </div>

                      </div>

                      <strong className="income-mobile-amount">
                        ₹ {Number(
                          income.amount || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

                    <div className="income-mobile-card__body">

                      <div className="income-mobile-grid">

                        <div className="income-mobile-item">

                          <div className="income-mobile-label">
                            {t("incomes.financial_year")}
                          </div>

                          <div className="income-mobile-value">
                            {income.financial_year || "—"}
                          </div>

                        </div>

                        <div className="income-mobile-item">

                          <div className="income-mobile-label">
                            Harvest
                          </div>

                          <div className="income-mobile-value">
                            {income.harvest_quantity} {income.unit}
                          </div>

                        </div>

                        <div className="income-mobile-item">

                          <div className="income-mobile-label">
                            Income Date
                          </div>

                          <div className="income-mobile-value">
                            {income.income_date?.split("T")[0] || "—"}
                          </div>

                        </div>

                      </div>

                      <div className="income-mobile-card__actions">

                        <button
                          className="icon-btn"
                          onClick={() =>
                            openEditModal(income)
                          }
                        >
                          <IconEdit size={16} />
                        </button>

                        <button
                          className="icon-btn icon-btn--danger"
                          onClick={() =>
                            setDeleteIncome(income)
                          }
                        >
                          <IconTrash size={16} />
                        </button>

                      </div>

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
          editingIncome
            ? "Edit Income"
            : "Add Income"
        }
      >

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <Select
              label={t("incomes.farm")}
              value={form.farm_id}
              onChange={(e) =>
                handleFarmSelect(
                  e.target.value
                )
              }
            >

              <option value="">
                {t("incomes.select_farm")}
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
              label={t("incomes.crop")}
              value={form.crop_id}
              onChange={handleChange(
                "crop_id"
              )}
              disabled={!form.farm_id}
            >

              <option value="">
                {t("incomes.select_farm")}
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

            <Input
              label={t("incomes.harvest_quantity")}
              type="number"
              value={
                form.harvest_quantity
              }
              onChange={handleChange(
                "harvest_quantity"
              )}
            />

            <Input
              label={t("incomes.unit")}
              value={form.unit}
              onChange={handleChange(
                "unit"
              )}
            />

            <Input
              label={t("incomes.amount")}
              type="number"
              value={form.amount}
              onChange={handleChange(
                "amount"
              )}
            />

            <Input
              type="date"
              label={t("incomes.income_date")}
              value={form.income_date}
              onChange={handleChange(
                "income_date"
              )}
            />

            <Input
              label={t("incomes.notes")}
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
              {editingIncome
                ? t("incomes.update")
                : t("incomes.create")}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmDialog
        open={!!deleteIncome}
        title={t("incomes.delete")}
        message={t("incomes.delete_confirm")}
        confirmText={t("incomes.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteIncome(null)
        }
        loading={loading}
      />

    </div>
  );
}