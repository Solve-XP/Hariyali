import "./Farms.css";

import { useEffect, useMemo, useState } from "react";

import imageCompression from "browser-image-compression";
import { useTranslation } from "react-i18next";

import Card from "../../components/Card";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import Input from "../../components/Input";
import Select from "../../components/Select";


import Modal from "../../components/Modal";
import SearchInput from "../../components/SearchInput";
import ImageViewer from "../../components/ImageViewer";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader from "../../components/PageHeader";

import {
  IconFarm,
  IconPlus,
  IconTrash,
  IconEdit,
  IconLocation,
  IconSoil,
  IconField,
} from "../../components/Icons";

import { FarmsService } from "../../services/farmsService";
import { UploadService } from "../../services/uploadService";

import { useApp } from "../../context/AppContext";

import { getErrorMessage } from "../../utils/errorHandler";

import { validateRequired } from "../../utils/validators";

const EMPTY_FORM = {
  farm_name: "",
  acres: "",
  location: "",
  soil_type: "",
  farm_photo: null,
};

const SOIL_TYPES = [
  "black",
  "red",
  "laterite",
  "alluvial",
  "sandy",
  "clay",
  "loamy",
  "mixed",
  "other",
];

export default function Farms() {

  const { t } = useTranslation();

  const { pushToast } = useApp();

  const [farms, setFarms] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingFarm, setEditingFarm] = useState(null);

  const [imageViewer, setImageViewer] = useState("");

  const [uploadPreview, setUploadPreview] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [selectedFarmId, setSelectedFarmId] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const loadFarms = async (searchText = "") => {

    try {

      setLoading(true);

      const response =
        await FarmsService.getAll(searchText);

      setFarms(response || []);

    } catch (error) {

      pushToast(
        getErrorMessage(error),
        "error"
      );

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
      (sum, farm) =>
        sum + Number(farm.acres || 0),
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

  // const handleImage = (e) => {

  //   const file = e.target.files[0];

  //   if (!file) return;

  //   setForm((prev) => ({
  //     ...prev,
  //     farm_photo: file,
  //   }));

  //   setUploadPreview(
  //     URL.createObjectURL(file)
  //   );
  // };
  
  const handleImage =
  async (e) => {

    try {

      const file =
        e.target
          .files?.[0];

      if (!file)
        return;

      pushToast(
        "Optimizing image...",
        "success"
      );

      /* ==========================
         IMAGE COMPRESSION
      ========================== */

      const options = {

        maxSizeMB:
          0.8,

        maxWidthOrHeight:
          1920,

        useWebWorker:
          true,

        fileType:
          "image/jpeg",

        initialQuality:
          0.8,
      };

      const compressed =
        await imageCompression(
          file,
          options
        );

      const optimizedFile =
        new File(
          [compressed],
          file.name,
          {
            type:
              "image/jpeg",
          }
        );

      setForm(
        (prev) => ({

          ...prev,

          farm_photo:
            optimizedFile,
        })
      );

      setUploadPreview(
        URL.createObjectURL(
          optimizedFile
        )
      );

      pushToast(
        "Image optimized successfully",
        "success"
      );

      e.target.value =
        "";

    } catch {

      pushToast(
        "Failed to process image",
        "error"
      );
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !validateRequired(form, [
        "farm_name",
        "acres",
        "location",
        "soil_type",
      ])
    ) {

      pushToast(
        t("messages.VALIDATION_ERROR"),
        "error"
      );

      return;
    }

    try {

      setLoading(true);

      if (editingFarm) {

        let farmPhoto =
          uploadPreview;

        if (
          form.farm_photo
        ) {

          const uploadResponse =
            await UploadService.getUploadUrls(
              "farms",
              [form.farm_photo]
            );

          const imageUrls =
            await UploadService.uploadFilesToS3(
              [form.farm_photo],
              uploadResponse.uploads
            );

          farmPhoto =
            imageUrls[0];
        }

        await FarmsService.update(
          editingFarm.id,
          {
            farm_name:
              form.farm_name,

            acres:
              Number(
                form.acres
              ),

            location:
              form.location,

            soil_type:
              form.soil_type,

            farm_photo:
              farmPhoto,
          }
        );

        pushToast(
          t("messages.FARM_UPDATED_SUCCESS")
        );

      } else {

        if (!form.farm_photo) {

          pushToast(
            t("farms.photo_required"),
            "error"
          );

          return;
        }

        const uploadResponse =
          await UploadService.getUploadUrls(
            "farms",
            [form.farm_photo]
          );

        const imageUrls =
          await UploadService.uploadFilesToS3(
            [form.farm_photo],
            uploadResponse.uploads
          );

        await FarmsService.create({
          farm_name:
            form.farm_name,

          acres:
            Number(
              form.acres
            ),

          location:
            form.location,

          soil_type:
            form.soil_type,

          farm_photo:
            imageUrls[0],
        });

        pushToast(
          t("messages.FARM_ADDED_SUCCESS")
        );
      }

      closeModal();

      loadFarms(search);

    } catch (error) {

      pushToast(
        getErrorMessage(error),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  const handleDelete = async (farmId) => {

    setSelectedFarmId(farmId);

    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {

    try {

      setDeleteLoading(true);

      await FarmsService.delete(
        selectedFarmId
      );

      pushToast(
        t("messages.FARM_DELETED_SUCCESS")
      );

      setShowDeleteDialog(false);

      setSelectedFarmId(null);

      loadFarms(search);

    } catch (error) {

      pushToast(
        getErrorMessage(error),
        "error"
      );

    } finally {

      setDeleteLoading(false);
    }
  };

  return (

    <div className="farms-page">

      <PageHeader
        title={t("farms.title")}
        subtitle={t("farms.subtitle")}
        action={
          <Button
            variant="primary"
            onClick={openAddModal}
          >
            <IconPlus />
            {t("farms.create_farm")}
          </Button>
        }
      />

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

        <SearchInput
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder={t("farms.search_placeholder")}
        />

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
                onClick={() =>
                  setImageViewer(
                    farm.farm_photo
                  )
                }
              >

                <img src={farm.farm_photo} alt={farm.farm_name} className="farm-row__image" loading="lazy" decoding="async"/>

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
                  onClick={() =>
                    openEditModal(farm)
                  }
                >
                  <IconEdit />
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    handleDelete(farm.id)
                  }
                >
                  <IconTrash />
                </Button>

              </div>

            </Card>

          ))}

        </div>

      )}

      <Modal
        open={showModal}
        title={
          editingFarm
            ? t("farms.edit_farm")
            : t("farms.create_farm")
        }
        onClose={closeModal}
      >

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <Input
              label={t("farms.name")}
              value={form.farm_name}
              onChange={updateField(
                "farm_name"
              )}
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
              onChange={updateField(
                "location"
              )}
            />

            {/* <Input
              label={t("farms.soil_type")}
              value={form.soil_type}
              onChange={updateField(
                "soil_type"
              )}
            /> */
            }

            <Select
              label={t("farms.soil_type")}
              value={form.soil_type}
              onChange={updateField(
                "soil_type"
              )}
            >

              <option value="">
                {t("farms.select_soil_type")}
              </option>

              {SOIL_TYPES.map((soil) => (

                <option
                  key={soil}
                  value={soil}
                >
                  {t(
                    `farms.soil_${soil}`
                  )}
                </option>

              ))}

            </Select>

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
              {loading
                ? t("common.loading")
                : editingFarm
                ? t("farms.update_farm")
                : t("farms.create_farm")}
            </Button>

          </div>

        </form>

      </Modal>

      <ImageViewer
        image={imageViewer}
        onClose={() =>
          setImageViewer("")
        }
      />

      <ConfirmDialog
        open={showDeleteDialog}
        title={t("farms.delete_title")}
        message={t("farms.delete_message")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={confirmDelete}
        onCancel={() => {

          setShowDeleteDialog(false);

          setSelectedFarmId(null);
        }}
        loading={deleteLoading}
      />

    </div>
  );
}