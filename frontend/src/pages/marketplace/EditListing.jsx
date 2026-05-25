// // src/pages/marketplace/EditListing.jsx

// import "./Marketplace.css";
// import "./CreateListing.css";

// import {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import PageHeader
// from "../../components/PageHeader";

// import Card
// from "../../components/Card";

// import Input
// from "../../components/Input";

// import Select
// from "../../components/Select";

// import Button
// from "../../components/Button";

// import {
//   FarmsService,
// } from "../../services/farmsService";

// import {
//   CropsService,
// } from "../../services/cropsService";

// import {
//   MarketplaceService,
// } from "../../services/marketplaceService";

// import {
//   useApp,
// } from "../../context/AppContext";

// const UNIT_OPTIONS = [
//   "kg",
//   "quintal",
//   "ton",
//   "bag",
//   "crate",
//   "piece",
//   "other",
// ];

// export default function EditListing() {

//   const navigate =
//     useNavigate();

//   const { id } =
//     useParams();

//   const { pushToast } =
//     useApp();

//   const fileInputRef =
//     useRef(null);

//   const [loading, setLoading] =
//     useState(false);

//   const [pageLoading, setPageLoading] =
//     useState(true);

//   const [farms, setFarms] =
//     useState([]);

//   const [crops, setCrops] =
//     useState([]);

//   const [
//     selectedFarm,
//     setSelectedFarm,
//   ] = useState("");

//   const [
//     selectedCrop,
//     setSelectedCrop,
//   ] = useState("");

//   const [
//     selectedUnit,
//     setSelectedUnit,
//   ] = useState("kg");

//   const [
//     customUnit,
//     setCustomUnit,
//   ] = useState("");

//   const [images, setImages] =
//     useState([]);

//   const [
//     previewImages,
//     setPreviewImages,
//   ] = useState([]);

//   const [form, setForm] =
//     useState({
//       quantity: "",
//       unit: "kg",
//       expected_price: "",
//       harvest_date: "",
//       village: "",
//       taluka: "",
//       district: "",
//       state: "",
//       description: "",
//     });

//   /* =====================================
//      LOAD INITIAL DATA
//   ===================================== */

//   useEffect(() => {

//     loadFarms();

//     if (id) {
//       loadListing();
//     }

//   }, [id]);

//   /* =====================================
//      LOAD CROPS
//   ===================================== */

//   useEffect(() => {

//     if (!selectedFarm)
//       return;

//     loadCrops();

//   }, [selectedFarm]);

//   /* =====================================
//      LOAD FARMS
//   ===================================== */

//   const loadFarms =
//     async () => {

//       try {

//         const response =
//           await FarmsService
//             .getAll();

//         setFarms(
//           response || []
//         );

//       } catch {

//         pushToast(
//           "Failed to load farms",
//           "error"
//         );
//       }
//     };

//   /* =====================================
//      LOAD CROPS
//   ===================================== */

//   const loadCrops =
//     async () => {

//       try {

//         const response =
//           await CropsService
//             .getAll({
//               farm_id:
//                 selectedFarm,
//             });

//         setCrops(
//           response || []
//         );

//       } catch {

//         pushToast(
//           "Failed to load crops",
//           "error"
//         );
//       }
//     };

//   /* =====================================
//      LOAD LISTING
//   ===================================== */

//   const loadListing =
//     async () => {

//       try {

//         setPageLoading(
//           true
//         );

//         console.log(
//           "EDIT ID",
//           id
//         );

//         const response =
//           await MarketplaceService
//             .getListingById(
//               id
//             );

//         const listing =
//           response.data;

//         setSelectedFarm(
//           listing.farm_id
//         );

//         setSelectedCrop(
//           listing.crop_id
//         );

//         const defaultUnits =
//           UNIT_OPTIONS.filter(
//             (u) =>
//               u !== "other"
//           );

//         if (
//           defaultUnits.includes(
//             listing.unit
//           )
//         ) {

//           setSelectedUnit(
//             listing.unit
//           );

//         } else {

//           setSelectedUnit(
//             "other"
//           );

//           setCustomUnit(
//             listing.unit
//           );
//         }

//         setForm({

//           quantity:
//             listing.quantity || "",

//           unit:
//             listing.unit || "kg",

//           expected_price:
//             listing.expected_price || "",

//           harvest_date:
//             listing.harvest_date
//               ?.split("T")[0] || "",

