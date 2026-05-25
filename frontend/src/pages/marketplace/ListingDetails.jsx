import {
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import "./Marketplace.css";

import Card
from "../../components/Card";

import Button
from "../../components/Button";

import Modal
from "../../components/Modal";

import ConfirmDialog
from "../../components/ConfirmDialog";

import LocationBadge
from "../../components/LocationBadge";

import ListingSkeleton
from "../../components/marketplace/ListingSkeleton";

import ListingSellerInfo
from "../../components/marketplace/ListingSellerInfo";

import ListingImageSlider
from "../../components/marketplace/ListingImageSlider";

import {
  MarketplaceService,
} from "../../services/marketplaceService";

import {
  getErrorMessage,
} from "../../utils/errorHandler";

import {
  useApp,
} from "../../context/AppContext";

import {
  useAuth,
} from "../../context/AuthContext";

export default function ListingDetails() {

  const { t } =useTranslation();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { id } =
    useParams();

  const {
    pushToast,
  } = useApp();

  const {
    user,
    isFarmer,
  } = useAuth();

  const [listing,
    setListing] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [deleteOpen,
    setDeleteOpen] =
    useState(false);

  /* ==========================================
      CLOSE
  ========================================== */

  function handleClose() {

  const from =
    location.state
      ?.from;

  /* ======================================
      FARMER MY LISTINGS
  ====================================== */

  if (
    from ===
    "my-listings"
  ) {

    navigate(
      "/farmer/marketplace/my-listings"
    );

    return;
  }

  /* ======================================
      MERCHANT
  ====================================== */

  if (
    location.pathname.includes(
      "/merchant/"
    )
  ) {

    navigate(
      "/merchant/marketplace"
    );

    return;
  }

  /* ======================================
      MARKETPLACE
  ====================================== */

  navigate(
    "/farmer/marketplace"
  );
}

  /* ==========================================
      FETCH
  ========================================== */

  async function fetchListing() {

    try {

      setLoading(
        true
      );

      const response =
        await MarketplaceService
          .getListingById(
            id
          );

      const data =
        response?.data;

      setListing(
        data
      );

    } catch (
      error
    ) {

      pushToast(

        getErrorMessage(
          error
        ) ||

        "Failed to load listing",

        "error"
      );

      handleClose();

    } finally {

      setLoading(
        false
      );
    }
  }

  useEffect(() => {

    if (id) {

      fetchListing();
    }

  }, [id]);

  /* ==========================================
      DELETE
  ========================================== */

  async function handleDelete() {

    try {

      await MarketplaceService
        .deleteListing(
          listing.id
        );

      pushToast(
        "Listing deleted successfully",
        "success"
      );

      setDeleteOpen(
        false
      );

      navigate(
        "/farmer/marketplace/my-listings"
      );

    } catch (
      error
    ) {

      pushToast(

        getErrorMessage(
          error
        ) ||

        "Failed to delete listing",

        "error"
      );
    }
  }

  /* ==========================================
      HELPERS
  ========================================== */

  const isOwner =
    listing?.seller_phone ===
    user?.phone_number;

  const formattedDate =
    listing?.harvest_date

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

      : "N/A";
  
  
  // console.log("PARAM ID", id);
  // console.log("PATH", location.pathname);

  /* ==========================================
      RENDER
  ========================================== */

  // return (

  //   <Modal
  //     open={true}
  //     onClose={
  //       handleClose
  //     }
  //     title=""
  //     width="1250px"
  //   >

  //     {loading ? (

  //       <ListingSkeleton
  //         count={1}
  //       />

  //     ) : (

  //       <div className="
  //         marketplace-details
  //       ">

  //         {/* ==================================
  //             LEFT SIDE
  //         =================================== */}

  //         <div className="
  //           marketplace-details__gallery
  //         ">

  //           <ListingImageSlider
  //             images={
  //               listing
  //                 ?.crop_images ||
  //               []
  //             }
  //           />

  //         </div>

  //         {/* ==================================
  //             RIGHT SIDE
  //         =================================== */}

  //         <div className="
  //           marketplace-details__content
  //         ">

  //           {/* HEADER */}

  //           <div className="
  //             marketplace-details__header
  //           ">

  //             <div>

  //               <h1 className="
  //                 marketplace-details__title
  //               ">

  //                 {
  //                   listing.crop_name
  //                 }

  //               </h1>

  //               <p className="
  //                 marketplace-details__farm
  //               ">

  //                 {
  //                   listing.farm_name
  //                 }

  //               </p>

  //             </div>

  //             <div className="
  //               marketplace-details__price
  //             ">

  //               ₹
  //               {Number(
  //                 listing.expected_price ||
  //                 0
  //               ).toLocaleString()}

  //             </div>

  //           </div>

  //           {/* DETAILS */}

  //           <Card>

  //             <div className="
  //               marketplace-details__grid
  //             ">

  //               <div>
  //                 <strong>
  //                   Quantity
  //                 </strong>

  //                 <span>
  //                   {
  //                     listing.quantity
  //                   }
  //                   {" "}
  //                   {
  //                     listing.unit
  //                   }
  //                 </span>
  //               </div>

  //               <div>
  //                 <strong>
  //                   Harvest Date
  //                 </strong>

  //                 <span>
  //                   {
  //                     formattedDate
  //                   }
  //                 </span>
  //               </div>

  //               <div>
  //                 <strong>
  //                   Village
  //                 </strong>

  //                 <span>
  //                   {
  //                     listing.village
  //                   }
  //                 </span>
  //               </div>

  //               <div>
  //                 <strong>
  //                   Taluka
  //                 </strong>

  //                 <span>
  //                   {
  //                     listing.taluka
  //                   }
  //                 </span>
  //               </div>

  //               <div>
  //                 <strong>
  //                   District
  //                 </strong>

  //                 <span>
  //                   {
  //                     listing.district
  //                   }
  //                 </span>
  //               </div>

  //               <div>
  //                 <strong>
  //                   Status
  //                 </strong>

  //                 <span>
  //                   {
  //                     listing.status
  //                   }
  //                 </span>
  //               </div>

  //             </div>

  //           </Card>

  //           {/* LOCATION */}

  //           <Card
  //             style={{
  //               marginTop:
  //                 18,
  //             }}
  //           >

  //             <div className="
  //               listing-section
  //             ">

  //               <h3>
  //                 Location
  //               </h3>

  //               <LocationBadge
  //                 village={
  //                   listing.village
  //                 }
  //                 taluka={
  //                   listing.taluka
  //                 }
  //                 district={
  //                   listing.district
  //                 }
  //                 state={
  //                   listing.state
  //                 }
  //               />

  //             </div>

  //           </Card>

  //           {/* DESCRIPTION */}

  //           <Card
  //             style={{
  //               marginTop:
  //                 18,
  //             }}
  //           >

  //             <div className="
  //               listing-section
  //             ">

  //               <h3>
  //                 Description
  //               </h3>

  //               <p>

  //                 {
  //                   listing
  //                     ?.description
  //                     ?.trim()

  //                     ||

  //                   "No description provided by seller."
  //                 }

  //               </p>

  //             </div>

  //           </Card>

  //           {/* SELLER */}

  //           <Card
  //             style={{
  //               marginTop:
  //                 18,
  //             }}
  //           >

  //             <ListingSellerInfo
  //               sellerName={
  //                 listing
  //                   ?.seller_name
  //               }

  //               sellerPhone={
  //                 listing
  //                   ?.seller_phone
  //               }
  //             />

  //           </Card>

  //           {/* OWNER ACTIONS */}

  //           {isOwner &&
  //             isFarmer && (

  //             <Card
  //               style={{
  //                 marginTop:
  //                   18,
  //               }}
  //             >

  //               <div className="
  //                 listing-actions
  //               ">

  //                 <Button
  //                   onClick={() =>
  //                     navigate(
  //                       `/farmer/marketplace/edit/${listing.id}`
  //                     )
  //                   }
  //                 >
  //                   Edit Listing
  //                 </Button>

  //                 <Button
  //                   variant="
  //                     danger
  //                   "
  //                   onClick={() =>
  //                     setDeleteOpen(
  //                       true
  //                     )
  //                   }
  //                 >
  //                   Delete
  //                 </Button>

  //               </div>

  //             </Card>
  //           )}

  //         </div>

  //       </div>
  //     )}

  //     <ConfirmDialog
  //       open={
  //         deleteOpen
  //       }
  //       title="
  //         Delete Listing
  //       "
  //       message="
  //         Are you sure you want
  //         to delete this listing?
  //       "
  //       confirmText="
  //         Delete
  //       "
  //       onConfirm={
  //         handleDelete
  //       }
  //       onCancel={() =>
  //         setDeleteOpen(
  //           false
  //         )
  //       }
  //     />

  //   </Modal>
  // );


  return (

    <Modal
      open={true}
      onClose={
        handleClose
      }
      title=""
      width="1250px"
    >

      {loading ? (

        <ListingSkeleton
          count={1}
        />

      ) : (

        <div className="
          marketplace-details
        ">

          {/* ==================================
              LEFT SIDE
          =================================== */}

          <div className="
            marketplace-details__gallery
          ">

            <ListingImageSlider
              images={
                listing
                  ?.crop_images ||
                []
              }
            />

          </div>

          {/* ==================================
              RIGHT SIDE
          =================================== */}

          <div className="
            marketplace-details__content
          ">

            {/* HEADER */}

            <div className="
              marketplace-details__header
            ">

              <div>

                <h1 className="
                  marketplace-details__title
                ">

                  {
                    listing.crop_name
                  }

                </h1>

                <p className="
                  marketplace-details__farm
                ">

                  {
                    listing.farm_name
                  }

                </p>

              </div>

              <div className="
                marketplace-details__price
              ">

                ₹
                {Number(
                  listing.expected_price ||
                  0
                ).toLocaleString()}

              </div>

            </div>

            {/* DETAILS */}

            <Card>

              <div className="
                marketplace-details__grid
              ">

                <div>
                  <strong>
                    {t(
                      "listingDetails.quantity"
                    )}
                  </strong>

                  <span>
                    {
                      listing.quantity
                    }
                    {" "}
                    {
                      listing.unit
                    }
                  </span>
                </div>

                <div>
                  <strong>
                    {t(
                      "listingDetails.harvestDate"
                    )}
                  </strong>

                  <span>
                    {
                      formattedDate
                    }
                  </span>
                </div>

                <div>
                  <strong>
                    {t(
                      "listingDetails.village"
                    )}
                  </strong>

                  <span>
                    {
                      listing.village
                    }
                  </span>
                </div>

                <div>
                  <strong>
                    {t(
                      "listingDetails.taluka"
                    )}
                  </strong>

                  <span>
                    {
                      listing.taluka
                    }
                  </span>
                </div>

                <div>
                  <strong>
                    {t(
                      "listingDetails.district"
                    )}
                  </strong>

                  <span>
                    {
                      listing.district
                    }
                  </span>
                </div>

                <div>
                  <strong>
                    {t(
                      "listingDetails.status"
                    )}
                  </strong>

                  <span>
                    {
                      listing.status
                    }
                  </span>
                </div>

              </div>

            </Card>

            {/* LOCATION */}

            <Card
              style={{
                marginTop:
                  18,
              }}
            >

              <div className="
                listing-section
              ">

                <h3>
                  {t(
                    "listingDetails.location"
                  )}
                </h3>

                <LocationBadge
                  village={
                    listing.village
                  }
                  taluka={
                    listing.taluka
                  }
                  district={
                    listing.district
                  }
                  state={
                    listing.state
                  }
                />

              </div>

            </Card>

            {/* DESCRIPTION */}

            <Card
              style={{
                marginTop:
                  18,
              }}
            >

              <div className="
                listing-section
              ">

                <h3>
                  {t(
                    "listingDetails.description"
                  )}
                </h3>

                <p>

                  {
                    listing
                      ?.description
                      ?.trim()

                      ||

                    t(
                      "listingDetails.noDescription"
                    )
                  }

                </p>

              </div>

            </Card>

            {/* SELLER */}

            <Card
              style={{
                marginTop:
                  18,
              }}
            >

              <ListingSellerInfo
                sellerName={
                  listing
                    ?.seller_name
                }

                sellerPhone={
                  listing
                    ?.seller_phone
                }
              />

            </Card>

            {/* OWNER ACTIONS */}

            {isOwner &&
              isFarmer && (

              <Card
                style={{
                  marginTop:
                    18,
                }}
              >

                <div className="
                  listing-actions
                ">

                  <Button
                    onClick={() =>
                      navigate(
                        `/farmer/marketplace/edit/${listing.id}`
                      )
                    }
                  >
                    {t(
                      "listingDetails.editListing"
                    )}
                  </Button>

                  <Button
                    variant="
                      danger
                    "
                    onClick={() =>
                      setDeleteOpen(
                        true
                      )
                    }
                  >
                    {t(
                      "common.delete"
                    )}
                  </Button>

                </div>

              </Card>
            )}

          </div>

        </div>
      )}

      <ConfirmDialog
        open={
          deleteOpen
        }
        title={
          t(
            "listingDetails.deleteListing"
          )
        }
        message={
          t(
            "listingDetails.deleteConfirm"
          )
        }
        confirmText={
          t(
            "common.delete"
          )
        }
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setDeleteOpen(
            false
          )
        }
      />

    </Modal>
  );
}
