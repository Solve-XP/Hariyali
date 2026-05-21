import "./Rentals.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { useApp } from "../../context/AppContext";

import { RentalsService } from "../../services/rentalsService";

import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
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
  IconRental,
  IconFarmYear,
} from "../../components/Icons";

const EMPTY_FORM = {
  equipment_name: "",
  price_per_hour: "",
  price_per_day: "",
  location: "",
  owner_name: "",
  phone: "",
  description: "",
  equipment_photo: null,
};

export default function Rentals() {

  const { t } = useTranslation();

  const {
    user,
    pushToast,
  } = useApp();

  const [rentals, setRentals] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingRental, setEditingRental] = useState(null);

  const [deleteRental, setDeleteRental] = useState(null);

  const [selectedFY, setSelectedFY] = useState("all");

  const [activeTab, setActiveTab] = useState("marketplace");

  const [previewImage, setPreviewImage] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

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
     LOAD RENTALS
  ========================================================= */

  useEffect(() => {

    loadRentals();

  }, []);

  useEffect(() => {

    loadRentals(debouncedFilters);

  }, [debouncedFilters]);

  const loadRentals = async (
    customFilters = debouncedFilters
  ) => {

    try {

      setLoading(true);

      const response =
        await RentalsService.getAll(
          customFilters
        );

      setRentals(response ?? []);

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
     MODAL HELPERS
  ========================================================= */

  const openCreateModal = () => {

    setEditingRental(null);

    setPreviewImage("");

    setForm(EMPTY_FORM);

    setModalOpen(true);
  };

  const openEditModal = (rental) => {

    setEditingRental(rental);

    setPreviewImage(
      rental.equipment_photo || ""
    );

    setForm({
      equipment_name:
        rental.equipment_name || "",

      price_per_hour:
        rental.price_per_hour || "",

      price_per_day:
        rental.price_per_day || "",

      location:
        rental.location || "",

      owner_name:
        rental.owner_name || "",

      phone:
        rental.phone || "",

      description:
        rental.description || "",

      equipment_photo: null,
    });

    setModalOpen(true);
  };

  const closeModal = () => {

    setModalOpen(false);

    setEditingRental(null);

    setPreviewImage("");

    setForm(EMPTY_FORM);
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange =
    (field) => (e) => {

      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      equipment_photo: file,
    }));

    setPreviewImage(
      URL.createObjectURL(file)
    );
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.equipment_name ||
      !form.location ||
      !form.owner_name ||
      !form.phone
    ) {

      pushToast(
        t("messages.VALIDATION_ERROR"),
        "error"
      );

      return;
    }

    if (
      !editingRental &&
      !form.equipment_photo
    ) {

      pushToast(
        "Equipment image required",
        "error"
      );

      return;
    }

    if (
      !form.price_per_hour &&
      !form.price_per_day
    ) {

      pushToast(
        "Enter hourly or daily price",
        "error"
      );

      return;
    }

    try {

      setLoading(true);

      if (editingRental) {

        await RentalsService.update(
          editingRental.id,
          form
        );

        pushToast(
          "Rental updated successfully"
        );

      } else {

        await RentalsService.create(form);

        pushToast(
          "Rental created successfully"
        );
      }

      closeModal();

      await loadRentals();

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

    if (!deleteRental) return;

    try {

      setLoading(true);

      await RentalsService.delete(
        deleteRental.id
      );

      pushToast(
        "Rental deleted successfully"
      );

      setDeleteRental(null);

      await loadRentals();

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
     FINANCIAL YEARS
  ========================================================= */

  const financialYears = useMemo(() => (

    [
      ...new Set(
        rentals
          .map((r) => r.financial_year)
          .filter(Boolean)
      ),
    ]

  ), [rentals]);

  /* =========================================================
     FILTERED RENTALS
  ========================================================= */

  const filteredRentals = useMemo(() => {

    let data = rentals;

    /* =========================================
       MY EQUIPMENT FILTER
    ========================================= */

    if (activeTab === "my") {

      data = data.filter(
        (r) => r.user_id === user?.id
      );
    }

    /* =========================================
       FINANCIAL YEAR FILTER
    ========================================= */

    if (selectedFY !== "all") {

      data = data.filter(
        (r) =>
          r.financial_year === selectedFY
      );
    }

    return data;

  }, [
    rentals,
    selectedFY,
    activeTab,
    user,
  ]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = {

    total: filteredRentals.length,

    available: filteredRentals.filter(
      (r) => r.is_available
    ).length,

    locations: new Set(
      filteredRentals.map((r) => r.location)
    ).size,

    financialYears:
      financialYears.length,
  };

  return (

    <div className="page">

      <PageHeader
        title="Equipment Rentals"
        subtitle="Farmer-to-farmer equipment marketplace"
        action={

          activeTab === "my" && (

            <Button
              variant="primary"
              onClick={openCreateModal}
            >
              <IconPlus />
              Add Equipment
            </Button>

          )
        }
      />

      <div className="grid grid--4">

        <StatsCard
          icon={<IconFarmYear size={22} />}
          title="Financial Year"
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
                All Years
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
          icon={<IconRental size={22} />}
          title="Total Listings"
          value={stats.total}
          subtitle="Equipment listings"
          colorClass="stat-card__icon--green"
        />

        <StatsCard
          title="Available"
          value={stats.available}
          subtitle="Ready for rent"
          colorClass="stat-card__icon--accent"
        />

        <StatsCard
          title="Locations"
          value={stats.locations}
          subtitle="Marketplace areas"
          colorClass="stat-card__icon--purple"
        />
      </div>

      <Card>

        <div className="rentals-toolbar">

          <div className="rentals-tabs">

            <button
              className={
                activeTab === "marketplace"
                  ? "rentals-tab rentals-tab--active"
                  : "rentals-tab"
              }
              onClick={() =>
                setActiveTab("marketplace")
              }
            >
              Equipment Marketplace
            </button>

            <button
              className={
                activeTab === "my"
                  ? "rentals-tab rentals-tab--active"
                  : "rentals-tab"
              }
              onClick={() =>
                setActiveTab("my")
              }
            >
              My Equipment
            </button>

          </div>

          <SearchInput
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            placeholder="Search equipment..."
          />

        </div>

      </Card>

      <div className="rentals-grid">

        {loading ? (

          <Card>

            <div className="loading-state">
              Loading rentals...
            </div>

          </Card>

        ) : filteredRentals.length === 0 ? (

          <EmptyState
            message={
              activeTab === "my"
                ? "No equipment listed yet"
                : "No rentals found"
            }
          />

        ) : (

          filteredRentals.map((item) => (

            <Card
              key={item.id}
              className="rental-card"
            >

              <div className="rental-image-wrap">

                <img
                  src={item.equipment_photo}
                  alt={item.equipment_name}
                  className="rental-image"
                />

                <div
                  className={
                    item.is_available
                      ? "rental-badge"
                      : "rental-badge rental-badge--inactive"
                  }
                >
                  {item.is_available
                    ? "Available"
                    : "Unavailable"}
                </div>

              </div>

              <div className="rental-content">

                <div className="rental-top">

                  <h3>
                    {item.equipment_name}
                  </h3>

                  <span className="financial-year">
                    {item.financial_year}
                  </span>

                </div>

                <div className="rental-pricing">

                  {item.price_per_hour && (

                    <div className="price-chip">
                      ₹{item.price_per_hour}/hr
                    </div>

                  )}

                  {item.price_per_day && (

                    <div className="price-chip">
                      ₹{item.price_per_day}/day
                    </div>

                  )}

                </div>

                <div className="rental-meta">

                  <div>
                    📍 {item.location}
                  </div>

                  <div>
                    👤 {item.owner_name}
                  </div>

                  <div>
                    📞 {item.phone}
                  </div>

                </div>

                {item.description && (

                  <p className="rental-description">
                    {item.description}
                  </p>

                )}

                {activeTab === "my" && (

                  <div className="rental-actions">

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
                        setDeleteRental(item)
                      }
                    >
                      <IconTrash size={16} />
                    </button>

                  </div>

                )}

              </div>

            </Card>

          ))

        )}

      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingRental
            ? "Edit Equipment"
            : "Add Equipment"
        }
      >

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <Input
              label="Equipment Name"
              value={form.equipment_name}
              onChange={handleChange(
                "equipment_name"
              )}
            />

            <Input
              type="number"
              label="Price Per Hour"
              value={form.price_per_hour}
              onChange={handleChange(
                "price_per_hour"
              )}
            />

            <Input
              type="number"
              label="Price Per Day"
              value={form.price_per_day}
              onChange={handleChange(
                "price_per_day"
              )}
            />

            <Input
              label="Location"
              value={form.location}
              onChange={handleChange(
                "location"
              )}
            />

            <Input
              label="Owner Name"
              value={form.owner_name}
              onChange={handleChange(
                "owner_name"
              )}
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={handleChange(
                "phone"
              )}
            />

            <Input
              label="Description"
              value={form.description}
              onChange={handleChange(
                "description"
              )}
            />

            <div className="file-input-wrap">

              <label className="file-label">
                Equipment Photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

            </div>

          </div>

          {previewImage && (

            <div className="preview-wrap">

              <img
                src={previewImage}
                alt="Preview"
                className="preview-image"
              />

            </div>

          )}

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
              {editingRental
                ? "Update Equipment"
                : "Add Equipment"}
            </Button>

          </div>

        </form>

      </Modal>

      <ConfirmDialog
        open={!!deleteRental}
        title="Delete Equipment"
        message={`Delete "${deleteRental?.equipment_name}" equipment listing?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteRental(null)
        }
        loading={loading}
      />

    </div>
  );
}