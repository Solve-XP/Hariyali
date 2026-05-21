/* =========================================================
   UPDATED CROPS PAGE
   FULL BACKEND SEARCH + FILTER ARCHITECTURE
   FIXED FINANCIAL YEAR DROPDOWN ISSUE
========================================================= */

import "./Crops.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { useApp } from "../../context/AppContext";

import { FarmsService } from "../../services/farmsService";
import { CropsService } from "../../services/cropsService";

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
  IconCrop,
  IconPlus,
  IconEdit,
  IconTrash,
  IconFarm,
  IconSeason,
  IconFarmYear,
} from "../../components/Icons";

const EMPTY_FORM = {
  farm_id: "",
  crop_name: "",
  season: "",
  sowing_date: "",
  expected_harvest_date: "",
};

export default function Crops() {

  const { t } = useTranslation();

  const { pushToast } = useApp();

  const [farms, setFarms] =
    useState([]);

  const [allCrops, setAllCrops] =
    useState([]);

  const [crops, setCrops] =
    useState([]);

  /* FIXED FINANCIAL YEARS */

  const [financialYears, setFinancialYears] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingCrop, setEditingCrop] =
    useState(null);

  const [deleteCrop, setDeleteCrop] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [filters, setFilters] =
    useState({
      search: "",
      farm_id: "all",
      season: "all",
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
     FILTER LOAD
  ========================================================= */

  useEffect(() => {

    loadCrops(debouncedFilters);

  }, [debouncedFilters]);

  /* =========================================================
     LOAD INITIAL DATA
  ========================================================= */

  const loadInitialData = async () => {

    try {

      setLoading(true);

      const farmsResponse =
        await FarmsService.getAll();

      setFarms(farmsResponse ?? []);

      const cropsResponse =
        await CropsService.getAll();

      const data = cropsResponse ?? [];

      setAllCrops(data);

      setCrops(data);

      /* INITIAL YEARS */

      const years = data
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
     LOAD CROPS
  ========================================================= */

  const loadCrops = async (
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

      /* SEASON */

      if (
        currentFilters.season &&
        currentFilters.season !== "all"
      ) {

        params.season =
          currentFilters.season;
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
        await CropsService.getAll(
          params
        );

      const data = response ?? [];

      setCrops(data);

      /* FIXED YEARS */

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
     MEMOIZED MAP
  ========================================================= */

  const farmsMap = useMemo(() => {

    return Object.fromEntries(

      farms.map((farm) => [
        farm.id,
        farm.farm_name,
      ])

    );

  }, [farms]);

  const farmName = (id) => {

    return farmsMap[id] || "—";
  };

  /* =========================================================
     MEMOIZED SEASONS
  ========================================================= */

  const seasons = useMemo(() => (

    [
      ...new Set(
        allCrops
          .map((c) => c.season)
          .filter(Boolean)
      ),
    ].sort()

  ), [allCrops]);

  /* =========================================================
     FORM HELPERS
  ========================================================= */

  const openCreateModal = () => {

    setEditingCrop(null);

    setForm(EMPTY_FORM);

    setModalOpen(true);
  };

  const openEditModal = (crop) => {

    setEditingCrop(crop);

    setForm({
      farm_id: crop.farm_id || "",
      crop_name: crop.crop_name || "",
      season: crop.season || "",
      sowing_date:
        crop.sowing_date?.split("T")[0] || "",
      expected_harvest_date:
        crop.expected_harvest_date?.split("T")[0] || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {

    setModalOpen(false);

    setEditingCrop(null);

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
      !form.farm_id ||
      !form.crop_name
    ) {

      pushToast(
        t("messages.VALIDATION_ERROR"),
        "error"
      );

      return;
    }

    try {

      setLoading(true);

      if (editingCrop) {

        await CropsService.update(
          editingCrop.id,
          form
        );

        pushToast(
          t("crops.crop_updated")
        );

      } else {

        await CropsService.create(
          form
        );

        pushToast(
          t("crops.crop_added")
        );
      }

      closeModal();

      await loadCrops(
        debouncedFilters
      );

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

    if (!deleteCrop)
      return;

    try {

      setLoading(true);

      await CropsService.delete(
        deleteCrop.id
      );

      pushToast(
        t("crops.crop_deleted")
      );

      setDeleteCrop(null);

      await loadCrops(
        debouncedFilters
      );

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
     STATS
  ========================================================= */

  const stats = {

    total:
      crops.length,

    farms: new Set(
      crops.map(
        (c) => c.farm_id
      )
    ).size,

    seasons: new Set(
      crops.map(
        (c) => c.season
      )
    ).size,
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [

    {
      key: "crop_name",
      header: t("crops.crop"),
      render: (row) => (
        <div className="crop-name-cell">
          <strong>
            {row.crop_name}
          </strong>
        </div>
      ),
    },

    {
      key: "farm",
      header: t("crops.farm"),
      render: (row) => (
        <span className="farm-name">
          {farmName(row.farm_id)}
        </span>
      ),
    },

    {
      key: "season",
      header: t("crops.season"),
      render: (row) => (
        <span className="season-badge">
          {row.season || "—"}
        </span>
      ),
    },

    {
      key: "financial_year",
      header: t("crops.financial_year"),
      render: (row) => (
        <span className="financial-year">
          {row.financial_year || "—"}
        </span>
      ),
    },

    {
      key: "actions",
      header: t("crops.actions"),
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
              setDeleteCrop(row)
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
        title={t("crops.title")}
        subtitle={t("crops.subtitle")}
        action={
          <Button
            variant="primary"
            onClick={openCreateModal}
          >
            <IconPlus />
            {t("crops.add_crop")}
          </Button>
        }
      />

      <div className="grid grid--4">

        <StatsCard
          icon={<IconFarmYear size={22} className="stats-card__icon-filter" />}
          title={t("crops.financial_year")}
          value={

            <Select
              value={filters.financial_year}
              onChange={(e) =>
              setFilters((prev) => ({
               ...prev,
               financial_year: e.target.value,
                }))
              }
              className="stats-fy-select"
            >

              <option value="all">
                {t("crops.all_financial_years")}
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
              ? t("crops.all_financial_years")
              : filters.financial_year  
          }
          colorClass="stat-card__icon--info"
        />

        <StatsCard
          icon={<IconCrop size={22} />}
          title={t("crops.total_crops")}
          value={stats.total}
          subtitle={t("crops.registered_crops")}
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          icon={<IconFarm size={22} />}
          title={t("crops.connected_farms")}
          value={stats.farms}
          subtitle={t("crops.farm_coverage")}
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          icon={<IconSeason size={22} />}
          title={t("crops.seasons_count")}
          value={stats.seasons}
          subtitle={t("crops.season_categories")}
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
            placeholder={t("crops.search_placeholder")}
          />
{/* 
          <Select
            value={filters.farm_id}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                farm_id: e.target.value,
              }))
            }
          >

            <option value="all">
              {t("crops.all_farms")}
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
            value={filters.season}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                season: e.target.value,
              }))
            }
          >

            <option value="all">
              {t("crops.all_seasons")}
            </option>

            {seasons.map((season) => (

              <option
                key={season}
                value={season}
              >
                {season}
              </option>

            ))}

          </Select> */}

        </div>

      </Card>

      <div className="page__section">

        {loading ? (

          <Card>

            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "var(--color-text-muted)",
                fontWeight: 600,
              }}
            >
              {t("crops.loading")}
            </div>

          </Card>

        ) : crops.length === 0 ? (

          <EmptyState
            icon={<IconCrop />}
            message={t("crops.no_crops_found")}
          />

        ) : (

          <>

            <div className="crops-desktop-table">

              <Table
                columns={columns}
                rows={crops}
                rowKey={(row) => row.id}
                emptyMessage={t("crops.no_crops_found")}
              />

            </div>

            <div className="crops-mobile-list">

              {crops.map((crop) => (

                <Card
                  key={crop.id}
                  className="crop-mobile-card"
                >

                  <div className="crop-mobile-card__header">

                    <h3>{crop.crop_name}</h3>

                    <span className="season-badge">
                      {crop.season || "—"}
                    </span>

                  </div>

                  <div className="crop-mobile-card__body">

                    <div className="crop-mobile-grid">

                      <div className="crop-mobile-item">

                        <div className="crop-mobile-label">
                          {t("crops.farm")}
                        </div>

                        <div className="crop-mobile-value">
                          {farmName(crop.farm_id)}
                        </div>

                      </div>

                      <div className="crop-mobile-item">

                        <div className="crop-mobile-label">
                          {t("crops.financial_year")}
                        </div>

                        <div className="crop-mobile-value">
                          {crop.financial_year || "—"}
                        </div>

                      </div>

                    </div>

                    <div className="crop-mobile-card__actions">

                      <button
                        className="icon-btn"
                        onClick={() => openEditModal(crop)}
                      >
                        <IconEdit size={16} />
                      </button>

                      <button
                        className="icon-btn icon-btn--danger"
                        onClick={() => setDeleteCrop(crop)}
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
          editingCrop
            ? t("crops.edit_crop")
            : t("crops.add_crop")
        }
      >

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <Select
              label={t("crops.farm")}
              value={form.farm_id}
              onChange={handleChange("farm_id")}
            >

              <option value="">
                {t("crops.select_farm")}
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

            <Input
              label={t("crops.name")}
              value={form.crop_name}
              onChange={handleChange("crop_name")}
              placeholder={t("crops.enter_crop_name")}
            />

            <Input
              label={t("crops.season")}
              value={form.season}
              onChange={handleChange("season")}
              placeholder={t("crops.kharif_rabi")}
            />

            <Input
              type="date"
              label={t("crops.sowing_date")}
              value={form.sowing_date}
              onChange={handleChange("sowing_date")}
            />

            <Input
              type="date"
              label={t("crops.expected_harvest")}
              value={form.expected_harvest_date}
              onChange={handleChange("expected_harvest_date")}
            />

          </div>

          <div className="form-actions">

            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              {t("crops.cancel")}
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {editingCrop
                ? t("crops.update_crop")
                : t("crops.create_crop")}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmDialog
        open={!!deleteCrop}
        title={t("crops.delete_crop")}
        message={`${t("crops.delete_confirm")} "${deleteCrop?.crop_name}"?`}
        confirmText={t("crops.delete_crop")}
        cancelText={t("crops.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteCrop(null)}
        loading={loading}
      />

    </div>
  );
}