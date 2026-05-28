/* =========================================================
   UPDATED FERTILIZERS PAGE
   FULL BACKEND SEARCH + FILTER ARCHITECTURE
   FIXED FINANCIAL YEAR DROPDOWN ISSUE
========================================================= */

import "./Fertilizers.css";

import {
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { useApp } from "../../context/AppContext";

import { FertilizersService } from "../../services/fertilizersService";

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
  IconFertilizer,
  IconFinancialYear,
  IconTotalQuantity,
  IconTotalRecords,
  IconLatestApplication,
} from "../../components/Icons";

const EMPTY_FORM = {
  fertilizer_name: "",
  quantity: "",
  unit: "",
  application_date: "",
  notes: "",
};

export default function Fertilizers() {

  const { t } = useTranslation();

  const { pushToast } = useApp();

  const [allFertilizers, setAllFertilizers] =
    useState([]);

  const [fertilizers, setFertilizers] =
    useState([]);

  const [financialYears, setFinancialYears] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    editingFertilizer,
    setEditingFertilizer,
  ] = useState(null);

  const [
    deleteFertilizer,
    setDeleteFertilizer,
  ] = useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [filters, setFilters] =
    useState({
      search: "",
      financial_year: "all",
    });

  const [
    debouncedFilters,
    setDebouncedFilters,
  ] = useState(filters);

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
     LOAD ON FILTER CHANGE
  ========================================================= */

  useEffect(() => {

    loadFertilizers(debouncedFilters);

  }, [debouncedFilters]);

  /* =========================================================
     LOAD FERTILIZERS
  ========================================================= */

  const loadFertilizers = async (
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
        await FertilizersService.getAll(
          params
        );

      const data = response ?? [];

      setAllFertilizers(data);

      setFertilizers(data);

      /* KEEP ALL YEARS */

      setFinancialYears((prev) => {

        const years = [
          ...prev,
          ...data
            .map(
              (f) =>
                f.financial_year
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
     FORM HELPERS
  ========================================================= */

  const openCreateModal = () => {

    setEditingFertilizer(null);

    setForm(EMPTY_FORM);

    setModalOpen(true);
  };

  const openEditModal = (
    fertilizer
  ) => {

    setEditingFertilizer(
      fertilizer
    );

    setForm({
      fertilizer_name:
        fertilizer.fertilizer_name ||
        "",

      quantity:
        fertilizer.quantity || "",

      unit:
        fertilizer.unit || "",

      application_date:
        fertilizer.application_date?.split(
          "T"
        )[0] || "",

      notes:
        fertilizer.notes || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {

    setModalOpen(false);

    setEditingFertilizer(null);

    setForm(EMPTY_FORM);
  };

  const handleChange =
    (field) => (e) => {

      setForm((prev) => ({
        ...prev,
        [field]:
          e.target.value,
      }));
    };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.fertilizer_name ||
      !form.quantity ||
      !form.unit ||
      !form.application_date
    ) {

      pushToast(
        t("messages.VALIDATION_ERROR"),
        "error"
      );

      return;
    }

    const quantity =
      Number(form.quantity);

    if (
      quantity <= 0 ||
      !Number.isInteger(quantity)
    ) {

      pushToast(
        "Quantity must be a positive integer",
        "error"
      );

      return;
    }

    const unitRegex =
      /^[A-Za-z\s]+$/;

    if (
      !unitRegex.test(form.unit)
    ) {

      pushToast(
        "Unit must contain only letters",
        "error"
      );

      return;
    }

    try {

      setLoading(true);

      if (
        editingFertilizer
      ) {

        await FertilizersService.update(
          editingFertilizer.id,
          form
        );

        pushToast(
          t("fertilizers.updated")
        );

      } else {

        await FertilizersService.create(
          form
        );

        pushToast(
          t("fertilizers.created")
        );
      }

      closeModal();

      await loadFertilizers(
        debouncedFilters
      );

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

  const handleDelete =
    async () => {

      if (!deleteFertilizer)
        return;

      try {

        setLoading(true);

        await FertilizersService.delete(
          deleteFertilizer.id
        );

        pushToast(
          t("fertilizers.deleted")
        );

        setDeleteFertilizer(
          null
        );

        await loadFertilizers(
          debouncedFilters
        );

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
     STATS
  ========================================================= */

  const stats = {

    total:
      fertilizers.length,

    totalQuantity:
      fertilizers.reduce(
        (acc, item) =>
          acc +
          Number(
            item.quantity || 0
          ),
        0
      ),

    latestApplication:
      fertilizers[0]
        ?.application_date
        ?.split("T")[0] || "—",
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [

    {
      key: "fertilizer_name",
      header:
        t("fertilizers.name"),
      render: (row) => (
        <div className="fertilizer-name-cell">
          <strong>
            {row.fertilizer_name}
          </strong>
        </div>
      ),
    },

    {
      key: "quantity",
      header:
        t(
          "fertilizers.quantity"
        ),
      render: (row) => (
        <span className="quantity-cell">
          {row.quantity}{" "}
          {row.unit}
        </span>
      ),
    },

    {
      key: "financial_year",
      header:
        t(
          "fertilizers.financial_year"
        ),
      render: (row) => (
        <span className="financial-year">
          {row.financial_year ||
            "—"}
        </span>
      ),
    },

    {
      key: "application_date",
      header:
        t(
          "fertilizers.application_date"
        ),
      render: (row) => (
        <span className="date-cell">
          {row.application_date?.split(
            "T"
          )[0] || "—"}
        </span>
      ),
    },

    {
      key: "notes",
      header:
        t("fertilizers.notes"),
      render: (row) => (
        <span className="notes-cell">
          {row.notes || "—"}
        </span>
      ),
    },

    {
      key: "actions",
      header:
        t(
          "fertilizers.actions"
        ),
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
              setDeleteFertilizer(
                row
              )
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
        title={t("fertilizers.title")}
        subtitle={t("fertilizers.subtitle")}
        action={
          <Button
            variant="primary"
            onClick={openCreateModal}
          >
            <IconPlus />
            {t("fertilizers.add")}
          </Button>
        }
      />

      <div className="grid grid--4">

        <StatsCard
          icon={<IconFinancialYear size={22} />}
          title={t("fertilizers.financial_year")}
          value={
            <Select
              value={filters.financial_year}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  financial_year:
                    e.target.value,
                }))
              }
              className="stats-fy-select"
            >

              <option value="all">
                {t(
                  "fertilizers.all_financial_years"
                )}
              </option>

              {financialYears.map((fy) => (

                <option
                  key={fy}
                  value={fy}
                >
                  {fy}
                </option>

              ))}

            </Select>
          }
          subtitle={
            filters.financial_year === "all"
              ? t(
                  "fertilizers.all_financial_years"
                )
              : filters.financial_year
          }
          colorClass="stat-card__icon--info"
        />

        <StatsCard
          icon={<IconTotalRecords size={22} />}
          title={t("fertilizers.total_records")}
          value={stats.total}
          subtitle={t("fertilizers.records")}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={<IconTotalQuantity size={22} />}
          title={t("fertilizers.total_quantity")}
          value={stats.totalQuantity}
          subtitle={t("fertilizers.total_used")}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          icon={<IconLatestApplication size={22} />}
          title={t("fertilizers.latest_application")}
          value={stats.latestApplication}
          subtitle={t("fertilizers.latest_record")}
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
            placeholder={t("fertilizers.search")}
          />

        </div>

      </Card>

      <div className="page__section">

        {loading ? (

          <Card>

            <div className="loading-state">
              {t("fertilizers.loading")}
            </div>

          </Card>

        ) : fertilizers.length === 0 ? (

          <EmptyState
            icon={<IconFertilizer />}
            message={t("fertilizers.empty")}
          />

        ) : (

          <>

            <div className="fertilizers-desktop-table">

              <Table
                columns={columns}
                rows={fertilizers}
                rowKey={(row) => row.id}
                emptyMessage={t("fertilizers.empty")}
              />

            </div>

            <div className="fertilizers-mobile-list">

              {fertilizers.map((item) => (

                <Card
                  key={item.id}
                  className="fertilizer-mobile-card"
                >

                  <div className="fertilizer-mobile-card__header">

                    <h3>
                      {item.fertilizer_name}
                    </h3>

                    <span className="financial-year">
                      {item.financial_year}
                    </span>

                  </div>

                  <div className="fertilizer-mobile-card__body">

                    <div className="fertilizer-mobile-grid">

                      <div className="fertilizer-mobile-item">

                        <div className="fertilizer-mobile-label">
                          {t("fertilizers.quantity")}
                        </div>

                        <div className="fertilizer-mobile-value">
                          {item.quantity} {item.unit}
                        </div>

                      </div>

                      <div className="fertilizer-mobile-item">

                        <div className="fertilizer-mobile-label">
                          {t("fertilizers.application_date")}
                        </div>

                        <div className="fertilizer-mobile-value">
                          {item.application_date?.split("T")[0] || "—"}
                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="crop-mobile-card__actions">

                    <button
                      className="icon-btn"
                      onClick={() =>
                        openEditModal(item)
                      }
                    >
                      <IconEdit size={16} />
                    </button>

                    <button
                      className="icon-btn icon-btn--danger"
                      onClick={() =>
                        setDeleteFertilizer(item)
                      }
                    >
                      <IconTrash size={16} />
                    </button>

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
          editingFertilizer
            ? t("fertilizers.edit")
            : t("fertilizers.create")
        }
      >

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <Input
              label={t("fertilizers.name")}
              value={form.fertilizer_name}
              onChange={handleChange("fertilizer_name")}
            />

            <Input
              type="number"
              label={t("fertilizers.quantity")}
              value={form.quantity}
              onChange={handleChange("quantity")}
            />

            <Input
              label={t("fertilizers.unit")}
              value={form.unit}
              onChange={handleChange("unit")}
            />

            <Input
              type="date"
              label={t("fertilizers.application_date")}
              value={form.application_date}
              onChange={handleChange("application_date")}
            />

            <Input
              label={t("fertilizers.notes")}
              optional
              value={form.notes}
              onChange={handleChange("notes")}
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
              {editingFertilizer
                ? t("fertilizers.update")
                : t("fertilizers.create")}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmDialog
        open={!!deleteFertilizer}
        title={t("fertilizers.delete")}
        message={`${t("fertilizers.delete_confirm")} "${deleteFertilizer?.fertilizer_name}"?`}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteFertilizer(null)
        }
        loading={loading}
      />

    </div>
  );
}