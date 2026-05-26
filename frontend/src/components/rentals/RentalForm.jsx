// import {
//   useRef,
//   useState,
// } from "react";
// import { useTranslation } from "react-i18next";
// import "./RentalForm.css";

// import Card from "../Card";
// import Button from "../Button";
// import Input from "../Input";

// export default function RentalForm({
//   initialValues = {},
//   loading = false,
//   mode = "create",
//   onSubmit,
// }) {

//   const fileInputRef =
//     useRef(null);

//   /* ==========================================
//       FORM
//   ========================================== */

//   const [form,
//     setForm] =
//     useState({

//       equipment_name:
//         initialValues
//           ?.equipment_name ||
//         "",

//       price_per_hour:
//         initialValues
//           ?.price_per_hour ||
//         "",

//       price_per_day:
//         initialValues
//           ?.price_per_day ||
//         "",

//       village:
//         initialValues
//           ?.village ||
//         "",

//       taluka:
//         initialValues
//           ?.taluka ||
//         "",

//       district:
//         initialValues
//           ?.district ||
//         "",

//       state:
//         initialValues
//           ?.state ||
//         "",

//       owner_name:
//         initialValues
//           ?.owner_name ||
//         "",

//       phone:
//         initialValues
//           ?.phone ||
//         "",

//       description:
//         initialValues
//           ?.description ||
//         "",

//       equipment_images:
//         [],
//     });

//   const [previewImages,
//     setPreviewImages] =
//     useState(
//       initialValues
//         ?.equipment_images ||
//       []
//     );
  
  
  
//   const { t } =
//   useTranslation();

//   /* ==========================================
//       INPUT CHANGE
//   ========================================== */

//   function handleChange(
//     field,
//     value
//   ) {

//     setForm(
//       (prev) => ({
//         ...prev,
//         [field]:
//           value,
//       })
//     );
//   }

//   /* ==========================================
//       IMAGE CHANGE
//   ========================================== */

//   function handleImages(
//     event
//   ) {

//     const files =
//       Array.from(
//         event.target
//           .files || []
//       );

//     if (!files.length)
//       return;

//     const totalImages =
//       previewImages.length +
//       files.length;

//     if (
//       totalImages > 5
//     ) {

//       alert(
//         "Maximum 5 images allowed"
//       );

//       return;
//     }

//     const invalidFile =
//       files.find(
//         (
//           file
//         ) =>
//           file.size >
//           5 *
//           1024 *
//           1024
//       );

//     if (
//       invalidFile
//     ) {

//       alert(
//         "Each image must be below 5MB"
//       );

//       return;
//     }

//     const previews =
//       files.map(
//         (
//           file
//         ) =>
//           URL.createObjectURL(
//             file
//           )
//       );

//     setPreviewImages(
//       (prev) => [
//         ...prev,
//         ...previews,
//       ]
//     );

//     setForm(
//       (prev) => ({

//         ...prev,

//         equipment_images:
//           [
//             ...prev
//               .equipment_images,

//             ...files,
//           ],
//       })
//     );
//   }

//   /* ==========================================
//       REMOVE IMAGE
//   ========================================== */

//   function removeImage(
//     index
//   ) {

//     setPreviewImages(
//       (prev) =>
//         prev.filter(
//           (_, i) =>
//             i !==
//             index
//         )
//     );

//     setForm(
//       (prev) => ({

//         ...prev,

//         equipment_images:
//           prev
//             .equipment_images
//             .filter(
//               (
//                 _,
//                 i
//               ) =>
//                 i !==
//                 index
//             ),
//       })
//     );
//   }

//   /* ==========================================
//       SUBMIT
//   ========================================== */

//   function handleSubmit(
//     event
//   ) {

//     event.preventDefault();

//     onSubmit?.(
//       form
//     );
//   }

//   return (

//     <form
//       className="
//         rental-form
//       "
//       onSubmit={
//         handleSubmit
//       }
//     >

//       {/* EQUIPMENT */}

//       <Card>

//         <h3>
//           {t("rentalForm.equipmentInfo")}
//         </h3>

