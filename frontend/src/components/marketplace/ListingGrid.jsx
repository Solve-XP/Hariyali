import "./ListingGrid.css";

import {
  useApp,
} from "../../context/AppContext";

import {
  calculateDistance,
} from "../../utils/location";

import ListingCard
from "./ListingCard";

export default function ListingGrid({
  listings = [],
  isOwner = false,
  type = "marketplace",
  className = "",
  showDistance = false,
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}) {

  const {
    userLocation,
  } = useApp();

  if (
    !listings?.length
  ) {

    return null;
  }

  return (

    <div
      className={`
        listing-grid
        ${className}
      `}
    >

      {listings.map(
        (listing) => {

          let distance = null;

          if (

            showDistance &&
            
            userLocation?.latitude &&

            userLocation?.longitude &&

            listing?.latitude &&

            listing?.longitude

          ) {

            distance =
              calculateDistance(

                userLocation.latitude,

                userLocation.longitude,

                listing.latitude,

                listing.longitude
              );
          }

          return (

            <ListingCard
              key={
                listing.id
              }

              listing={
                listing
              }

              distance={
                distance
              }

              type={
                type
              }

              isOwner={
                isOwner
              }

              onViewDetails={
                onViewDetails
              }

              onEdit={
                onEdit
              }

              onDelete={
                onDelete
              }

              onImageClick={
                onImageClick
              }
            />

          );
        }
      )}

    </div>
  );
}