//           village:
//             listing.village || "",

//           taluka:
//             listing.taluka || "",

//           district:
//             listing.district || "",

//           state:
//             listing.state || "",

//           description:
//             listing.description || "",
//         });

//         setPreviewImages(
//           listing.crop_images || []
//         );

//       } catch (error) {

//         console.error(
//           error
//         );

//         pushToast(
//           "Failed to load listing",
//           "error"
//         );

//       } finally {

//         setPageLoading(
//           false
//         );
//       }
//     };

//   /* =====================================
//      HANDLE CHANGE
//   ===================================== */

//   const handleChange =
//     (field, value) => {

//       setForm((prev) => ({
//         ...prev,
//         [field]:
//           value,
//       }));
//     };

//   /* =====================================
//      HANDLE UNIT
//   ===================================== */

//   const handleUnitChange =
//     (value) => {

//       setSelectedUnit(
//         value
//       );

//       if (
//         value !== "other"
//       ) {

//         handleChange(
//           "unit",
//           value
//         );
//       }
//     };

//   useEffect(() => {

//     if (
//       selectedUnit ===
//       "other"
//     ) {

//       handleChange(
//         "unit",
//         customUnit
//       );
//     }

//   }, [customUnit]);

//   /* =====================================
//    HANDLE IMAGES
// ===================================== */

// const handleImages =
//   (e) => {

//     const files =
//       Array.from(
//         e.target.files
//       );

//     const totalImages =
//       previewImages.length +
//       files.length;

//     if (
//       totalImages > 5
//     ) {

//       pushToast(
//         "Maximum 5 images allowed",
//         "error"
//       );

//       return;
//     }

//     const updatedImages = [
//       ...images,
//       ...files,
//     ];

//     const updatedPreviews = [
//       ...previewImages,

//       ...files.map(
//         (file) =>
//           URL.createObjectURL(
//             file
//           )
//       ),
//     ];

//     setImages(
//       updatedImages
//     );

//     setPreviewImages(
//       updatedPreviews
//     );

//     e.target.value = "";
//   };

// const removeImage =
//   (index) => {

//     setPreviewImages(
//       (prev) =>
//         prev.filter(
//           (_, i) =>
//             i !== index
//         )
//     );
//     };
  
//   /* =====================================
//    UPDATE LISTING
// ===================================== */
// const handleSubmit =
//   async () => {

//     try {

//       if (loading)
//         return;

//       if (
//         !selectedFarm
//       ) {

//         pushToast(
//           "Please select farm",
//           "error"
//         );

//         return;
//       }

//       if (
//         !selectedCrop
//       ) {

//         pushToast(
//           "Please select crop",
//           "error"
//         );

//         return;
//       }

//       if (
//         !form.quantity
//       ) {

//         pushToast(
//           "Please enter quantity",
//           "error"
//         );

//         return;
//       }

//       if (
//         !form.expected_price
//       ) {

//         pushToast(
//           "Please enter expected price",
//           "error"
//         );

//         return;
//       }

//       if (
//         !form.harvest_date
//       ) {

//         pushToast(
//           "Please select harvest date",
//           "error"
//         );

//         return;
//       }

//       if (
//         selectedUnit ===
//           "other" &&
//         !customUnit.trim()
//       ) {

//         pushToast(
//           "Please enter custom unit",
//           "error"
//         );

//         return;
//       }

//       setLoading(true);

//       const selectedFarmData =
//         farms.find(
//           (farm) =>
//             farm.id ===
//             selectedFarm
//         );

//       const selectedCropData =
//         crops.find(
//           (crop) =>
//             crop.id ===
//             selectedCrop
//         );

//       const payload = {
//         farm_id:
//           selectedFarm,

//         farm_name:
//           selectedFarmData?.farm_name ||
//           "",

//         crop_id:
//           selectedCrop,

//         crop_name:
//           selectedCropData?.crop_name ||
//           "",

//         quantity:
//           Number(
//             form.quantity
//           ),

//         unit:
//           form.unit,

//         expected_price:
//           Number(
//             form.expected_price
//           ),

//         harvest_date:
//           form.harvest_date,

//         village:
//           form.village,

//         taluka:
//           form.taluka,

//         district:
//           form.district,

//         state:
//           form.state,

//         description:
//           form.description ||
//           "",
//       };

//       console.log(
//         "UPDATE PAYLOAD",
//         payload
//       );