//         <Input
//           label={
//             t(
//               "rentalForm.equipmentName"
//             )
//           }
//           placeholder={
//             t(
//               "rentalForm.equipmentPlaceholder"
//             )
//           }
//           value={
//             form
//               .equipment_name
//           }
//           onChange={(
//             e
//           ) =>
//             handleChange(
//               "equipment_name",
//               e.target
//                 .value
//             )
//           }
//           required
//         />

//         <div className="
//           rental-form__row
//         ">

//           <Input
//             label={
//               t(
//                 "rentalForm.hourlyPrice"
//               )
//             }
//             placeholder={
//               t(
//                 "rentalForm.hourlyPricePlaceholder"
//               )
//             }
//             type="
//               number
//             "
//             value={
//               form
//                 .price_per_hour
//             }
//             onChange={(
//               e
//             ) =>
//               handleChange(
//                 "price_per_hour",
//                 e.target
//                   .value
//               )
//             }
//           />

//           <Input
//             label={
//               t(
//                 "rentalForm.dailyPrice"
//               )
//             }
//             type="
//               number
//             "
//             placeholder={
//               t(
//                 "rentalForm.dailyPricePlaceholder"
//               )
//             }
//             value={
//               form
//                 .price_per_day
//             }
//             onChange={(
//               e
//             ) =>
//               handleChange(
//                 "price_per_day",
//                 e.target
//                   .value
//               )
//             }
//           />

//         </div>

//       </Card>

//       {/* LOCATION */}

//       <Card>

//         <h3>
//           {t("listingDetails.location")}
//         </h3>

//         <div className="
//           rental-form__row
//         ">

//           <Input
//             label={
//               t(
//                 "listingDetails.village"
//               )
//             }
//             placeholder={
//               t(
//                 "rentalForm.villagePlaceholder"
//               )
//             }
//             value={
//               form
//                 .village
//             }
//             onChange={(
//               e
//             ) =>
//               handleChange(
//                 "village",
//                 e.target
//                   .value
//               )
//             }
//           />

//           <Input
//             label={
//               t(
//                 "listingDetails.taluka"
//               )
//             }
//             placeholder={
//               t(
//                 "rentalForm.talukaPlaceholder"
//               )
//             }
//             value={
//               form
//                 .taluka
//             }
//             onChange={(
//               e
//             ) =>
//               handleChange(
//                 "taluka",
//                 e.target
//                   .value
//               )
//             }
//           />

//         </div>

//         <div className="
//           rental-form__row
//         ">

//           <Input
//             label={
//               t(
//                 "listingDetails.district"
//               )
//             }
//             placeholder={
//               t(
//                 "rentalForm.districtPlaceholder"
//               )
//             }
//             value={
//               form
//                 .district
//             }
//             onChange={(
//               e
//             ) =>
//               handleChange(
//                 "district",
//                 e.target
//                   .value
//               )
//             }
//           />

//           <Input
//             label={
//               t(
//                 "rentalForm.statePincode"
//               )
//             }
//             placeholder={
//               t(
//                 "rentalForm.statePincodePlaceholder"
//               )
//             }
//             value={
//               form
//                 .state
//             }
//             onChange={(
//               e
//             ) =>
//               handleChange(
//                 "state",
//                 e.target
//                   .value
//               )
//             }
//           />

//         </div>

//       </Card>

//       {/* OWNER */}

//       <Card>

//         <h3>
//           {t("rentalForm.ownerDetails")}
//         </h3>

//         <div className="
//           rental-form__row
//         ">

//           <Input
//             label={
//               t(
//                 "rentalForm.ownerName"
//               )
//             }
//             placeholder={
//               t(
//                 "rentalForm.ownerPlaceholder"
//               )
//             }
//             value={
//               form
//                 .owner_name
//             }
//             onChange={(
//               e
//             ) =>
//               handleChange(
//                 "owner_name",
//                 e.target
//                   .value
//               )
//             }
//           />

//           <Input
//             label={
//               t(
//                 "rentalForm.phoneNumber"
//               )
//             }
//             placeholder={
//               t(
//                 "rentalForm.phonePlaceholder"
//               )
//             }
//             value={
//               form
//                 .phone
//             }
//             onChange={(
//               e
//             ) =>
//               handleChange(
//                 "phone",
//                 e.target
//                   .value
//               )
//             }
//           />

