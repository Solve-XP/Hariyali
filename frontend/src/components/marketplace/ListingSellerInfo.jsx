// import "./ListingSellerInfo.css";

// import Card from "../Card";
// import Badge from "../Badge";
// import ContactActions from "../ContactActions";

// export default function ListingSellerInfo({
//   sellerName,
//   sellerPhone,
//   sellerType = "Farmer",
//   isVerified = false,
// }) {

//   return (

//     <Card className="
//       listing-seller
//     ">

//       {/* ======================================
//           HEADER
//       ====================================== */}

//       <div className="
//         listing-seller__header
//       ">

//         <div className="
//           listing-seller__avatar
//         ">
//           👤
//         </div>

//         <div className="
//           listing-seller__info
//         ">

//           <div className="
//             listing-seller__top
//           ">

//             <h3 className="
//               listing-seller__name
//             ">
//               {sellerName ||
//                 "Unknown Seller"}
//             </h3>

//             {isVerified && (
//               <Badge>
//                 Verified
//               </Badge>
//             )}

//           </div>

//           <p className="
//             listing-seller__role
//           ">
//             {sellerType}
//           </p>

//         </div>

//       </div>

//       {/* ======================================
//           CONTACT
//       ====================================== */}

//       <div className="
//         listing-seller__contact
//       ">

//         <div className="
//           listing-seller__phone
//         ">

//           <span>
//             📞
//           </span>

//           <span>
//             {sellerPhone ||
//               "N/A"}
//           </span>

//         </div>

//       </div>

//       {/* ======================================
//           ACTIONS
//       ====================================== */}

//       <div className="
//         listing-seller__actions
//       ">

//         <ContactActions
//           phone={
//             sellerPhone
//           }
//         />

//       </div>

//     </Card>
//   );
// }

import "./ListingSellerInfo.css";

import { useTranslation } from "react-i18next";

import Card from "../Card";
import Badge from "../Badge";
import ContactActions from "../ContactActions";

export default function ListingSellerInfo({
  sellerName,
  sellerPhone,
  sellerType = "Farmer",
  isVerified = false,
}) {

  const { t } =
    useTranslation();

  return (

    <Card className="
      listing-seller
    ">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="
        listing-seller__header
      ">

        <div className="
          listing-seller__avatar
        ">
          👤
        </div>

        <div className="
          listing-seller__info
        ">

          <div className="
            listing-seller__top
          ">

            <h3 className="
              listing-seller__name
            ">
              {sellerName ||
                t(
                  "listingSeller.unknownSeller"
                )}
            </h3>

            {isVerified && (
              <Badge>
                {t(
                  "listingSeller.verified"
                )}
              </Badge>
            )}

          </div>

          <p className="
            listing-seller__role
          ">
            {sellerType}
          </p>

        </div>

      </div>

      {/* ======================================
          CONTACT
      ====================================== */}

      <div className="
        listing-seller__contact
      ">

        <div className="
          listing-seller__phone
        ">

          <span>
            📞
          </span>

          <span>
            {sellerPhone ||
              t(
                "common.na"
              )}
          </span>

        </div>

      </div>

      {/* ======================================
          ACTIONS
      ====================================== */}

      <div className="
        listing-seller__actions
      ">

        <ContactActions
          phone={
            sellerPhone
          }
        />

      </div>

    </Card>
  );
}