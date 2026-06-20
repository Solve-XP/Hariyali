// CONVERTED FROM: src/pages/marketplace/EditListing.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import ScreenShell  from "../../components/ScreenShell";
import PageHeader   from "../../components/PageHeader";
import ListingForm  from "../../components/marketplace/ListingForm";

export default function EditListingScreen() {
  const { t } = useTranslation();
  return (
    <ScreenShell title={t("marketplace.editListing")} showBack>
      <PageHeader
        title={t("marketplace.editListing")}
        subtitle={t("marketplace.updateMarketplaceListing")}
      />
      <ListingForm mode="edit" />
    </ScreenShell>
  );
}