//         </div>

//       </Card>

//       {/* DESCRIPTION */}

//       <Card>

//         <h3>
//           {t(
//             "listingDetails.description"
//           )}
//         </h3>

//         <textarea
//           rows={5}
//           className="
//             input
//           "
//           placeholder={
//             t(
//               "rentalForm.descriptionPlaceholder"
//             )
//           }
//           value={
//             form
//               .description
//           }
//           onChange={(
//             e
//           ) =>
//             handleChange(
//               "description",
//               e.target
//                 .value
//             )
//           }
//         />

//       </Card>

//       {/* IMAGES */}

//       <Card>

//         <h3>
//           {t(
//             "rentalForm.equipmentImages"
//           )}
//         </h3>

//         {mode ===
//           "edit" ? (

//           <>

//             {!!previewImages.length && (

//               <div className="
//                 rental-preview-grid
//               ">

//                 {previewImages.map(
//                   (
//                     image,
//                     index
//                   ) => (

//                     <div
//                       key={index}
//                       className="
//                         rental-preview-card
//                       "
//                     >

//                       <img
//                         src={image}
//                         alt=""
//                       />

//                     </div>
//                   )
//                 )}

//               </div>
//             )}

//             <div className="
//               rental-image-note
//             ">
//               {t(
//                 "rentalForm.imageEditNotSupported"
//               )}
//             </div>

//           </>

//         ) : (

//           <>

//             <div
//               className="
//                 rental-upload-box
//               "
//               onClick={() =>
//                 fileInputRef
//                   .current
//                   ?.click()
//               }
//             >

//               <div className="
//                 rental-upload-icon
//               ">
//                 +
//               </div>

//               <h4>
//                 {t(
//                   "rentalForm.uploadEquipmentImages"
//                 )}
//               </h4>

//               <p>
//                 {t(
//                   "rentalForm.addUpTo5Images"
//                 )}
//               </p>

//               <button
//                 type="button"
//                 className="
//                   rental-upload-btn
//                 "
//                 onClick={(
//                   e
//                 ) => {

//                   e.stopPropagation();

//                   fileInputRef
//                     .current
//                     ?.click();
//                 }}
//               >
//                 {t(
//                   "rentalForm.chooseImages"
//                 )}
//               </button>

//               <input
//                 ref={
//                   fileInputRef
//                 }
//                 type="file"
//                 hidden
//                 multiple
//                 accept="
//                   image/*
//                 "
//                 onChange={
//                   handleImages
//                 }
//               />

//             </div>

//             {!!previewImages.length && (

//               <div className="
//                 rental-preview-grid
//               ">

//                 {previewImages.map(
//                   (
//                     image,
//                     index
//                   ) => (

//                     <div
//                       key={index}
//                       className="
//                         rental-preview-card
//                       "
//                     >

//                       <img
//                         src={image}
//                         alt=""
//                       />

//                       <button
//                         type="button"
//                         onClick={(
//                           e
//                         ) => {

//                           e.stopPropagation();

//                           removeImage(
//                             index
//                           );
//                         }}
//                       >
//                         ×
//                       </button>

//                     </div>
//                   )
//                 )}

//               </div>
//             )}

//           </>
//         )}

//       </Card>

//       <Button
//         type="submit"
//         disabled={
//           loading
//         }
//       >

//         {loading
//           ? t(
//             "rentalForm.saving"
//           )
//           : mode ===
//             "edit"
//             ? t(
//               "rentalForm.updateRental"
//             )
//             : t(
//               "rentalForm.createRental"
//             )}

//       </Button>

//     </form>
//   );
// }

import {
  useRef,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import "./RentalForm.css";

import Card from "../Card";
import Button from "../Button";
import Input from "../Input";

import {
  useApp
} from "../../context/AppContext";

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

      pushToast({
        message:
          "Maximum 5 images allowed",
        variant:
          "error",
      });

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

      pushToast({
        message:
          "Each image must be below 5MB",
        variant:
          "error",
      });

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

        <h3>
          {t(
            "listingDetails.description"
          )}
        </h3>

        <textarea
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
        />

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

    </form>
  );
}