// import "./ListingImageSlider.css";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// export default function ListingImageSlider({
//   images = [],
// }) {

//   /* ==========================================
//       NORMALIZE IMAGES
//   ========================================== */

//   const validImages =
//     useMemo(() => {

//       return images.filter(
//         Boolean
//       );

//     }, [images]);

//   /* ==========================================
//       STATE
//   ========================================== */

//   const [selectedIndex,
//     setSelectedIndex] =
//     useState(0);

//   /* ==========================================
//       RESET IMAGE
//   ========================================== */

//   useEffect(() => {

//     setSelectedIndex(
//       0
//     );

//   }, [images]);

//   /* ==========================================
//       CURRENT IMAGE
//   ========================================== */

//   const selectedImage =
//     validImages[
//       selectedIndex
//     ];

//   /* ==========================================
//       EMPTY
//   ========================================== */

//   if (
//     !validImages.length
//   ) {

//     return (

//       <div className="
//         listing-gallery
//         listing-gallery--empty
//       ">

//         <div className="
//           listing-gallery__empty
//         ">

//           <div className="
//             listing-gallery__empty-icon
//           ">
//             🖼️
//           </div>

//           <h3>
//             No Images Available
//           </h3>

//           <p>
//             Seller has not uploaded
//             any images yet.
//           </p>

//         </div>

//       </div>
//     );
//   }

//   /* ==========================================
//       RENDER
//   ========================================== */

//   return (

//     <div className="
//       listing-gallery
//     ">

//       {/* ======================================
//           MAIN IMAGE
//       ====================================== */}

//       <div className="
//         listing-gallery__main
//       ">

//         <img
//           src={
//             selectedImage
//           }
//           alt="
//             Listing
//           "
//           className="
//             listing-gallery__main-image
//           "
//         />

//       </div>

//       {/* ======================================
//           THUMBNAILS
//       ====================================== */}

//       {validImages.length >
//         1 && (

//         <div className="
//           listing-gallery__thumbs
//         ">

//           {validImages.map(
//             (
//               image,
//               index
//             ) => (

//               <button
//                 key={
//                   index
//                 }

//                 className={`
//                   listing-gallery__thumb
//                   ${
//                     selectedIndex ===
//                     index
//                       ? "listing-gallery__thumb--active"
//                       : ""
//                   }
//                 `}

//                 onClick={() =>
//                   setSelectedIndex(
//                     index
//                   )
//                 }
//               >

//                 <img
//                   src={
//                     image
//                   }
//                   alt={`
//                     Thumbnail ${index + 1}
//                   `}
//                 />

//               </button>
//             )
//           )}

//         </div>
//       )}

//     </div>
//   );
// }

import "./ListingImageSlider.css";

import { useTranslation } from "react-i18next";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

export default function ListingImageSlider({
  images = [],
}) {

  const { t } =
    useTranslation();

  /* ==========================================
      NORMALIZE IMAGES
  ========================================== */

  const validImages =
    useMemo(() => {

      return images.filter(
        Boolean
      );

    }, [images]);

  /* ==========================================
      STATE
  ========================================== */

  const [selectedIndex,
    setSelectedIndex] =
    useState(0);

  /* ==========================================
      RESET IMAGE
  ========================================== */

  useEffect(() => {

    setSelectedIndex(
      0
    );

  }, [images]);

  /* ==========================================
      CURRENT IMAGE
  ========================================== */

  const selectedImage =
    validImages[
      selectedIndex
    ];

  /* ==========================================
      EMPTY
  ========================================== */

  if (
    !validImages.length
  ) {

    return (

      <div className="
        listing-gallery
        listing-gallery--empty
      ">

        <div className="
          listing-gallery__empty
        ">

          <div className="
            listing-gallery__empty-icon
          ">
            🖼️
          </div>

          <h3>
            {t(
              "listingImage.noImagesAvailable"
            )}
          </h3>

          <p>
            {t(
              "listingImage.sellerNoImages"
            )}
          </p>

        </div>

      </div>
    );
  }

  /* ==========================================
      RENDER
  ========================================== */

  return (

    <div className="
      listing-gallery
    ">

      {/* ======================================
          MAIN IMAGE
      ====================================== */}

      <div className="
        listing-gallery__main
      ">

        <img
          src={
            selectedImage
          }
          alt={
            t(
              "listingImage.listing"
            )
          }
          className="
            listing-gallery__main-image
          "
        />

      </div>

      {/* ======================================
          THUMBNAILS
      ====================================== */}

      {validImages.length >
        1 && (

        <div className="
          listing-gallery__thumbs
        ">

          {validImages.map(
            (
              image,
              index
            ) => (

              <button
                key={
                  index
                }

                className={`
                  listing-gallery__thumb
                  ${
                    selectedIndex ===
                    index
                      ? "listing-gallery__thumb--active"
                      : ""
                  }
                `}

                onClick={() =>
                  setSelectedIndex(
                    index
                  )
                }
              >

                <img
                  src={
                    image
                  }
                  alt={`
                    ${t(
                      "listingImage.thumbnail"
                    )} ${index + 1}
                  `}
                />

              </button>
            )
          )}

        </div>
      )}

    </div>
  );
}