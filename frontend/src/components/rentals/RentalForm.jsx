import {
  useRef,
  useState,
} from "react";

import "./RentalForm.css";

import Card from "../Card";
import Button from "../Button";
import Input from "../Input";

export default function RentalForm({
  initialValues = {},
  loading = false,
  mode = "create",
  onSubmit,
}) {

  const fileInputRef =
    useRef(null);

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

  /* ==========================================
      IMAGE CHANGE
  ========================================== */

  function handleImages(
    event
  ) {

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

      alert(
        "Maximum 5 images allowed"
      );

      return;
    }

    const invalidFile =
      files.find(
        (
          file
        ) =>
          file.size >
          5 *
          1024 *
          1024
      );

    if (
      invalidFile
    ) {

      alert(
        "Each image must be below 5MB"
      );

      return;
    }

    const previews =
      files.map(
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

            ...files,
          ],
      })
    );
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
          Equipment Info
        </h3>

        <Input
          label="
            Equipment Name
          "
          placeholder="e.g. John Deere 5055E"
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
            label="
              Hourly Price
            "
            placeholder="e.g. 500"
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
            label="
              Daily Price
            "
            type="
              number
            "
            placeholder="e.g. 2000"
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
          Location
        </h3>

        <div className="
          rental-form__row
        ">

          <Input
            label="
              Village
            "
            placeholder="e.g. Goradwadi"
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
            label="
              Taluka
            "
            placeholder="e.g. Malshiras"
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
            label="
              District
            "
            placeholder="e.g. Pune"
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
            label="
              State, Pincode
            "
            placeholder="e.g. Maharashtra, 413107"
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

      </Card>

      {/* OWNER */}

      <Card>

        <h3>
          Owner Details
        </h3>

        <div className="
          rental-form__row
        ">

          <Input
            label="
              Owner Name
            "
            placeholder="e.g. Ramesh Patil"
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
            label="
              Phone Number
            "
            placeholder="e.g. 9766860000"
            value={
              form
                .phone
            }
            onChange={(
              e
            ) =>
              handleChange(
                "phone",
                e.target
                  .value
              )
            }
          />

        </div>

      </Card>

      {/* DESCRIPTION */}

      <Card>

        <h3>
          Description
        </h3>

        <textarea
          rows={5}
          className="
            input
          "
          placeholder="
            Add equipment details
          "
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
        />

      </Card>

      {/* IMAGES */}

      <Card>

        <h3>
          Equipment Images
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
              Image editing is
              currently not supported.
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
                Upload Equipment
                Images
              </h4>

              <p>
                Add up to
                5 images
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
                Choose Images
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
          ? "Saving..."
          : mode ===
            "edit"
          ? "Update Rental"
          : "Create Rental"}

      </Button>

    </form>
  );
}