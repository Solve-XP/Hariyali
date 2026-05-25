import { useTranslation } from "react-i18next";

import EmptyState
from "../EmptyState";

import Button
from "../Button";

export default function ListingEmptyState({
  title = "No listings found",
  subtitle = "Try changing filters or create a listing.",
  actionText,
  onAction,
}) {

  const { t } =
    useTranslation();

  return (

    <div className="
      listing-empty-state
    ">

      <EmptyState
        message={
          title ===
          "No listings found"
            ? t(
                "listing.noListingsFound"
              )
            : title
        }
      />

      {subtitle && (

        <p className="
          listing-empty-state__subtitle
        ">

          {subtitle ===
          "Try changing filters or create a listing."
            ? t(
                "listing.tryChangingFilters"
              )
            : subtitle}

        </p>
      )}

      {actionText && (
        <Button
          onClick={
            onAction
          }
        >
          {actionText}
        </Button>
      )}

    </div>
  );
}