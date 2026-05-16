import "./Farms.css";

import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import Card from "../../components/Card";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import Input from "../../components/Input";

import {
  IconFarm,
  IconPlus,
  IconTrash,
  IconEdit,
  IconSearch,
  IconLocation,
  IconSoil,
  IconField,
} from "../../components/Icons";

import { FarmsService } from "../../services/farmsService";

import { useApp } from "../../context/AppContext";

import { getErrorMessage } from "../../utils/errorHandler";

const EMPTY_FORM = {
  farm_name: "",
  acres: "",
  location: "",
  soil_type: "",
  farm_photo: null,
};

export default function Farms() {
  const { t } = useTranslation();
  const { pushToast } = useApp();

  const [farms, setFarms] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingFarm, setEditingFarm] = useState(null);

  // FULL SCREEN IMAGE VIEWER
  const [imageViewer, setImageViewer] = useState("");

  // FORM IMAGE PREVIEW
  const [uploadPreview, setUploadPreview] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  const loadFarms = async (searchText = "") => {

    try {

      setLoading(true);

      const response = await FarmsService.getAll(searchText);

      setFarms(response || []);

    } catch (error) {

      pushToast(getErrorMessage(error), "error");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {

    const timeout = setTimeout(() => {
      loadFarms(search);
    }, 400);

    return () => clearTimeout(timeout);

  }, [search]);

  const stats = useMemo(() => {

    const totalFarms = farms.length;

    const totalAcres = farms.reduce(
      (sum, farm) => sum + Number(farm.acres || 0),
      0
    );

    const soilTypes = new Set(
      farms.map((farm) => farm.soil_type)
    ).size;

    const locations = new Set(
      farms.map((farm) => farm.location)
    ).size;

    return {
      totalFarms,
      totalAcres,
      soilTypes,
      locations,
    };

  }, [farms]);

  const openAddModal = () => {

    setEditingFarm(null);

    setForm(EMPTY_FORM);

    setUploadPreview("");

    setShowModal(true);
  };

  const openEditModal = (farm) => {

    setEditingFarm(farm);

    setForm({
      farm_name: farm.farm_name,
      acres: farm.acres,
      location: farm.location,
      soil_type: farm.soil_type,
      farm_photo: null,
    });

    setUploadPreview(farm.farm_photo);

    setShowModal(true);
  };

  const closeModal = () => {

    setShowModal(false);

    setEditingFarm(null);

    setForm(EMPTY_FORM);

    setUploadPreview("");
  };

  const updateField = (field) => (e) => {

    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      farm_photo: file,
    }));

    setUploadPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.farm_name ||
      !form.acres ||
      !form.location ||
      !form.soil_type
    ) {

      pushToast("Fill all required fields", "error");

      return;
    }

    try {

      setLoading(true);

      if (editingFarm) {

        await FarmsService.update(
          editingFarm.id,
          form
        );

        pushToast("Farm updated successfully");

      } else {

        if (!form.farm_photo) {

          pushToast("Farm image required", "error");

          return;
        }

        await FarmsService.create(form);

        pushToast("Farm created successfully");
      }

      closeModal();

      loadFarms(search);

    } catch (error) {

      pushToast(getErrorMessage(error), "error");

    } finally {

      setLoading(false);
    }
  };

  const handleDelete = async (farmId) => {

    const confirmDelete = window.confirm(
      "Delete this farm?"
    );

    if (!confirmDelete) return;

    try {

      await FarmsService.delete(farmId);

      pushToast("Farm deleted");

      loadFarms(search);

    } catch (error) {

      pushToast(getErrorMessage(error), "error");
    }
  };

  return (

    <div className="farms-page">

      <div className="farms-header">

        <div>

          <h1 className="farms-title">
           {t("farms.title")}
          </h1>

          <p className="farms-subtitle">
            {t("farms.subtitle")}
          </p>

        </div>

        <Button
          variant="primary"
          onClick={openAddModal}
        >
          <IconPlus />
          {t("farms.add_title")}
        </Button>

      </div>

      <div className="farms-stats">

        <Card className="stats-card">

          <div className="stats-card__icon stats-card__icon--green">
            <IconFarm size={22} />
          </div>

          <div>

            <div className="stats-card__title">
              {t("farms.stats.total_farms")}
            </div>

            <div className="stats-card__value">
              {stats.totalFarms}
            </div>

            <div className="stats-card__subtitle">
             {t("farms.stats.farms_added")}
            </div>

          </div>

        </Card>

        <Card className="stats-card">

          <div className="stats-card__icon stats-card__icon--yellow">
            <IconField size={22} />
          </div>

          <div>

            <div className="stats-card__title">
              {t("farms.stats.total_acres")}
            </div>

            <div className="stats-card__value">
              {stats.totalAcres}
            </div>

            <div className="stats-card__subtitle">
              {t("farms.stats.acres_land")}
            </div>

          </div>

        </Card>

        <Card className="stats-card">

          <div className="stats-card__icon stats-card__icon--purple">
            <IconSoil size={22} />
          </div>

          <div>

            <div className="stats-card__title">
              {t("farms.stats.soil_types")}
            </div>

            <div className="stats-card__value">
              {stats.soilTypes}
            </div>

            <div className="stats-card__subtitle">
              {t("farms.stats.different_soil_types")}
            </div>

          </div>

        </Card>

        <Card className="stats-card">

          <div className="stats-card__icon stats-card__icon--blue">
            <IconLocation size={22} />
          </div>

          <div>

            <div className="stats-card__title">
               {t("farms.stats.locations")}
            </div>

            <div className="stats-card__value">
              {stats.locations}
            </div>

            <div className="stats-card__subtitle">
              {t("farms.stats.unique_locations")}
            </div>

          </div>

        </Card>

      </div>

      <div className="farms-toolbar">

        <div className="farms-search">

          <IconSearch />

          <input
            type="text"
            placeholder={t("farms.search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {farms.length === 0 ? (

        <EmptyState
          icon={<IconFarm />}
          message={t("farms.empty")}
        />

      ) : (

        <div className="farms-list">

          {farms.map((farm) => (

            <Card
              key={farm.id}
              className="farm-row"
            >

              <div
                className="farm-row__image-wrap"
                onClick={() => setImageViewer(farm.farm_photo)}
              >

                <img
                  src={farm.farm_photo}
                  alt={farm.farm_name}
                  className="farm-row__image"
                />

                <div className="farm-row__overlay">

                  <div className="farm-row__eye">
                    👁
                  </div>

                </div>

              </div>

              <div className="farm-row__content">

                <div className="farm-row__info">

                  <div className="farm-info-item">

                    <span className="farm-info-label">
                      {t("farms.name")}
                    </span>

                    <h3 className="farm-row__title">
                      {farm.farm_name}
                    </h3>

                  </div>

                  <div className="farm-info-item">

                    <span className="farm-info-label">
                      {t("farms.location")}
                    </span>

                    <span className="farm-info-value">
                      {farm.location}
                    </span>

                  </div>

                  <div className="farm-info-item">

                    <span className="farm-info-label">
                      {t("farms.soil_type")}
                    </span>

                    <span className="farm-info-value">
                      {farm.soil_type}
                    </span>

                  </div>

                  <div className="farm-info-item">

                    <span className="farm-info-label">
                      {t("farms.acres")}
                    </span>

                    <span className="farm-info-value">
                      {farm.acres}
                    </span>

                  </div>

                </div>

              </div>

              <div className="farm-row__actions">

                <Button
                  variant="secondary"
                  onClick={() => openEditModal(farm)}
                >
                  <IconEdit />
                </Button>

                <Button
                  variant="danger"
                  onClick={() => handleDelete(farm.id)}
                >
                  <IconTrash />
                </Button>

              </div>

            </Card>

          ))}

        </div>

      )}

      {/* MODAL */}

      {showModal && (

        <div className="farm-modal-overlay">

          <div className="farm-modal">

            <div className="farm-modal__header">

              <h2>
                {editingFarm
                  ? "Edit Farm"
                  : "Add New Farm"}
              </h2>

              <button
                className="farm-modal__close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <Input
                  label={t("farms.name")}
                  value={form.farm_name}
                  onChange={updateField("farm_name")}
                />

                <Input
                  label={t("farms.acres")}
                  type="number"
                  value={form.acres}
                  onChange={updateField("acres")}
                />

                <Input
                  label={t("farms.location")}
                  value={form.location}
                  onChange={updateField("location")}
                />

                <Input
                  label={t("farms.soil_type")}
                  value={form.soil_type}
                  onChange={updateField("soil_type")}
                />

              </div>

              <div className="farm-upload">

                <label>
                  {t("farms.farm_photo")}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />

                {uploadPreview && (

                  <img
                    src={uploadPreview}
                    alt="preview"
                    className="farm-preview-upload"
                  />

                )}

              </div>

              <div className="farm-modal__actions">

                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                >
                  {t("farms.cancel")}
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {editingFarm
                    ? t("farms.update_farm")
                    : t("farms.create_farm")}
                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* FULLSCREEN IMAGE VIEWER */}

      {imageViewer && (

        <div
          className="image-preview-overlay"
          onClick={() => setImageViewer("")}
        >

          <div className="image-preview-modal">

            <img
              src={imageViewer}
              alt="Farm Preview"
              className="image-preview"
            />

          </div>

        </div>

      )}

    </div>
  );
}