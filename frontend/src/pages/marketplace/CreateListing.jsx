import "./Marketplace.css";

import { useTranslation } from "react-i18next";

import PageHeader
from "../../components/PageHeader";

import ListingForm
from "../../components/marketplace/ListingForm";

export default function CreateListing() {

  const { t } =
    useTranslation();

  return (

    <div className="
      marketplace-page
    ">

      {/* ======================================
          HEADER
      ====================================== */}

      <PageHeader
        title={
          t(
            "marketplace.createListing"
          )
        }
        subtitle={
          t(
            "marketplace.sellYourCrops"
          )
        }
      />

      {/* ======================================
          FORM
      ====================================== */}

      <ListingForm
        mode="create"
      />

    </div>
  );
}