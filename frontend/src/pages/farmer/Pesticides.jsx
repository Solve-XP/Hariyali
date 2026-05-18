import "./Pesticides.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { useApp } from "../../context/AppContext";

import { PesticidesService } from "../../services/pesticidesService";

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
  pesticide_name: "",
  quantity: "",
  unit: "",
  application_date: "",
  notes: "",
};

export default function Pesticides() {

  const { t } = useTranslation();

  const { pushToast } = useApp();

  const [pesticides, setPesticides] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingPesticide, setEditingPesticide] =
    useState(null);

  const [deletePesticide, setDeletePesticide] =
    useState(null);

  const [selectedFY, setSelectedFY] =
    useState("all");

  const [form, setForm] = useState(
    EMPTY_FORM
  );

  const [filters, setFilters] = useState({
    search: "",
  });

  const [debouncedFilters, setDebouncedFilters] =
    useState(filters);

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

    loadPesticides();

  }, []);

  /* =========================================================
     FILTER CHANGE LOAD
  ========================================================= */

  useEffect(() => {

    loadPesticides(debouncedFilters);

  }, [debouncedFilters]);

  /* =========================================================
     LOAD PESTICIDES
  ========================================================= */

  const loadPesticides = async (
    customFilters = debouncedFilters
  ) => {

    try {

      setLoading(true);

      const response =
        await PesticidesService.getAll(
          customFilters
        );

      setPesticides(response ?? []);

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

    setEditingPesticide(null);

    setForm(EMPTY_FORM);

    setModalOpen(true);
  };

  const openEditModal = (
    pesticide
  ) => {

    setEditingPesticide(pesticide);

    setForm({

      pesticide_name:
        pesticide.pesticide_name || "",

      quantity:
        pesticide.quantity || "",

      unit:
        pesticide.unit || "",

      application_date:
        pesticide.application_date?.split("T")[0] || "",

      notes:
        pesticide.notes || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {

    setModalOpen(false);

    setEditingPesticide(null);

    setForm(EMPTY_FORM);
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
      !form.pesticide_name ||
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

      if (editingPesticide) {

        await PesticidesService.update(
          editingPesticide.id,
          form
        );

        pushToast(
          t("pesticides.updated")
        );

      } else {

        await PesticidesService.create(
          form
        );

        pushToast(
          t("pesticides.created")
        );
      }

      closeModal();

      await loadPesticides(
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

  const handleDelete = async () => {

    if (!deletePesticide) return;

    try {

      setLoading(true);

      await PesticidesService.delete(
        deletePesticide.id
      );

      pushToast(
        t("pesticides.deleted")
      );

      setDeletePesticide(null);

      await loadPesticides(
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
     MEMOIZED DATA
  ========================================================= */

  const financialYears = useMemo(() => (

    [
      ...new Set(
        pesticides
          .map((p) => p.financial_year)
          .filter(Boolean)
      ),
    ]

  ), [pesticides]);

  const filteredPesticides = useMemo(() => {

    if (selectedFY === "all") {

      return pesticides;
    }

    return pesticides.filter(
      (pesticide) =>
        pesticide.financial_year === selectedFY
    );

  }, [pesticides, selectedFY]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = {

    total:
      filteredPesticides.length,

    totalQuantity:
      filteredPesticides.reduce(
        (acc, item) =>
          acc + Number(item.quantity || 0),
        0
      ),

    financialYears:
      financialYears.length,

    latestApplication:
      filteredPesticides[0]
        ?.application_date
        ?.split("T")[0] || "—",
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [

    {
      key: "pesticide_name",
      header: t("pesticides.name"),
      render: (row) => (
        <div className="pesticide-name-cell">
          <strong>
            {row.pesticide_name}
          </strong>
        </div>
      ),
    },

    {
      key: "quantity",
      header: t("pesticides.quantity"),
      render: (row) => (
        <span className="quantity-cell">
          {row.quantity} {row.unit}
        </span>
      ),
    },

    {
      key: "financial_year",
      header: t("pesticides.financial_year"),
      render: (row) => (
        <span className="financial-year">
          {row.financial_year || "—"}
        </span>
      ),
    },

    {
      key: "application_date",
      header: t("pesticides.application_date"),
      render: (row) => (
        <span className="date-cell">
          {row.application_date?.split("T")[0] || "—"}
        </span>
      ),
    },

    {
      key: "notes",
      header: t("pesticides.notes"),
      render: (row) => (
        <span className="notes-cell">
          {row.notes || "—"}
        </span>
      ),
    },

    {
      key: "actions",
      header: t("pesticides.actions"),
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
              setDeletePesticide(row)
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
        title={t("pesticides.title")}
        subtitle={t("pesticides.subtitle")}
        action={
          <Button
            variant="primary"
            onClick={openCreateModal}
          >
            <IconPlus />
            {t("pesticides.add")}
          </Button>
        }
      />

      <div className="grid grid--4">

        <StatsCard
          icon={<IconFarmYear size={22} />}
          title={t("pesticides.financial_year")}
          value={
            <Select
              value={selectedFY}
              onChange={(e) =>
                setSelectedFY(
                  e.target.value
                )
              }
              className="stats-fy-select"
            >

              <option value="all">
                {t("pesticides.all_financial_years")}
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
          title={t("pesticides.total_records")}
          value={stats.total}
          subtitle={t("pesticides.records")}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          title={t("pesticides.total_quantity")}
          value={stats.totalQuantity}
          subtitle={t("pesticides.total_used")}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          title={t("pesticides.latest_application")}
          value={stats.latestApplication}
          subtitle={t("pesticides.latest_record")}
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
            placeholder={t("pesticides.search")}
          />

        </div>

      </Card>

      <div className="page__section">

        {loading ? (

          <Card>

            <div className="loading-state">
              {t("pesticides.loading")}
            </div>

          </Card>

        ) : filteredPesticides.length === 0 ? (

          <EmptyState
            message={t("pesticides.empty")}
          />

        ) : (

          <>

            <div className="pesticides-desktop-table">

              <Table
                columns={columns}
                rows={filteredPesticides}
                rowKey={(row) => row.id}
                emptyMessage={t("pesticides.empty")}
              />

            </div>

            <div className="pesticides-mobile-list">

              {filteredPesticides.map((item) => (

                <Card
                  key={item.id}
                  className="pesticide-mobile-card"
                >

                  <div className="pesticide-mobile-card__header">

                    <h3>
                      {item.pesticide_name}
                    </h3>

                    <span className="financial-year">
                      {item.financial_year}
                    </span>

                  </div>

                  <div className="pesticide-mobile-card__body">

                    <div className="pesticide-mobile-grid">

                      <div className="pesticide-mobile-item">

                        <div className="pesticide-mobile-label">
                          {t("pesticides.quantity")}
                        </div>

                        <div className="pesticide-mobile-value">
                          {item.quantity} {item.unit}
                        </div>

                      </div>

                      <div className="pesticide-mobile-item">

                        <div className="pesticide-mobile-label">
                          {t("pesticides.application_date")}
                        </div>

                        <div className="pesticide-mobile-value">
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
                        setDeletePesticide(item)
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
          editingPesticide
            ? t("pesticides.edit")
            : t("pesticides.create")
        }
      >

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <Input
              label={t("pesticides.name")}
              value={form.pesticide_name}
              onChange={handleChange(
                "pesticide_name"
              )}
            />

            <Input
              type="number"
              label={t("pesticides.quantity")}
              value={form.quantity}
              onChange={handleChange(
                "quantity"
              )}
            />

            <Input
              label={t("pesticides.unit")}
              value={form.unit}
              onChange={handleChange(
                "unit"
              )}
            />

            <Input
              type="date"
              label={t("pesticides.application_date")}
              value={form.application_date}
              onChange={handleChange(
                "application_date"
              )}
            />

            <Input
              label={t("pesticides.notes")}
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
              {editingPesticide
                ? t("pesticides.update")
                : t("pesticides.create")}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmDialog
        open={!!deletePesticide}
        title={t("pesticides.delete")}
        message={`${t("pesticides.delete_confirm")} "${deletePesticide?.pesticide_name}"?`}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() =>
          setDeletePesticide(null)
        }
        loading={loading}
      />

    </div>
  );
}