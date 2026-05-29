import {
  useRef,
  useState,
  useEffect
} from "react";

import { useTranslation } from "react-i18next";

import "./RentalForm.css";

import Card from "../Card";
import Button from "../Button";
import Input from "../Input";

import imageCompression
from "browser-image-compression";

import {
  useApp
} from "../../context/AppContext";

import MapPickerModal
from "../MapPickerModal";

import {
  getCurrentLocation,
} from "../../utils/location";

import {
  reverseGeocode,
} from "../../utils/geocoding";

export default function RentalForm({
  initialValues = {},
  loading = false,
  mode = "create",
  onSubmit,
}) {

  const fileInputRef =
    useRef(null);

  const {
    t
  } = useTranslation();

  const {
    pushToast
  } = useApp();


  

  /* ==========================================
      FORM
  ========================================== */

  const [form,
    setForm] =
    useState({

      equipment_name:
        initialValues
          ?.equipment_name ||
        "",

      price_per_hour:
        initialValues
          ?.price_per_hour ||
        "",

      price_per_day:
        initialValues
          ?.price_per_day ||
        "",

      village:
        initialValues
          ?.village ||
        "",

      taluka:
        initialValues
          ?.taluka ||
        "",

      district:
        initialValues
          ?.district ||
        "",

      state:
        initialValues
          ?.state ||
        "",
      latitude:
        initialValues
          ?.latitude ??
        null,

      longitude:
        initialValues
          ?.longitude ??
        null,

      owner_name:
        initialValues
          ?.owner_name ||
        "",

      phone:
        initialValues
          ?.phone ||
        "",

      description:
        initialValues
          ?.description ||
        
        "",

      equipment_images:
        [],
    });

  const [previewImages,
    setPreviewImages] =
    useState(
      initialValues
        ?.equipment_images ||
      []
    );
  
  const [
    showLocationModal,
    setShowLocationModal
  ] = useState(false);

  const [
    latitude,
    setLatitude
  ] = useState(
    initialValues?.latitude ?? null
  );

  const [
    longitude,
    setLongitude
  ] = useState(
    initialValues?.longitude ?? null
  );

  useEffect(() => {

      if (mode === "edit")
        return;

      async function loadLocation() {

        try {

          const location =
            await getCurrentLocation();

          setLatitude(
            location.latitude
          );

          setLongitude(
            location.longitude
          );

          const address =
            await reverseGeocode(
              location.latitude,
              location.longitude
            );

          setForm(prev => ({

            ...prev,

            latitude:
              location.latitude,

            longitude:
              location.longitude,

            village:
              address.village || "",

            taluka:
              address.taluka || "",

            district:
              address.district || "",

            state:
              `${address.state || ""} ${address.pincode || ""}`.trim(),
          }));

        } catch {

          console.log(
            "Location permission denied"
          );
        }
      }

      loadLocation();

    }, []);

  /* ==========================================
      INPUT CHANGE
  ========================================== */

  function handleChange(
    field,
    value
  ) {

    setForm(
      (prev) => ({
        ...prev,
        [field]:
          value,
      })
    );
  }


  async function handleImages(
  event
) {

  try {

    const files =
      Array.from(
        event.target
          .files || []
      );

    if (!files.length)
      return;

    const totalImages =
      previewImages.length +
      files.length;

    if (
      totalImages > 5
    ) {

      pushToast(
        "Maximum 5 images allowed",
        "error"
      );

      return;
    }

    pushToast(
      "Optimizing images...",
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

    const compressedFiles =
      await Promise.all(

        files.map(
          async (
            file
          ) => {

            const compressed =
              await imageCompression(
                file,
                options
              );

            return new File(
              [compressed],
              file.name,
              {
                type:
                  "image/jpeg",
              }
            );
          }
        )
      );

    const previews =
      compressedFiles.map(
        (
          file
        ) =>
          URL.createObjectURL(
            file
          )
      );

    setPreviewImages(
      (prev) => [
        ...prev,
        ...previews,
      ]
    );

    setForm(
      (prev) => ({

        ...prev,

        equipment_images:
          [
            ...prev
              .equipment_images,

            ...compressedFiles,
          ],
      })
    );

    pushToast(
      "Images optimized successfully",
      "success"
    );

    event.target.value =
      "";

  } catch {

    pushToast(
      "Failed to process images",
      "error"
    );
  }
}
  /* ==========================================
      REMOVE IMAGE
  ========================================== */

  function removeImage(
    index
  ) {

    setPreviewImages(
      (prev) =>
        prev.filter(
          (_, i) =>
            i !==
            index
        )
    );

    setForm(
      (prev) => ({

        ...prev,

        equipment_images:
          prev
            .equipment_images
            .filter(
              (
                _,
                i
              ) =>
                i !==
                index
            ),
      })
    );
  }

  /* ==========================================
      SUBMIT
  ========================================== */

  function handleSubmit(
    event
  ) {

    event.preventDefault();

    const isValidPhone =
      /^[6-9]\d{9}$/.test(
        form.phone
      );

    if (
      !isValidPhone
    ) {

      pushToast(
      "Please enter valid 10-digit mobile number",
      "error"
      );

      return;
    }

    onSubmit?.(
      form
    );
  }

  return (

    <form
      className="
        rental-form
      "
      onSubmit={
        handleSubmit
      }
    >

      {/* EQUIPMENT */}

      <Card>

        <h3>
          {t("rentalForm.equipmentInfo")}
        </h3>

        <Input
          label={
            t(
              "rentalForm.equipmentName"
            )
          }
          placeholder={
            t(
              "rentalForm.equipmentPlaceholder"
            )
          }
          value={
            form
              .equipment_name
          }
          onChange={(
            e
          ) =>
            handleChange(
              "equipment_name",
              e.target
                .value
            )
          }
          required
        />

        <div className="
          rental-form__row
        ">

          <Input
            label={
              t(
                "rentalForm.hourlyPrice"
              )
            }
            optional
            placeholder={
              t(
                "rentalForm.hourlyPricePlaceholder"
              )
            }
            type="
              number
            "
            value={
              form
                .price_per_hour
            }
            onChange={(
              e
            ) =>
              handleChange(
                "price_per_hour",
                e.target
                  .value
              )
            }
          />

          <Input
            label={
              t(
                "rentalForm.dailyPrice"
              )
            }
            optional
            type="
              number
            "
            placeholder={
              t(
                "rentalForm.dailyPricePlaceholder"
              )
            }
            value={
              form
                .price_per_day
            }
            onChange={(
              e
            ) =>
              handleChange(
                "price_per_day",
                e.target
                  .value
              )
            }
          />

        </div>

      </Card>

      {/* LOCATION */}

      <Card>

        <h3>
          {t("listingDetails.location")}
        </h3>

        <div className="
          rental-form__row
        ">

          <Input
            label={
              t(
                "listingDetails.village"
              )
            }
            placeholder={
              t(
                "rentalForm.villagePlaceholder"
              )
            }
            value={
              form
                .village
            }
            onChange={(
              e
            ) =>
              handleChange(
                "village",
                e.target
                  .value
              )
            }
          />

          <Input
            label={
              t(
                "listingDetails.taluka"
              )
            }
            placeholder={
              t(
                "rentalForm.talukaPlaceholder"
              )
            }
            value={
              form
                .taluka
            }
            onChange={(
              e
            ) =>
              handleChange(
                "taluka",
                e.target
                  .value
              )
            }
          />

        </div>

        <div className="
          rental-form__row
        ">

          <Input
            label={
              t(
                "listingDetails.district"
              )
            }
            placeholder={
              t(
                "rentalForm.districtPlaceholder"
              )
            }
            value={
              form
                .district
            }
            onChange={(
              e
            ) =>
              handleChange(
                "district",
                e.target
                  .value
              )
            }
          />

          <Input
            label={
              t(
                "rentalForm.statePincode"
              )
            }
            placeholder={
              t(
                "rentalForm.statePincodePlaceholder"
              )
            }
            value={
              form
                .state
            }
            onChange={(
              e
            ) =>
              handleChange(
                "state",
                e.target
                  .value
              )
            }
          />

        </div>

        {/* <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setShowLocationModal(
                true
              )
            }
          >
            📍 Select Location
          </Button> */}
        <Card>

          <p
            style={{
              marginBottom: "12px",
            }}
          >
             {t(
                "location.notAtThisLocation"
              )}
          </p>

          <Button
            type="button"
            variant="primary"
            onClick={() =>
              setShowLocationModal(
                true
              )
            }
          >
            {t("location.selectLocationOnMap")}
          </Button>

        </Card>
      </Card>

      {/* OWNER */}

      <Card>

        <h3>
          {t("rentalForm.ownerDetails")}
        </h3>

        <div className="
          rental-form__row
        ">

          <Input
            label={
              t(
                "rentalForm.ownerName"
              )
            }
            placeholder={
              t(
                "rentalForm.ownerPlaceholder"
              )
            }
            value={
              form
                .owner_name
            }
            onChange={(
              e
            ) =>
              handleChange(
                "owner_name",
                e.target
                  .value
              )
            }
          />

          <Input
            label={
              t(
                "rentalForm.phoneNumber"
              )
            }
            placeholder={
              t(
                "rentalForm.phonePlaceholder"
              )
            }
            value={
              form.phone
            }
            onChange={(e) => {

              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              if (
                value.length <= 10
              ) {

                handleChange(
                  "phone",
                  value
                );
              }
            }}
          />

        </div>

      </Card>

      {/* DESCRIPTION */}

      <Card>

        {/* <textarea
          rows={5}
          className="
            input
          "
          placeholder={
            t(
              "rentalForm.descriptionPlaceholder"
            )
          }
          value={
            form
              .description
          }
          onChange={(
            e
          ) =>
            handleChange(
              "description",
              e.target
                .value
            )
          }
        /> */}

        <div className="field">
          <h3>
          {t(
            "listingDetails.description"
            )}
            <label className="field__label">

            <span className="field__optional">
              {" "}
              ({t("common.optional")})
            </span>

          </label>
        </h3>
          <textarea
            rows={5}
            className="input"
            placeholder={
              t(
                "rentalForm.descriptionPlaceholder"
              )
            }
            value={
              form.description
            }
            onChange={(e) =>
              handleChange(
                "description",
                e.target.value
              )
            }
          />

        </div>

      </Card>

      {/* IMAGES */}

      <Card>

        <h3>
          {t(
            "rentalForm.equipmentImages"
          )}
        </h3>

        {mode ===
          "edit" ? (

          <>

            {!!previewImages.length && (

              <div className="
                rental-preview-grid
              ">

                {previewImages.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        rental-preview-card
                      "
                    >

                      <img
                        src={image}
                        alt=""
                      />

                    </div>
                  )
                )}

              </div>
            )}

            <div className="
              rental-image-note
            ">
              {t(
                "rentalForm.imageEditNotSupported"
              )}
            </div>

          </>

        ) : (

          <>

            <div
              className="
                rental-upload-box
              "
              onClick={() =>
                fileInputRef
                  .current
                  ?.click()
              }
            >

              <div className="
                rental-upload-icon
              ">
                +
              </div>

              <h4>
                {t(
                  "rentalForm.uploadEquipmentImages"
                )}
              </h4>

              <p>
                {t(
                  "rentalForm.addUpTo5Images"
                )}
              </p>

              <button
                type="button"
                className="
                  rental-upload-btn
                "
                onClick={(
                  e
                ) => {

                  e.stopPropagation();

                  fileInputRef
                    .current
                    ?.click();
                }}
              >
                {t(
                  "rentalForm.chooseImages"
                )}
              </button>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                hidden
                multiple
                accept="
                  image/*
                "
                onChange={
                  handleImages
                }
              />

            </div>

            {!!previewImages.length && (

              <div className="
                rental-preview-grid
              ">

                {previewImages.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        rental-preview-card
                      "
                    >

                      <img
                        src={image}
                        alt=""
                      />

                      <button
                        type="button"
                        onClick={(
                          e
                        ) => {

                          e.stopPropagation();

                          removeImage(
                            index
                          );
                        }}
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </>
        )}

      </Card>

      <Button
        type="submit"
        disabled={
          loading
        }
      >

        {loading
          ? t(
            "rentalForm.saving"
          )
          : mode ===
            "edit"
            ? t(
              "rentalForm.updateRental"
            )
            : t(
              "rentalForm.createRental"
            )}

      </Button>
      <MapPickerModal
        open={showLocationModal}
        onClose={() =>
          setShowLocationModal(false)
        }
        latitude={latitude}
        longitude={longitude}
        onConfirm={(location) => {

          setLatitude(
            location.latitude
          );

          setLongitude(
            location.longitude
          );

          setForm(prev => ({

            ...prev,

            latitude:
              location.latitude,

            longitude:
              location.longitude,

            village:
              location.village || "",

            taluka:
              location.taluka || "",

            district:
              location.district || "",

            state:
              `${location.state || ""} ${location.pincode || ""}`.trim(),
          }));
        }}
      />

    </form>
  );
}