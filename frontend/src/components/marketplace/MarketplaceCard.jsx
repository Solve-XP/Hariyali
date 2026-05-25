// // src/components/marketplace/MarketplaceCard.jsx

// import "./MarketplaceCard.css";

// import Card from "../Card";
// import Button from "../Button";

// import ImageCarousel from "../ImageCarousel";
// import ContactActions from "../ContactActions";
// import LocationBadge from "../LocationBadge";

// export default function MarketplaceCard({

//   listing,

//   isOwner = false,

//   onViewDetails,

//   onEdit,

//   onDelete,

//   onImageClick,
// }) {

//   const formattedDate =
//     listing.harvest_date
//       ? new Date(
//           listing.harvest_date
//         ).toLocaleDateString(
//           "en-IN",
//           {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//           }
//         )
//       : "N/A";
//   return (

//     <Card className="marketplace-card">

//       {/* IMAGE */}

//       <div className="marketplace-card__image">

//         <ImageCarousel
//           images={listing.crop_images}
//           height={150}
//           onImageClick={onImageClick}
//         />

//       </div>

//       {/* BODY */}

//       <div className="marketplace-card__body">

//         {/* HEADER */}

//         <div className="marketplace-card__header">

//           <div>

//             <h3 className="marketplace-card__title">
//               {listing.crop_name}
//             </h3>

//             <p className="marketplace-card__farm">
//               {listing.farm_name}
//             </p>

//           </div>

//           <div >

//             <div className="marketplace-card__price">
//               ₹
//             {listing.expected_price?.toLocaleString()}
//             </div>
//             <p className="marketplace-card__farm">Expected Price</p>
            

//           </div>
           

//         </div>

//         {/* DETAILS */}

//         <div className="marketplace-card__meta">

//           <div className="marketplace-card__meta-item">
            
//             <strong>
//               {listing.quantity}
//               {" "}
//               {listing.unit}
//             </strong>
//             <p>Exp. Quantity</p>
//           </div>

//           <div className="marketplace-card__meta-item">

//             <strong>
//               {formattedDate}
//             </strong>
//             <p>Exp. Harvest Date</p>
//           </div>

//         </div>

//         {/* SELLER */}

//         <div className="marketplace-card__seller-inline">

//           <span className="marketplace-card__seller-name">
//             👤 {listing.seller_name}
//           </span>

//           <span className="marketplace-card__seller-phone">
//             {listing.seller_phone}
//           </span>

//         </div>

//         {/* LOCATION */}

//         <LocationBadge

//           village={listing.village}
//           district={listing.district}
//           state={listing.state}

//           className="marketplace-card__location"
//         />

//         {/* ACTIONS */}

//         <div className="marketplace-card__actions">

//           <Button
//             size="sm"
//             variant="secondary"
//             onClick={() =>
//               onViewDetails?.(listing)
//             }
//           >
//             Details
//           </Button>

//           {isOwner ? (

//             <>

//               <Button
//                 size="sm"
//                 variant="accent"
//                 onClick={() =>
//                   onEdit?.(listing)
//                 }
//               >
//                 Edit
//               </Button>

//               <Button
//                 size="sm"
//                 variant="danger"
//                 onClick={() =>
//                   onDelete?.(listing)
//                 }
//               >
//                 Delete
//               </Button>

//             </>

//           ) : (

//             <ContactActions
//               phone={listing.seller_phone}
//             />
//           )}

//         </div>

//       </div>

//     </Card>
//   );
// }

// src/components/marketplace/MarketplaceCard.jsx

import "./MarketplaceCard.css";

import { useTranslation } from "react-i18next";

import Card from "../Card";
import Button from "../Button";

import ImageCarousel from "../ImageCarousel";
import ContactActions from "../ContactActions";
import LocationBadge from "../LocationBadge";

export default function MarketplaceCard({

  listing,

  isOwner = false,

  onViewDetails,

  onEdit,

  onDelete,

  onImageClick,
}) {

  const { t } =
    useTranslation();

  const formattedDate =
    listing.harvest_date
      ? new Date(
          listing.harvest_date
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : t("common.na");

  return (

    <Card className="marketplace-card">

      {/* IMAGE */}

      <div className="marketplace-card__image">

        <ImageCarousel
          images={listing.crop_images}
          height={150}
          onImageClick={onImageClick}
        />

      </div>

      {/* BODY */}

      <div className="marketplace-card__body">

        {/* HEADER */}

        <div className="marketplace-card__header">

          <div>

            <h3 className="marketplace-card__title">
              {listing.crop_name}
            </h3>

            <p className="marketplace-card__farm">
              {listing.farm_name}
            </p>

          </div>

          <div>

            <div className="marketplace-card__price">
              ₹
              {listing.expected_price?.toLocaleString()}
            </div>

            <p className="marketplace-card__farm">
              {t(
                "marketplace.expectedPrice"
              )}
            </p>

          </div>

        </div>

        {/* DETAILS */}

        <div className="marketplace-card__meta">

          <div className="marketplace-card__meta-item">

            <strong>
              {listing.quantity}
              {" "}
              {listing.unit}
            </strong>

            <p>
              {t(
                "marketplace.expectedQuantity"
              )}
            </p>

          </div>

          <div className="marketplace-card__meta-item">

            <strong>
              {formattedDate}
            </strong>

            <p>
              {t(
                "marketplace.expectedHarvestDate"
              )}
            </p>

          </div>

        </div>

        {/* SELLER */}

        <div className="marketplace-card__seller-inline">

          <span className="marketplace-card__seller-name">
            👤 {listing.seller_name}
          </span>

          <span className="marketplace-card__seller-phone">
            {listing.seller_phone}
          </span>

        </div>

        {/* LOCATION */}

        <LocationBadge

          village={listing.village}
          district={listing.district}
          state={listing.state}

          className="marketplace-card__location"
        />

        {/* ACTIONS */}

        <div className="marketplace-card__actions">

          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              onViewDetails?.(listing)
            }
          >
            {t("common.details")}
          </Button>

          {isOwner ? (

            <>

              <Button
                size="sm"
                variant="accent"
                onClick={() =>
                  onEdit?.(listing)
                }
              >
                {t("common.edit")}
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() =>
                  onDelete?.(listing)
                }
              >
                {t("common.delete")}
              </Button>

            </>

          ) : (

            <ContactActions
              phone={listing.seller_phone}
            />
          )}

        </div>

      </div>

    </Card>
  );
}