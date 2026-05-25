import "./RentalCard.css";

import {
  useTranslation,
} from "react-i18next";

import Card
from "../Card";

import Button
from "../Button";

import ImageCarousel
from "../ImageCarousel";

import ContactActions
from "../ContactActions";

export default function RentalCard({
  rental,
  isOwner = false,
  onViewDetails,
  onEdit,
  onDelete,
  onImageClick,
}) {

  const { t } =
    useTranslation();

  const title =
    rental
      ?.equipment_name ||

    t(
      "listing.untitled"
    );

  const owner =
    rental
      ?.owner_name ||

    t(
      "listing.unknownSeller"
    );

  const phone =
    rental
      ?.phone ||

    t(
      "common.na"
    );

  const images =
    rental
      ?.equipment_images ||
    [];

  const location =
    [

      rental?.village,

      rental?.taluka,

      rental?.district,

      rental?.state,

    ]
      .filter(Boolean)
      .join(", ");

  const hourlyPrice =
    rental
      ?.price_per_hour;

  const dailyPrice =
    rental
      ?.price_per_day;

  return (

    <Card
      className="
        rental-card
      "
    >

      {/* IMAGE */}

      <div
        className="
          rental-card__image
        "
      >

        <ImageCarousel
          images={
            images
          }
          height={220}
          onImageClick={
            onImageClick
          }
        />

      </div>

      {/* BODY */}

      <div
        className="
          rental-card__body
        "
      >

        {/* HEADER */}

        <div
          className="
            rental-card__header
          "
        >

          <div
            className="
              rental-card__heading
            "
          >

            <h3
              className="
                rental-card__title
              "
            >
              {title}
            </h3>

            <p>
              {t(
                "rental.equipmentName"
              )}
            </p>

          </div>

          <div
            className="
              rental-card__price
            "
          >

            {!!dailyPrice && (

              <div
                className="
                  rental-card__price-main
                "
              >
                ₹
                {Number(
                  dailyPrice
                ).toLocaleString()}

                <span>
                  {t(
                    "rental.perDay"
                  )}
                </span>
              </div>
            )}

            {!!hourlyPrice && (

              <div
                className="
                  rental-card__price-small
                "
              >
                ₹
                {Number(
                  hourlyPrice
                ).toLocaleString()}

                {t(
                  "rental.perHour"
                )}
              </div>
            )}

          </div>

        </div>

        {/* OWNER + PHONE */}

        <div
          className="
            rental-card__seller-row
          "
        >

          <div
            className="
              rental-card__seller-name
            "
          >

            <span>
              👤
            </span>

            <strong>
              {owner}
            </strong>

          </div>

          <div
            className="
              rental-card__seller-phone
            "
          >

            <span>
              📞
            </span>

            <strong>
              {phone}
            </strong>

          </div>

        </div>

        {/* LOCATION */}

        {!!location && (

          <div
            className="
              rental-card__location-wrap
            "
          >

            <p
              className="
                rental-card__location
              "
            >

              <strong>
                {location}
              </strong>

            </p>

          </div>
        )}

        {/* ACTIONS */}

        <div
          className="
            rental-card__actions
          "
        >

          <Button
            size="sm"
            variant="
              secondary
            "
            onClick={() =>
              onViewDetails?.(
                rental
              )
            }
          >
            {t(
              "common.details"
            )}
          </Button>

          {isOwner ? (

            <>
              <Button
                size="sm"
                variant="
                  accent
                "
                onClick={() =>
                  onEdit?.(
                    rental
                  )
                }
              >
                {t(
                  "common.edit"
                )}
              </Button>

              <Button
                size="sm"
                variant="
                  danger
                "
                onClick={() =>
                  onDelete?.(
                    rental
                  )
                }
              >
                {t(
                  "common.delete"
                )}
              </Button>
            </>

          ) : (

            <ContactActions
              phone={
                phone
              }
            />
          )}

        </div>

      </div>

    </Card>
  );
}