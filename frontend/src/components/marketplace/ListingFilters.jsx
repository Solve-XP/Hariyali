import "./ListingFilters.css";

import { useTranslation } from "react-i18next";

import SearchInput
from "../SearchInput";

import Select
from "../Select";

export default function ListingFilters({
  search = "",
  onSearchChange,

  sortBy = "latest",
  onSortChange,

  radius = 20,
  onRadiusChange,

  stateFilter = "",
  districtFilter = "",
  talukaFilter = "",

  onStateChange,
  onDistrictChange,
  onTalukaChange,

  showLocationFilters = true,
}) {

  const { t } =
    useTranslation();

  //   return (

  //     <div className="
  //       listing-filters
  //     ">

  //       {/* ======================================
  //           SEARCH
  //       ====================================== */}

  //       <div className="
  //         listing-filters__search
  //       ">

  //         <SearchInput
  //           value={search}
  //           onChange={(e) =>
  //             onSearchChange?.(
  //               e.target.value
  //             )
  //           }
  //           placeholder={
  //             t(
  //               "listing.searchPlaceholder"
  //             )
  //           }
  //         />

  //       </div>

  //       {/* ======================================
  //           FILTERS
  //       ====================================== */}

  //       <div className="
  //         listing-filters__controls
  //       ">

  //         {showLocationFilters && (
  //           <>
  //             <InputSelect
  //               label={
  //                 t(
  //                   "location.state"
  //                 )
  //               }
  //               value={
  //                 stateFilter
  //               }
  //               onChange={
  //                 onStateChange
  //               }
  //               placeholder={
  //                 t(
  //                   "listing.allStates"
  //                 )
  //               }
  //             />

  //             <InputSelect
  //               label={
  //                 t(
  //                   "location.district"
  //                 )
  //               }
  //               value={
  //                 districtFilter
  //               }
  //               onChange={
  //                 onDistrictChange
  //               }
  //               placeholder={
  //                 t(
  //                   "listing.allDistricts"
  //                 )
  //               }
  //             />

  //             <InputSelect
  //               label={
  //                 t(
  //                   "location.taluka"
  //                 )
  //               }
  //               value={
  //                 talukaFilter
  //               }
  //               onChange={
  //                 onTalukaChange
  //               }
  //               placeholder={
  //                 t(
  //                   "listing.allTaluka"
  //                 )
  //               }
  //             />
  //           </>
  //         )}

  //         {/* ======================================
  //             SORT
  //         ====================================== */}
       
  //         <div className="listing-filters__radius">

  //           <input
  //             type="number"
  //             min="1"
  //             value={radius}
  //             onChange={(e) =>
  //               onRadiusChange?.(
  //                 Number(e.target.value)
  //               )
  //             }
  //             className="
  //               listing-filters__radius-input
  //             "
  //           />

  //           <span
  //             className="
  //               listing-filters__radius-label
  //             "
  //           >
  //             {t(
  //               "listing.showListingsWithin"
  //             )}
  //           </span>

  //         </div>

  //         <div className="
  //           listing-filters__sort
  //         ">

  //           <Select
  //             value={
  //               sortBy
  //             }
  //             onChange={(e) =>
  //               onSortChange?.(
  //                 e.target.value
  //               )
  //             }
  //           >

  //             <option value="latest">
  //               {t(
  //                 "listing.latestListings"
  //               )}
  //             </option>

  //             <option value="oldest">
  //               {t(
  //                 "listing.oldestListings"
  //               )}
  //             </option>

  //             <option value="price-low">
  //               {t(
  //                 "listing.priceLowHigh"
  //               )}
  //             </option>

  //             <option value="price-high">
  //               {t(
  //                 "listing.priceHighLow"
  //               )}
  //             </option>

  //           </Select>

  //         </div>

  //       </div>

  //     </div>
  //   );
  // }

  // /* ==========================================
  //    SMALL REUSABLE SELECT
  // ========================================== */

  // function InputSelect({
  //   label,
  //   value,
  //   onChange,
  //   placeholder,
  // }) {

  //   return (

  //     <div className="
  //       listing-filters__field
  //     ">

  //       <Select
  //         label={label}
  //         value={value}
  //         onChange={(e) =>
  //           onChange?.(
  //             e.target.value
  //           )
  //         }
  //       >

  //         <option value="">
  //           {placeholder}
  //         </option>

  //       </Select>

  //     </div>
  //   );
  // }

  return (

    <div className="
    listing-filters
  ">

      <div className="
      listing-filters__search
    ">

        <SearchInput
          value={search}
          onChange={(e) =>
            onSearchChange?.(
              e.target.value
            )
          }
          placeholder={
            t(
              "listing.searchPlaceholder"
            )
          }
        />

      </div>

      <div className="
      listing-filters__radius
    ">

        <input
          type="number"
          min="1"
          value={radius}
          onChange={(e) =>
            onRadiusChange?.(
              Number(
                e.target.value
              )
            )
          }
          className="
          listing-filters__radius-input
        "
        />

        <span
          className="
          listing-filters__radius-label
        "
        >
          {t(
            "listing.showListingsWithin"
          )}
        </span>

      </div>

      <div className="
      listing-filters__sort
    ">

        <Select
          value={
            sortBy
          }
          onChange={(e) =>
            onSortChange?.(
              e.target.value
            )
          }
        >

          <option value="latest">
            {t(
              "listing.latestListings"
            )}
          </option>

          <option value="oldest">
            {t(
              "listing.oldestListings"
            )}
          </option>

          <option value="price-low">
            {t(
              "listing.priceLowHigh"
            )}
          </option>

          <option value="price-high">
            {t(
              "listing.priceHighLow"
            )}
          </option>

        </Select>

      </div>

    </div>
  );
}