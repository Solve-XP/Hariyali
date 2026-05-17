
import "./Fertilizers.css";

import {
  useEffect,
  useMemo,
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
  IconFarmYear,
  IconFertilizer,
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

  const [fertilizers, setFertilizers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingFertilizer, setEditingFertilizer] = useState(null);

  const [deleteFertilizer, setDeleteFertilizer] = useState(null);

  const [selectedFY, setSelectedFY] = useState("all");

  const [form, setForm] = useState(EMPTY_FORM);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  /* =========================================================
     DEBOUNCE SEARCH
  ========================================================= */

  useEffect(() => {

    const timer = setTimeout(() => {

      setDebouncedFilters(filters);

    }, 500);

    return () => clearTimeout(timer);

  }, [filters]);

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {

    loadFertilizers();

  }, []);

  /* =========================================================
     FILTER CHANGE LOAD
  ========================================================= */

  useEffect(() => {

    loadFertilizers(debouncedFilters);

  }, [debouncedFilters]);

  /* =========================================================
     LOAD FERTILIZERS
  ========================================================= */

  const loadFertilizers = async (
    customFilters = debouncedFilters
  ) => {

    try {

      setLoading(true);

      const response = await FertilizersService.getAll(
        customFilters
      );

      setFertilizers(response ?? []);

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

  const openEditModal = (fertilizer) => {

    setEditingFertilizer(fertilizer);

    setForm({
      fertilizer_name:
        fertilizer.fertilizer_name || "",

      quantity:
        fertilizer.quantity || "",

      unit:
        fertilizer.unit || "",

      application_date:
        fertilizer.application_date?.split("T")[0] || "",

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

  const handleChange = (field) => (e) => {

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

    try {

      setLoading(true);

      if (editingFertilizer) {

        await FertilizersService.update(
          editingFertilizer.id,
          form
        );

        pushToast(t("fertilizers.updated"));

      } else {

        await FertilizersService.create(form);

        pushToast(t("fertilizers.created"));
      }

      closeModal();

      await loadFertilizers(debouncedFilters);

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

    if (!deleteFertilizer) return;

    try {

      setLoading(true);

      await FertilizersService.delete(
        deleteFertilizer.id
      );

      pushToast(t("fertilizers.deleted"));

      setDeleteFertilizer(null);

      await loadFertilizers(debouncedFilters);

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
     MEMOIZED DATA
  ========================================================= */

  const financialYears = useMemo(() => (

    [
      ...new Set(
        fertilizers
          .map((f) => f.financial_year)
          .filter(Boolean)
      ),
    ]

  ), [fertilizers]);

  const filteredFertilizers = useMemo(() => {

    if (selectedFY === "all") {
      return fertilizers;
    }

    return fertilizers.filter(
      (fertilizer) =>
        fertilizer.financial_year === selectedFY
    );

  }, [fertilizers, selectedFY]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = {

    total: filteredFertilizers.length,

    totalQuantity: filteredFertilizers.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    ),

    financialYears: financialYears.length,

    latestApplication:
      filteredFertilizers[0]?.application_date?.split("T")[0] || "—",
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [

    {
      key: "fertilizer_name",
      header: t("fertilizers.name"),
      render: (row) => (
        <div className="fertilizer-name-cell">
          <strong>{row.fertilizer_name}</strong>
        </div>
      ),
    },

    {
      key: "quantity",
      header: t("fertilizers.quantity"),
      render: (row) => (
        <span className="quantity-cell">
          {row.quantity} {row.unit}
        </span>
      ),
    },

    {
      key: "financial_year",
      header: t("fertilizers.financial_year"),
      render: (row) => (
        <span className="financial-year">
          {row.financial_year || "—"}
        </span>
      ),
    },

    {
      key: "application_date",
      header: t("fertilizers.application_date"),
      render: (row) => (
        <span className="date-cell">
          {row.application_date?.split("T")[0] || "—"}
        </span>
      ),
    },

    {
      key: "notes",
      header: t("fertilizers.notes"),
      render: (row) => (
        <span className="notes-cell">
          {row.notes || "—"}
        </span>
      ),
    },

    {
      key: "actions",
      header: t("fertilizers.actions"),
      width: 140,
      render: (row) => (

        <div className="table-actions">

          <button
            className="icon-btn"
            onClick={() => openEditModal(row)}
          >
            <IconEdit size={16} />
          </button>

          <button
            className="icon-btn icon-btn--danger"
            onClick={() => setDeleteFertilizer(row)}
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
          icon={<IconFarmYear size={22} />}
          title={t("fertilizers.financial_year")}
          value={
            <Select
              value={selectedFY}
              onChange={(e) =>
                setSelectedFY(e.target.value)
              }
              className="stats-fy-select"
            >

              <option value="all">
                {t("fertilizers.all_financial_years")}
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
          subtitle={selectedFY}
          colorClass="stat-card__icon--info"
        />

        <StatsCard
          icon={<IconFertilizer size={22} />}
          title={t("fertilizers.total_records")}
          value={stats.total}
          subtitle={t("fertilizers.records")}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          title={t("fertilizers.total_quantity")}
          value={stats.totalQuantity}
          subtitle={t("fertilizers.total_used")}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
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
                search: e.target.value,
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

        ) : filteredFertilizers.length === 0 ? (

          <EmptyState
            message={t("fertilizers.empty")}
          />

        ) : (

          <>

            <div className="fertilizers-desktop-table">

              <Table
                columns={columns}
                rows={filteredFertilizers}
                rowKey={(row) => row.id}
                emptyMessage={t("fertilizers.empty")}
              />

            </div>

            <div className="fertilizers-mobile-list">

              {filteredFertilizers.map((item) => (

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
                      onClick={() => openEditModal(item)}
                    >
                      <IconEdit size={16} />
                    </button>

                    <button
                      className="icon-btn icon-btn--danger"
                      onClick={() => setDeleteFertilizer(item)}
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
        onCancel={() => setDeleteFertilizer(null)}
        loading={loading}
      />

    </div>
  );
}
