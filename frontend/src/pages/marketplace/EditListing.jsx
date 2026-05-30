

import "./Marketplace.css";

import { useTranslation } from "react-i18next";

import PageHeader
from "../../components/PageHeader";

import ListingForm
from "../../components/marketplace/ListingForm";

export default function EditListing() {

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
            "marketplace.editListing"
          )
        }
        subtitle={
          t(
            "marketplace.updateMarketplaceListing"
          )
        }
      />

      {/* ======================================
          FORM
      ====================================== */}

      <ListingForm
        mode="edit"
      />

    </div>
  );
}