//       await MarketplaceService
//         .updateListing(
//           id,
//           payload
//         );

//       pushToast(
//         "Listing updated successfully",
//         "success"
//       );

//       navigate(
//         "/farmer/marketplace"
//       );

//     } catch (error) {

//       console.error(
//         "UPDATE ERROR",
//         error
//       );

//       console.log(
//         "BACKEND RESPONSE",
//         error?.response?.data
//       );

//       console.log(
//         "BACKEND DETAIL",
//         error?.response?.data?.detail
//       );

//       alert(
//         JSON.stringify(
//           error?.response?.data,
//           null,
//           2
//         )
//       );

//       pushToast(
//         "Update failed",
//         "error"
//       );

//     } finally {

//       setLoading(false);
//     }
//   };
  
  
  
// return (

//   <div className="
//     create-listing-page
//   ">

//     <PageHeader
//       title="
//         Edit Listing
//       "
//       subtitle="
//         Update marketplace listing
//       "
//     />

//     <Card>

//       <div className="
//         create-listing-form
//       ">

//         {/* FARM */}

//         <Select
//           label="Farm"
//           value={selectedFarm}
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

//         {/* CROP */}

//         <Select
//           label="Crop"
//           value={selectedCrop}
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

//         {/* QUANTITY + UNIT */}

//         <div className="
//           create-listing-row
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

//         {/* CUSTOM UNIT */}

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

//         {/* PRICE */}

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

//         {/* DATE */}

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

//         {/* LOCATION */}

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

//         {/* DESCRIPTION */}

//         <Input
//           label="
//             Description
//             (Optional)
//           "
//           placeholder="
//             Add crop quality,
//             freshness,
//             details...
//           "
//           value={
//             form.description
//           }
//           onChange={(e) =>
//             handleChange(
//               "description",
//               e.target.value
//             )
//           }
//         />

//         {/* IMAGE UPLOAD */}

//         <div className="
//           listing-upload
//         ">

//           <div
//             className="
//               listing-upload__box
//             "
//             onClick={() =>
//               fileInputRef
//                 .current
//                 ?.click()
//             }
//           >

//             <div className="
//               listing-upload__icon
//             ">
//               +
//             </div>

//             <h4>
//               Update Images
//             </h4>

//             <p>
//               Add up to
//               5 images
//             </p>

//             <Button
//               type="button"
//               variant="
//                 secondary
//               "
//             >
//               Choose Images
//             </Button>

//           </div>

//           <input
//             ref={
//               fileInputRef
//             }
//             type="file"
//             multiple
//             accept="
//               image/*
//             "
//             className="
//               listing-upload__input
//             "
//             onChange={
//               handleImages
//             }
//           />

//           {previewImages
//             .length > 0 && (

//             <div className="
//               listing-upload__preview-grid
//             ">

//               {previewImages.map(
//                 (
//                   image,
//                   index
//                 ) => (

//                 <div
//                   key={index}
//                   className="
//                     listing-upload__preview-card
//                   "
//                 >

//                   <img
//                     src={image}
//                     alt=""
//                     className="
//                       listing-upload__preview-image
//                     "
//                   />

//                   <button
//                     type="button"
//                     className="
//                       listing-upload__remove
//                     "
//                     onClick={() =>
//                       removeImage(
//                         index
//                       )
//                     }
//                   >
//                     ×
//                   </button>

//                 </div>

//               ))}

//             </div>
//           )}

//         </div>

//         {/* SUBMIT */}

//         <Button
//           onClick={
//             handleSubmit
//           }
//           disabled={
//             loading
//           }
//         >
//           {loading
//             ? "Updating..."
//             : "Update Listing"}
//         </Button>

//       </div>

//     </Card>

//   </div>
// );
// }

import "./Marketplace.css";

import { useTranslation } from "react-i18next";

import PageHeader
from "../../components/PageHeader";

import ListingForm
from "../../components/marketplace/ListingForm";

export default function EditListing() {

  const { t } =
    useTranslation();

  return (

    <div className="
      marketplace-page
    ">

      {/* ======================================
          HEADER
      ====================================== */}

      <PageHeader
        title={
          t(
            "marketplace.editListing"
          )
        }
        subtitle={
          t(
            "marketplace.updateMarketplaceListing"
          )
        }
      />

      {/* ======================================
          FORM
      ====================================== */}

      <ListingForm
        mode="edit"
      />

    </div>
  );
}