import "./Crops.css";

import { useEffect, useMemo, useState } from "react";
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

  const [farms, setFarms] = useState([]);

  const [crops, setCrops] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingCrop, setEditingCrop] = useState(null);

  const [deleteCrop, setDeleteCrop] = useState(null);

  const [selectedFY, setSelectedFY] = useState("all");

  const [form, setForm] = useState(EMPTY_FORM);

  const [filters, setFilters] = useState({
    search: "",
    farm_id: "all",
    season: "all",
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

    loadInitialData();

  }, []);

  /* =========================================================
     FILTER CHANGE LOAD
  ========================================================= */

  useEffect(() => {

    if (farms.length) {

      loadCrops(debouncedFilters);

    }

  }, [debouncedFilters]);

  /* =========================================================
     LOAD CROPS
  ========================================================= */

  const loadCrops = async (customFilters = debouncedFilters) => {

    try {

      setLoading(true);

      const response = await CropsService.getAll(customFilters);

      setCrops(response ?? []);

    } catch (error) {

      pushToast(t("messages.GENERIC_ERROR"), "error");

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     LOAD INITIAL DATA
  ========================================================= */

  const loadInitialData = async () => {

    try {

      setLoading(true);

      const farmsResponse = await FarmsService.getAll();

      setFarms(farmsResponse ?? []);

      await loadCrops();

    } catch (error) {

      pushToast(t("messages.GENERIC_ERROR"), "error");

    } finally {

      setLoading(false);

    }
  };

  /* =========================================================
     FARM MAP
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
      sowing_date: crop.sowing_date?.split("T")[0] || "",
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

    if (!form.farm_id || !form.crop_name) {

      pushToast(t("messages.VALIDATION_ERROR"), "error");

      return;
    }

    try {

      setLoading(true);

      if (editingCrop) {

        await CropsService.update(editingCrop.id, form);

        pushToast(t("crops.crop_updated"));

      } else {

        await CropsService.create(form);

        pushToast(t("crops.crop_added"));
      }

      closeModal();

      await loadCrops(debouncedFilters);

    } catch (error) {

      pushToast(t("messages.GENERIC_ERROR"), "error");

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {

    if (!deleteCrop) return;

    try {

      setLoading(true);

      await CropsService.delete(deleteCrop.id);

      pushToast(t("crops.crop_deleted"));

      setDeleteCrop(null);

      await loadCrops(debouncedFilters);

    } catch (error) {

      pushToast(t("messages.GENERIC_ERROR"), "error");

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
     MEMOIZED DATA
  ========================================================= */

  const seasons = useMemo(() => (
    [...new Set(crops.map(c => c.season).filter(Boolean))]
  ), [crops]);

  const financialYears = useMemo(() => (
    [...new Set(crops.map(c => c.financial_year).filter(Boolean))]
  ), [crops]);

  /* =========================================================
     FILTERED STATS DATA
  ========================================================= */

  const statsData = useMemo(() => {

    if (selectedFY === "all") {

      return crops;

    }

    return crops.filter(
      (crop) => crop.financial_year === selectedFY
    );

  }, [crops, selectedFY]);

  /* =========================================================
     FILTERED TABLE DATA
  ========================================================= */

  const filteredCrops = useMemo(() => {

    if (selectedFY === "all") {

      return crops;

    }

    return crops.filter(
      (crop) => crop.financial_year === selectedFY
    );

  }, [crops, selectedFY]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = {

    total: statsData.length,

    farms: new Set(
      statsData.map((c) => c.farm_id)
    ).size,

    seasons: new Set(
      statsData.map((c) => c.season).filter(Boolean)
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
          <strong>{row.crop_name}</strong>
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
      key: "sowing_date",
      header: t("crops.sowing_date"),
      render: (row) => (
        <span className="date-cell">
          {row.sowing_date?.split("T")[0] || "—"}
        </span>
      ),
    },

    {
      key: "harvest",
      header: t("crops.harvest_date"),
      render: (row) => (
        <span className="date-cell">
          {row.expected_harvest_date?.split("T")[0] || "—"}
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
            onClick={() => openEditModal(row)}
          >
            <IconEdit size={16} />
          </button>

          <button
            className="icon-btn icon-btn--danger"
            onClick={() => setDeleteCrop(row)}
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
              value={selectedFY}
              onChange={(e) =>
                setSelectedFY(e.target.value)
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
            selectedFY === "all"
              ? t("crops.all_financial_years")
              : selectedFY
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

        ) : filteredCrops.length === 0 ? (

          <EmptyState
            icon={<IconCrop />}
            message={t("crops.no_crops_found")}
          />

        ) : (

          <>

            <div className="crops-desktop-table">

              <Table
                columns={columns}
                rows={filteredCrops}
                rowKey={(row) => row.id}
                emptyMessage={t("crops.no_crops_found")}
              />

            </div>

            <div className="crops-mobile-list">

              {filteredCrops.map((crop) => (

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