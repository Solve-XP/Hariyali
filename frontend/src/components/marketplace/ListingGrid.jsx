import "./ListingGrid.css";

import ListingCard
from "./ListingCard";

export default function ListingGrid({
  listings = [],
  isOwner = false,
  type = "marketplace",
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}) {

  if (
    !listings?.length
  ) {

    return null;
  }

  return (

    <div className="
      listing-grid
    ">

      {listings.map(
        (listing) => (

        <ListingCard
          key={listing.id}

          listing={
            listing
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

      ))}

    </div>
  );
}