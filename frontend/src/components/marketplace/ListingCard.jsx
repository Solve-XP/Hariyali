import "./ListingCard.css";

import { useTranslation } from "react-i18next";

import Card from "../Card";
import Button from "../Button";
import Badge from "../Badge";

import ImageCarousel from "../ImageCarousel";
import ContactActions from "../ContactActions";

export default function ListingCard({
  listing,
  type = "marketplace",
  isOwner = false,
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}) {
  const { t } = useTranslation();

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
      : t("common.na");

  const priceLabel =
    type === "rental"
      ? t("listing.rentalPrice")
      : t("listing.expectedPrice");

  const quantityLabel =
    type === "rental"
      ? t("listing.available")
      : t("listing.expectedQuantity");

  const dateLabel =
    type === "rental"
      ? t("listing.availableDate")
      : t("listing.harvestDate");

  const title =
    listing?.crop_name ||
    listing?.equipment_name ||
    t("listing.untitled");

  const subtitle =
    listing?.farm_name ||
    listing?.owner_name ||
    "";

  const price =
    listing?.expected_price ||
    listing?.rental_price ||
    0;

  const images =
    listing?.crop_images ||
    listing?.images ||
    [];

  return (
    <Card
      className="
        listing-card
      "
    >
      {/* IMAGE */}

      <div
        className="
          listing-card__image
        "
      >
        <ImageCarousel
          images={images}
          height={180}
          onImageClick={
            onImageClick
          }
        />

        {listing?.is_verified && (
          <div
            className="
              listing-card__badge
            "
          >
            <Badge>
              {t(
                "listing.verified"
              )}
            </Badge>
          </div>
        )}
      </div>

      {/* BODY */}

      <div
        className="
          listing-card__body
        "
      >
        {/* HEADER */}

        <div
          className="
            listing-card__header
          "
        >
          <div
            className="
              listing-card__heading
            "
          >
            <h3
              className="
                listing-card__title
              "
            >
              {title}
            </h3>

            <p
              className="
                listing-card__subtitle
              "
            >
              {subtitle}
            </p>
          </div>

          <div
            className="
              listing-card__price-wrap
            "
          >
            <div
              className="
                listing-card__price
              "
            >
              ₹
              {Number(
                price
              ).toLocaleString()}
            </div>

            <p
              className="
                listing-card__price-label
              "
            >
              {priceLabel}
            </p>
          </div>
        </div>

        {/* META */}

        <div
          className="
            listing-card__meta
          "
        >
          <div
            className="
              listing-card__meta-item
            "
          >
            <strong>
              {listing?.quantity}
              {" "}
              {listing?.unit}
            </strong>

            <p>
              {quantityLabel}
            </p>
          </div>

          <div
            className="
              listing-card__meta-item
            "
          >
            <strong>
              {formattedDate}
            </strong>

            <p>
              {dateLabel}
            </p>
          </div>
        </div>

        {/* SELLER */}

        <div
          className="
            listing-card__seller
          "
        >
          <div
            className="
              listing-card__seller-row
            "
          >
            <p
              className="
                listing-card__seller-name
              "
            >
              👤{" "}
              {listing?.seller_name ||
                t(
                  "listing.unknownSeller"
                )}
            </p>

            <p
              className="
                listing-card__seller-phone
              "
            >
              📞{" "}
              {listing?.seller_phone ||
                t("common.na")}
            </p>
          </div>
        </div>

        {/* LOCATION */}

        <p
          className="
            listing-card__location
          "
        >
          <strong>
            {listing?.village}

            {listing?.taluka &&
              `, ${listing.taluka}`}

            {listing?.district &&
              `, ${listing.district}`}

            {listing?.state &&
              `, ${listing.state}`}
          </strong>
        </p>

        {/* ACTIONS */}

        <div
          className="
            listing-card__actions
          "
        >
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              onViewDetails?.(
                listing
              )
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
                  onEdit?.(
                    listing
                  )
                }
              >
                {t("common.edit")}
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() =>
                  onDelete?.(
                    listing
                  )
                }
              >
                {t("common.delete")}
              </Button>
            </>
          ) : (
            <ContactActions
              phone={
                listing?.seller_phone
              }
            />
          )}
        </div>
      </div>
    </Card>
  );
}