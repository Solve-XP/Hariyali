import "./Pesticides.css";

import {
  useEffect,
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
  IconFinancialYear,
  IconTotalQuantity,
  IconTotalRecords,
  IconLatestApplication,
  IconPesticide,
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

  const [allPesticides, setAllPesticides] =
    useState([]);

  const [pesticides, setPesticides] =
    useState([]);

  /* FIXED FINANCIAL YEAR STATE */

  const [financialYears, setFinancialYears] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    editingPesticide,
    setEditingPesticide,
  ] = useState(null);

  const [
    deletePesticide,
    setDeletePesticide,
  ] = useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [filters, setFilters] =
    useState({
      search: "",
      financial_year: "all",
    });
  
  const UNIT_OPTIONS = [
    "kg",
    "gram",
    "liter",
    "ml",
    "bag",
    "packet",
    "quintal",
    "ton",
    "piece",
    "other",
  ];

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

    loadPesticides(debouncedFilters);

  }, [debouncedFilters]);

  /* =========================================================
     LOAD PESTICIDES
  ========================================================= */

  const loadPesticides = async (
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
        await PesticidesService.getAll(
          params
        );

      const data = response ?? [];

      setAllPesticides(data);

      setPesticides(data);

      /* FIXED FINANCIAL YEARS */

      setFinancialYears((prev) => {

        const years = [
          ...prev,
          ...data
            .map(
              (p) =>
                p.financial_year
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

    setEditingPesticide(null);

    setForm(EMPTY_FORM);

    setModalOpen(true);
  };

  const openEditModal = (
    pesticide
  ) => {

    setEditingPesticide(
      pesticide
    );

    setForm({
      pesticide_name:
        pesticide.pesticide_name ||
        "",

      quantity:
        pesticide.quantity || "",

      unit:
        pesticide.unit || "",

      application_date:
        pesticide.application_date?.split(
          "T"
        )[0] || "",

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

    // const unitRegex =
    //   /^[A-Za-z\s]+$/;

    // if (
    //   !unitRegex.test(form.unit)
    // ) {

    //   pushToast(
    //     "Unit must contain only letters",
    //     "error"
    //   );

    //   return;
    // }

    try {

      setLoading(true);

      if (
        editingPesticide
      ) {

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

  const handleDelete =
    async () => {

      if (!deletePesticide)
        return;

      try {

        setLoading(true);

        await PesticidesService.delete(
          deletePesticide.id
        );

        pushToast(
          t("pesticides.deleted")
        );

        setDeletePesticide(
          null
        );

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
     STATS
  ========================================================= */

  const stats = {

    total:
      pesticides.length,

    totalQuantity:
      pesticides.reduce(
        (acc, item) =>
          acc +
          Number(
            item.quantity || 0
          ),
        0
      ),

    latestApplication:
      pesticides[0]
        ?.application_date
        ?.split("T")[0] || "—",
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [

    {
      key: "pesticide_name",
      header:
        t("pesticides.name"),
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
      header:
        t(
          "pesticides.quantity"
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
          "pesticides.financial_year"
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
          "pesticides.application_date"
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
        t("pesticides.notes"),
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
          "pesticides.actions"
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
              setDeletePesticide(
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
        title={t(
          "pesticides.title"
        )}
        subtitle={t(
          "pesticides.subtitle"
        )}
        action={
          <Button
            variant="primary"
            onClick={
              openCreateModal
            }
          >
            <IconPlus />
            {t(
              "pesticides.add"
            )}
          </Button>
        }
      />

      <div className="grid grid--4">

        <StatsCard
          icon={
            <IconFinancialYear
              size={22}
            />
          }
          title={t(
            "pesticides.financial_year"
          )}
          value={
            <Select
              value={
                filters.financial_year
              }
              onChange={(e) =>
                setFilters(
                  (prev) => ({
                    ...prev,
                    financial_year:
                      e.target.value,
                  })
                )
              }
              className="stats-fy-select"
            >

              <option value="all">
                {t(
                  "pesticides.all_financial_years"
                )}
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
          }
          subtitle={
            filters.financial_year
          }
          colorClass="stat-card__icon--info"
        />

        <StatsCard
          icon={
            <IconTotalRecords
              size={22}
            />
          }
          title={t(
            "pesticides.total_records"
          )}
          value={stats.total}
          subtitle={t(
            "pesticides.records"
          )}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={
            <IconTotalQuantity
              size={22}
            />
          }
          title={t(
            "pesticides.total_quantity"
          )}
          value={
            stats.totalQuantity
          }
          subtitle={t(
            "pesticides.total_used"
          )}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          icon={
            <IconLatestApplication
              size={22}
            />
          }
          title={t(
            "pesticides.latest_application"
          )}
          value={
            stats.latestApplication
          }
          subtitle={t(
            "pesticides.latest_record"
          )}
          colorClass="stat-card__icon--purple"
        />

      </div>

      <Card>

        <div className="filters-bar">

          <SearchInput
            value={
              filters.search
            }
            onChange={(e) =>
              setFilters(
                (prev) => ({
                  ...prev,
                  search:
                    e.target.value,
                })
              )
            }
            placeholder={t(
              "pesticides.search"
            )}
          />

        </div>

      </Card>

      <div className="page__section">

        {loading ? (

          <Card>

            <div className="loading-state">
              {t(
                "pesticides.loading"
              )}
            </div>

          </Card>

        ) : pesticides.length ===
          0 ? (

          <EmptyState
            icon={
              <IconPesticide />
            }
            message={t(
              "pesticides.empty"
            )}
          />

        ) : (

          <>

            {/* Desktop Table */}

            <div className="pesticides-desktop-table">

              <Table
                columns={columns}
                rows={pesticides}
                rowKey={(row) =>
                  row.id
                }
                emptyMessage={t(
                  "pesticides.empty"
                )}
              />

            </div>

            {/* Mobile Cards */}

            <div className="pesticides-mobile-list">

              {pesticides.map(
                (pesticide) => (

                  <Card
                    key={
                      pesticide.id
                    }
                    className="pesticide-mobile-card"
                  >

                    <div className="pesticide-mobile-card__header">

                      <div>

                        <h3>
                          {pesticide.pesticide_name ||
                            "—"}
                        </h3>

                      </div>

                      <strong className="quantity-cell">
                        {
                          pesticide.quantity
                        }{" "}
                        {
                          pesticide.unit
                        }
                      </strong>

                    </div>

                    <div className="pesticide-mobile-grid">

                      <div className="pesticide-mobile-item">

                        <span className="pesticide-mobile-label">
                          {t(
                            "pesticides.financial_year"
                          )}
                        </span>

                        <span className="pesticide-mobile-value">
                          {pesticide.financial_year ||
                            "—"}
                        </span>

                      </div>

                      <div className="pesticide-mobile-item">

                        <span className="pesticide-mobile-label">
                          {t(
                            "pesticides.application_date"
                          )}
                        </span>

                        <span className="pesticide-mobile-value">
                          {pesticide.application_date
                            ?.split(
                              "T"
                            )[0] ||
                            "—"}
                        </span>

                      </div>

                      <div className="pesticide-mobile-item">

                        <span className="pesticide-mobile-label">
                          {t(
                            "pesticides.notes"
                          )}
                        </span>

                        <span className="pesticide-mobile-value">
                          {pesticide.notes ||
                            "—"}
                        </span>

                      </div>

                    </div>

                    <div className="table-actions">

                      <button
                        className="icon-btn"
                        onClick={() =>
                          openEditModal(
                            pesticide
                          )
                        }
                      >
                        <IconEdit size={16} />
                      </button>

                      <button
                        className="icon-btn icon-btn--danger"
                        onClick={() =>
                          setDeletePesticide(
                            pesticide
                          )
                        }
                      >
                        <IconTrash size={16} />
                      </button>

                    </div>

                  </Card>

                )
              )}

            </div>

          </>

        )}

      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingPesticide
            ? t(
                "pesticides.edit"
              )
            : t(
                "pesticides.create"
              )
        }
      >

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-grid">

            <Input
              label={t(
                "pesticides.name"
              )}
              value={
                form.pesticide_name
              }
              onChange={handleChange(
                "pesticide_name"
              )}
            />

            <Input
              type="number"
              min="1"
              step="1"
              label={t(
                "pesticides.quantity"
              )}
              value={
                form.quantity
              }
              onChange={handleChange(
                "quantity"
              )}
            />

            {/* <Input
              label={t(
                "pesticides.unit"
              )}
              value={
                form.unit
              }
              onChange={handleChange(
                "unit"
              )}
            /> */}

            <Select
              label={t(
                "pesticides.unit"
              )}
              value={
                form.unit
              }
              onChange={handleChange(
                "unit"
              )}
            >

              <option value="">
                {t(
                  "pesticides.select_unit"
                )}
              </option>

              {UNIT_OPTIONS.map(
                (unit) => (

                  <option
                    key={unit}
                    value={unit}
                  >
                    {t(
                      `pesticides.unit_${unit}`
                    )}
                  </option>

                )
              )}

            </Select>

            <Input
              type="date"
              label={t(
                "pesticides.application_date"
              )}
              value={
                form.application_date
              }
              onChange={handleChange(
                "application_date"
              )}
            />

            <Input
              label={t(
                "pesticides.notes"
              )}
              optional
              value={
                form.notes
              }
              onChange={handleChange(
                "notes"
              )}
            />

          </div>

          <div className="form-actions">

            <Button
              type="button"
              variant="secondary"
              onClick={
                closeModal
              }
            >
              {t(
                "common.cancel"
              )}
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {editingPesticide
                ? t(
                    "pesticides.update"
                  )
                : t(
                    "pesticides.create"
                  )}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmDialog
        open={
          !!deletePesticide
        }
        title={t(
          "pesticides.delete"
        )}
        message={`${t(
          "pesticides.delete_confirm"
        )} "${
          deletePesticide?.pesticide_name
        }"?`}
        confirmText={t(
          "common.delete"
        )}
        cancelText={t(
          "common.cancel"
        )}
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setDeletePesticide(
            null
          )
        }
        loading={loading}
      />

    </div>
  );
}