import "./ListingForm.css";
import { useTranslation } from "react-i18next";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../Card";
import Input from "../Input";
import Select from "../Select";
import Button from "../Button";

import {
  FarmsService,
} from "../../services/farmsService";

import {
  CropsService,
} from "../../services/cropsService";

import {
  MarketplaceService,
} from "../../services/marketplaceService";

import {
  useApp,
} from "../../context/AppContext";

const UNIT_OPTIONS = [
  "kg",
  "quintal",
  "ton",
  "bag",
  "crate",
  "piece",
  "other",
];

export default function ListingForm({
  mode = "create",
}) {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const { pushToast } =
    useApp();

  const fileInputRef =
    useRef(null);

  const isEdit =
    mode === "edit";

  const [loading, setLoading] =
    useState(false);

  const [pageLoading,
    setPageLoading] =
    useState(isEdit);

  const [farms, setFarms] =
    useState([]);

  const [crops, setCrops] =
    useState([]);

  const [
    selectedFarm,
    setSelectedFarm,
  ] = useState("");

  const [
    selectedCrop,
    setSelectedCrop,
  ] = useState("");

  const [
    selectedUnit,
    setSelectedUnit,
  ] = useState("kg");

  const [
    customUnit,
    setCustomUnit,
  ] = useState("");

  const [images, setImages] =
    useState([]);

  const [
    previewImages,
    setPreviewImages,
  ] = useState([]);

  const [form, setForm] =
    useState({
      quantity: "",
      unit: "kg",
      expected_price: "",
      harvest_date: "",
      village: "",
      taluka: "",
      district: "",
      state: "",
      description: "",
    });

  /* ==========================================
      LOAD FARMS
  ========================================== */
  const { t } = useTranslation();
  useEffect(() => {

    loadFarms();

  }, []);

  async function loadFarms() {

    try {

      const response =
        await FarmsService
          .getAll();

      setFarms(
        response || []
      );

    } catch {

      pushToast(
        "Failed to load farms",
        "error"
      );
    }
  }

  /* ==========================================
      LOAD CROPS
  ========================================== */

  useEffect(() => {

    if (
      !selectedFarm
    ) return;

    loadCrops();

  }, [selectedFarm]);

  async function loadCrops() {

    try {

      const response =
        await CropsService
          .getAll({
            farm_id:
              selectedFarm,
          });

      const cropData =
        response || [];

      const filtered =
        cropData.filter(
          (crop) =>
            crop.farm_id ===
            selectedFarm
        );

      setCrops(
        filtered
      );

    } catch {

      pushToast(
        "Failed to load crops",
        "error"
      );
    }
  }

  /* ==========================================
      LOAD LISTING (EDIT MODE)
  ========================================== */

  useEffect(() => {

    if (
      isEdit &&
      id
    ) {

      loadListing();
    }

  }, [id]);

  async function loadListing() {

    try {

      setPageLoading(
        true
      );

      const response =
        await MarketplaceService
          .getListingById(
            id
          );

      const listing =
        response?.data;

      if (!listing)
        return;

      setSelectedFarm(
        listing.farm_id
      );

      setSelectedCrop(
        listing.crop_id
      );

      const defaultUnits =
        UNIT_OPTIONS.filter(
          (unit) =>
            unit !==
            "other"
        );

      if (
        defaultUnits.includes(
          listing.unit
        )
      ) {

        setSelectedUnit(
          listing.unit
        );

      } else {

        setSelectedUnit(
          "other"
        );

        setCustomUnit(
          listing.unit
        );
      }

      setForm({
        quantity:
          listing.quantity || "",

        unit:
          listing.unit || "kg",

        expected_price:
          listing.expected_price || "",

        harvest_date:
          listing.harvest_date
            ?.split("T")[0] || "",

        village:
          listing.village || "",

        taluka:
          listing.taluka || "",

        district:
          listing.district || "",

        state:
          listing.state || "",

        description:
          listing.description || "",
      });

      setPreviewImages(
        listing.crop_images || []
      );

    } catch {

      pushToast(
        "Failed to load listing",
        "error"
      );

    } finally {

      setPageLoading(
        false
      );
    }
  }

  /* ==========================================
      HANDLE CHANGE
  ========================================== */

  function handleChange(
    field,
    value
  ) {

    setForm((prev) => ({
      ...prev,
      [field]:
        value,
    }));
  }

  /* ==========================================
      UNIT CHANGE
  ========================================== */

  function handleUnitChange(
    value
  ) {

    setSelectedUnit(
      value
    );

    if (
      value !==
      "other"
    ) {

      handleChange(
        "unit",
        value
      );
    }
  }

  useEffect(() => {

    if (
      selectedUnit ===
      "other"
    ) {

      handleChange(
        "unit",
        customUnit
      );
    }

  }, [customUnit]);
    
  /* ==========================================
  HANDLE IMAGES
========================================== */

  function handleImages(
    e
  ) {

    const files =
      Array.from(
        e.target.files
      );

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

    const oversized =
      files.find(
        (file) =>
          file.size >
          5 * 1024 * 1024
      );

    if (
      oversized
    ) {

      pushToast(
        "Each image must be below 5MB",
        "error"
      );

      return;
    }

    const updatedImages = [
      ...images,
      ...files,
    ];

    const updatedPreviews = [
      ...previewImages,

      ...files.map(
        (file) =>
          URL.createObjectURL(
            file
          )
      ),
    ];

    setImages(
      updatedImages
    );

    setPreviewImages(
      updatedPreviews
    );

    e.target.value =
      "";
  }

  function removeImage(
    index
  ) {

    setImages(
      (prev) =>
        prev.filter(
          (_, i) =>
            i !== index
        )
    );

    setPreviewImages(
      (prev) =>
        prev.filter(
          (_, i) =>
            i !== index
        )
    );
  }

  /* ==========================================
      VALIDATION
  ========================================== */

  function validateForm() {

    if (
      !selectedFarm
    ) {

      pushToast(
        "Please select farm",
        "error"
      );

      return false;
    }

    if (
      !selectedCrop
    ) {

      pushToast(
        "Please select crop",
        "error"
      );

      return false;
    }

    if (
      !form.quantity
    ) {

      pushToast(
        "Please enter quantity",
        "error"
      );

      return false;
    }

    if (
      !form.expected_price
    ) {

      pushToast(
        "Please enter expected price",
        "error"
      );

      return false;
    }

    if (
      !form.harvest_date
    ) {

      pushToast(
        "Please select harvest date",
        "error"
      );

      return false;
    }

    if (
      selectedUnit ===
      "other" &&
      !customUnit.trim()
    ) {

      pushToast(
        "Please enter custom unit",
        "error"
      );

      return false;
    }

    return true;
  }

  /* ==========================================
      SUBMIT
  ========================================== */

  async function handleSubmit() {

    try {

      if (
        loading
      ) return;

      const valid =
        validateForm();

      if (
        !valid
      ) return;

      setLoading(
        true
      );

      const selectedFarmData =
        farms.find(
          (farm) =>
            farm.id ===
            selectedFarm
        );

      const selectedCropData =
        crops.find(
          (crop) =>
            crop.id ===
            selectedCrop
        );

      /* ======================================
          CREATE MODE
      ====================================== */

      if (
        !isEdit
      ) {

        const formData =
          new FormData();

        formData.append(
          "farm_id",
          selectedFarm
        );

        formData.append(
          "farm_name",
          selectedFarmData
            ?.farm_name ||
          ""
        );

        formData.append(
          "crop_id",
          selectedCrop
        );

        formData.append(
          "crop_name",
          selectedCropData
            ?.crop_name ||
          ""
        );

        formData.append(
          "quantity",
          form.quantity
        );

        formData.append(
          "unit",
          form.unit
        );

        formData.append(
          "expected_price",
          form.expected_price
        );

        formData.append(
          "harvest_date",
          form.harvest_date
        );

        formData.append(
          "village",
          form.village
        );

        formData.append(
          "taluka",
          form.taluka
        );

        formData.append(
          "district",
          form.district
        );

        formData.append(
          "state",
          form.state
        );

        formData.append(
          "description",
          form.description ||
          ""
        );

        images.forEach(
          (file) => {

            formData.append(
              "crop_images",
              file
            );
          }
        );

        await MarketplaceService
          .createListing(
            formData
          );

        pushToast(
          "Listing created successfully",
          "success"
        );

        navigate(
          "/farmer/marketplace"
        );

        return;
      }

      /* ======================================
          EDIT MODE
      ====================================== */

      const payload = {

        farm_id:
          selectedFarm,

        farm_name:
          selectedFarmData
            ?.farm_name ||
          "",

        crop_id:
          selectedCrop,

        crop_name:
          selectedCropData
            ?.crop_name ||
          "",

        quantity:
          Number(
            form.quantity
          ),

        unit:
          form.unit,

        expected_price:
          Number(
            form.expected_price
          ),

        harvest_date:
          form.harvest_date,

        village:
          form.village,

        taluka:
          form.taluka,

        district:
          form.district,

        state:
          form.state,

        description:
          form.description ||
          "",
      };

      await MarketplaceService
        .updateListing(
          id,
          payload
        );

      pushToast(
        "Listing updated successfully",
        "success"
      );

      navigate(
        "/farmer/marketplace"
      );

    } catch (
    error
    ) {

      const detail =
        error?.response
          ?.data?.detail;

      let errorMessage =
        isEdit
          ? "Failed to update listing"
          : "Failed to create listing";

      if (
        Array.isArray(
          detail
        )
      ) {

        errorMessage =
          detail
            .map(
              (err) =>
                err.msg
            )
            .join(", ");
      }

      else if (
        typeof detail ===
        "string"
      ) {

        errorMessage =
          detail;
      }

      pushToast(
        errorMessage,
        "error"
      );

    } finally {

      setLoading(
        false
      );
    }
  }
    
  /* ==========================================
  LOADING
========================================== */

  if (
    pageLoading
  ) {

    return (

      <Card className="
        listing-form-loading
      ">

        Loading listing...

      </Card>
    );
  }

  /* ==========================================
      RENDER
  ========================================== */

  //   return (

  //     <Card>

  //       <div className="
  //         listing-form
  //       ">

  //         {/* ======================================
  //             FARM
  //         ====================================== */}

  //         <Select
  //           label="Farm"
  //           value={
  //             selectedFarm
  //           }
  //           onChange={(e) =>
  //             setSelectedFarm(
  //               e.target.value
  //             )
  //           }
  //         >

  //           <option value="">
  //             Select Farm
  //           </option>

  //           {farms.map(
  //             (farm) => (

  //             <option
  //               key={farm.id}
  //               value={farm.id}
  //             >
  //               {farm.farm_name}
  //             </option>

  //           ))}

  //         </Select>

  //         {/* ======================================
  //             CROP
  //         ====================================== */}

  //         <Select
  //           label="Crop"
  //           value={
  //             selectedCrop
  //           }
  //           onChange={(e) =>
  //             setSelectedCrop(
  //               e.target.value
  //             )
  //           }
  //         >

  //           <option value="">
  //             Select Crop
  //           </option>

  //           {crops.map(
  //             (crop) => (

  //             <option
  //               key={crop.id}
  //               value={crop.id}
  //             >
  //               {crop.crop_name}
  //             </option>

  //           ))}

  //         </Select>

  //         {/* ======================================
  //             QUANTITY + UNIT
  //         ====================================== */}

  //         <div className="
  //           listing-form__row
  //         ">

  //           <Input
  //             label="Quantity"
  //             placeholder="
  //               Enter quantity
  //             "
  //             value={
  //               form.quantity
  //             }
  //             onChange={(e) =>
  //               handleChange(
  //                 "quantity",
  //                 e.target.value
  //               )
  //             }
  //           />

  //           <Select
  //             label="Unit"
  //             value={
  //               selectedUnit
  //             }
  //             onChange={(e) =>
  //               handleUnitChange(
  //                 e.target.value
  //               )
  //             }
  //           >

  //             {UNIT_OPTIONS.map(
  //               (unit) => (

  //               <option
  //                 key={unit}
  //                 value={unit}
  //               >
  //                 {unit}
  //               </option>

  //             ))}

  //           </Select>

  //         </div>

  //         {/* ======================================
  //             CUSTOM UNIT
  //         ====================================== */}

  //         {selectedUnit ===
  //           "other" && (

  //           <Input
  //             label="
  //               Custom Unit
  //             "
  //             placeholder="
  //               e.g. bundle
  //             "
  //             value={
  //               customUnit
  //             }
  //             onChange={(e) =>
  //               setCustomUnit(
  //                 e.target.value
  //               )
  //             }
  //           />
  //         )}

  //         {/* ======================================
  //             PRICE
  //         ====================================== */}

  //         <Input
  //           label="
  //             Expected Price
  //           "
  //           placeholder="
  //             e.g. 80000
  //           "
  //           value={
  //             form.expected_price
  //           }
  //           onChange={(e) =>
  //             handleChange(
  //               "expected_price",
  //               e.target.value
  //             )
  //           }
  //         />

  //         {/* ======================================
  //             DATE
  //         ====================================== */}

  //         <Input
  //           type="date"
  //           label="
  //             Harvest Date
  //           "
  //           value={
  //             form.harvest_date
  //           }
  //           onChange={(e) =>
  //             handleChange(
  //               "harvest_date",
  //               e.target.value
  //             )
  //           }
  //         />

  //         {/* ======================================
  //             LOCATION
  //         ====================================== */}

  //         <Input
  //           label="Village"
  //           placeholder="
  //             Enter village
  //           "
  //           value={
  //             form.village
  //           }
  //           onChange={(e) =>
  //             handleChange(
  //               "village",
  //               e.target.value
  //             )
  //           }
  //         />

  //         <Input
  //           label="Taluka"
  //           placeholder="
  //             Enter taluka
  //           "
  //           value={
  //             form.taluka
  //           }
  //           onChange={(e) =>
  //             handleChange(
  //               "taluka",
  //               e.target.value
  //             )
  //           }
  //         />

  //         <Input
  //           label="District"
  //           placeholder="
  //             Enter district
  //           "
  //           value={
  //             form.district
  //           }
  //           onChange={(e) =>
  //             handleChange(
  //               "district",
  //               e.target.value
  //             )
  //           }
  //         />

  //         <Input
  //           label="
  //             State + Pincode
  //           "
  //           placeholder="
  //             Maharashtra 413107
  //           "
  //           value={
  //             form.state
  //           }
  //           onChange={(e) =>
  //             handleChange(
  //               "state",
  //               e.target.value
  //             )
  //           }
  //         />

  //         {/* ======================================
  //             DESCRIPTION
  //         ====================================== */}

  //         <div className="
  //           listing-form__textarea
  //         ">

  //           <label>
  //             Description
  //             (Optional)
  //           </label>

  //           <textarea
  //             placeholder="
  //               Add crop quality,
  //               freshness,
  //               special details...
  //             "
  //             value={
  //               form.description
  //             }
  //             onChange={(e) =>
  //               handleChange(
  //                 "description",
  //                 e.target.value
  //               )
  //             }
  //           />

  //         </div>

  //         {/* ======================================
  //             IMAGE UPLOAD
  //         ====================================== */}

  //         <div className="
  //             listing-upload
  //           ">

  //             {isEdit ? (

  //               <>
  //                 {/* ==============================
  //                     READ ONLY IMAGES
  //                 ============================== */}

  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     justifyContent:
  //                       "space-between",
  //                     alignItems:
  //                       "center",
  //                     marginBottom:
  //                       "14px",
  //                   }}
  //                 >

  //                   <div>

  //                     <h4
  //                       style={{
  //                         margin:
  //                           "0 0 4px",
  //                       }}
  //                     >
  //                       Current Images
  //                     </h4>

  //                     <p
  //                       style={{
  //                         margin: 0,
  //                         fontSize:
  //                           "13px",
  //                         color:
  //                           "var(--color-text-muted)",
  //                       }}
  //                     >
  //                       Images cannot
  //                       be edited
  //                     </p>

  //                   </div>

  //                 </div>

  //                 {previewImages
  //                   .length > 0 ? (

  //                   <div className="
  //                     listing-upload__preview-grid
  //                   ">

  //                     {previewImages.map(
  //                       (
  //                         image,
  //                         index
  //                       ) => (

  //                         <div
  //                           key={index}
  //                           className="
  //                             listing-upload__preview-card
  //                           "
  //                         >

  //                           <img
  //                             src={image}
  //                             alt={`
  //                               Crop ${index + 1}
  //                             `}
  //                             className="
  //                               listing-upload__preview-image
  //                             "
  //                           />

  //                         </div>
  //                       )
  //                     )}

  //                   </div>

  //                 ) : (

  //                   <div
  //                     style={{
  //                       padding:
  //                         "18px",
  //                       border:
  //                         "1px dashed var(--color-border)",
  //                       borderRadius:
  //                         "16px",
  //                       textAlign:
  //                         "center",
  //                       color:
  //                         "var(--color-text-muted)",
  //                     }}
  //                   >
  //                     No images available
  //                   </div>

  //                 )}

  //               </>

  //             ) : (

  //               <>
  //                 {/* ==============================
  //                     CREATE MODE
  //                 ============================== */}

  //                 <div
  //                   className="
  //                     listing-upload__box
  //                   "
  //                   onClick={() =>
  //                     fileInputRef
  //                       .current
  //                       ?.click()
  //                   }
  //                 >

  //                   <div className="
  //                     listing-upload__icon
  //                   ">
  //                     +
  //                   </div>

  //                   <h4>
  //                     Upload Crop Images
  //                   </h4>

  //                   <p>
  //                     Add up to
  //                     5 images
  //                   </p>

  //                   <Button
  //                     type="
  //                       button
  //                     "
  //                     variant="
  //                       secondary
  //                     "
  //                   >
  //                     Choose Images
  //                   </Button>

  //                 </div>

  //                 <input
  //                   ref={
  //                     fileInputRef
  //                   }
  //                   type="file"
  //                   multiple
  //                   accept="
  //                     image/*
  //                   "
  //                   className="
  //                     listing-upload__input
  //                   "
  //                   onChange={
  //                     handleImages
  //                   }
  //                 />

  //                 {previewImages
  //                   .length > 0 && (

  //                   <div className="
  //                     listing-upload__preview-grid
  //                   ">

  //                     {previewImages.map(
  //                       (
  //                         image,
  //                         index
  //                       ) => (

  //                         <div
  //                           key={index}
  //                           className="
  //                             listing-upload__preview-card
  //                           "
  //                         >

  //                           <img
  //                             src={image}
  //                             alt=""
  //                             className="
  //                               listing-upload__preview-image
  //                             "
  //                           />

  //                           <button
  //                             type="button"
  //                             className="
  //                               listing-upload__remove
  //                             "
  //                             onClick={() =>
  //                               removeImage(
  //                                 index
  //                               )
  //                             }
  //                           >
  //                             ×
  //                           </button>

  //                         </div>
  //                       )
  //                     )}

  //                   </div>
  //                 )}

  //               </>
  //             )}

  //         </div>

  //         {/* ======================================
  //             SUBMIT
  //         ====================================== */}

  //         <Button
  //           onClick={
  //             handleSubmit
  //           }
  //           disabled={
  //             loading
  //           }
  //         >

  //           {loading
  //             ? (
  //               isEdit
  //                 ? "Updating..."
  //                 : "Creating..."
  //             )
  //             : (
  //               isEdit
  //                 ? "Update Listing"
  //                 : "Create Listing"
  //             )}

  //         </Button>

  //       </div>

  //     </Card>
  //   );
  // }

  return (

    <Card>

      <div className="
        listing-form
      ">

        {/* ======================================
            FARM
        ====================================== */}

        <Select
          label={t("listingForm.farm")}
          value={
            selectedFarm
          }
          onChange={(e) =>
            setSelectedFarm(
              e.target.value
            )
          }
        >

          <option value="">
            {t("listingForm.selectFarm")}
          </option>

          {farms.map(
            (farm) => (

              <option
                key={farm.id}
                value={farm.id}
              >
                {farm.farm_name}
              </option>

            ))}

        </Select>

        {/* ======================================
            CROP
        ====================================== */}

        <Select
          label={t("listingForm.crop")}
          value={
            selectedCrop
          }
          onChange={(e) =>
            setSelectedCrop(
              e.target.value
            )
          }
        >

          <option value="">
            {t("listingForm.selectCrop")}
          </option>

          {crops.map(
            (crop) => (

              <option
                key={crop.id}
                value={crop.id}
              >
                {crop.crop_name}
              </option>

            ))}

        </Select>

        {/* ======================================
            QUANTITY + UNIT
        ====================================== */}

        <div className="
          listing-form__row
        ">

          <Input
            label={t("listingForm.quantity")}
            placeholder={
              t("listingForm.enterQuantity")
            }
            value={
              form.quantity
            }
            onChange={(e) =>
              handleChange(
                "quantity",
                e.target.value
              )
            }
          />

          <Select
            label={t("listingForm.unit")}
            value={
              selectedUnit
            }
            onChange={(e) =>
              handleUnitChange(
                e.target.value
              )
            }
          >

            {UNIT_OPTIONS.map(
              (unit) => (

                <option
                  key={unit}
                  value={unit}
                >
                  {unit}
                </option>

              ))}

          </Select>

        </div>

        {selectedUnit ===
          "other" && (

            <Input
              label={
                t("listingForm.customUnit")
              }
              placeholder={
                t(
                  "listingForm.customUnitPlaceholder"
                )
              }
              value={
                customUnit
              }
              onChange={(e) =>
                setCustomUnit(
                  e.target.value
                )
              }
            />
          )}

        <Input
          label={
            t("listingForm.expectedPrice")
          }
          placeholder={
            t(
              "listingForm.expectedPricePlaceholder"
            )
          }
          value={
            form.expected_price
          }
          onChange={(e) =>
            handleChange(
              "expected_price",
              e.target.value
            )
          }
        />

        <Input
          type="date"
          label={
            t("listingForm.harvestDate")
          }
          value={
            form.harvest_date
          }
          onChange={(e) =>
            handleChange(
              "harvest_date",
              e.target.value
            )
          }
        />

        <Input
          label={t("listingForm.village")}
          placeholder={
            t("listingForm.enterVillage")
          }
          value={
            form.village
          }
          onChange={(e) =>
            handleChange(
              "village",
              e.target.value
            )
          }
        />

        <Input
          label={t("listingForm.taluka")}
          placeholder={
            t("listingForm.enterTaluka")
          }
          value={
            form.taluka
          }
          onChange={(e) =>
            handleChange(
              "taluka",
              e.target.value
            )
          }
        />

        <Input
          label={t("listingForm.district")}
          placeholder={
            t("listingForm.enterDistrict")
          }
          value={
            form.district
          }
          onChange={(e) =>
            handleChange(
              "district",
              e.target.value
            )
          }
        />

        <Input
          label={
            t("listingForm.statePincode")
          }
          placeholder={
            t(
              "listingForm.statePincodePlaceholder"
            )
          }
          value={
            form.state
          }
          onChange={(e) =>
            handleChange(
              "state",
              e.target.value
            )
          }
        />

        <div className="
          listing-form__textarea
        ">

          <label>
            {t(
              "listingForm.descriptionOptional"
            )}
          </label>

          <textarea
            placeholder={
              t(
                "listingForm.descriptionPlaceholder"
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

        <div className="
            listing-upload
          ">

          {isEdit ? (

            <>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "14px",
                }}
              >

                <div>

                  <h4
                    style={{
                      margin:
                        "0 0 4px",
                    }}
                  >
                    {t("listingForm.currentImages")}
                  </h4>

                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "13px",
                      color:
                        "var(--color-text-muted)",
                    }}
                  >
                    {t("listingForm.imagesCannotEdit")}
                  </p>

                </div>

              </div>

              {previewImages
                .length > 0 ? (

                <div className="
                    listing-upload__preview-grid
                  ">

                  {previewImages.map(
                    (
                      image,
                      index
                    ) => (

                      <div
                        key={index}
                        className="
                            listing-upload__preview-card
                          "
                      >

                        <img
                          src={image}
                          alt={`
                              ${t("listingForm.crop")} ${index + 1}
                            `}
                          className="
                              listing-upload__preview-image
                            "
                        />

                      </div>
                    )
                  )}

                </div>

              ) : (

                <div
                  style={{
                    padding:
                      "18px",
                    border:
                      "1px dashed var(--color-border)",
                    borderRadius:
                      "16px",
                    textAlign:
                      "center",
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  {t("listingForm.noImagesAvailable")}
                </div>

              )}

            </>

          ) : (

            <>
              <div
                className="
                    listing-upload__box
                  "
                onClick={() =>
                  fileInputRef
                    .current
                    ?.click()
                }
              >

                <div className="
                    listing-upload__icon
                  ">
                  +
                </div>

                <h4>
                  {t("listingForm.uploadCropImages")}
                </h4>

                <p>
                  {t("listingForm.addUpTo5Images")}
                </p>

                <Button
                  type="
                      button
                    "
                  variant="
                      secondary
                    "
                >
                  {t("listingForm.chooseImages")}
                </Button>

              </div>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                multiple
                accept="
                    image/*
                  "
                className="
                    listing-upload__input
                  "
                onChange={
                  handleImages
                }
              />

              {previewImages
                .length > 0 && (

                  <div className="
                    listing-upload__preview-grid
                  ">

                    {previewImages.map(
                      (
                        image,
                        index
                      ) => (

                        <div
                          key={index}
                          className="
                            listing-upload__preview-card
                          "
                        >

                          <img
                            src={image}
                            alt={`
                              ${t("listingForm.crop")} ${index + 1}
                            `}
                            className="
                              listing-upload__preview-image
                            "
                          />

                          <button
                            type="button"
                            className="
                              listing-upload__remove
                            "
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
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

        </div>

        <Button
          onClick={
            handleSubmit
          }
          disabled={
            loading
          }
        >

          {loading
            ? (
              isEdit
                ? t("listingForm.updating")
                : t("listingForm.creating")
            )
            : (
              isEdit
                ? t("listingForm.updateListing")
                : t("listingForm.createListing")
            )}

        </Button>

      </div>

    </Card>
  );
}