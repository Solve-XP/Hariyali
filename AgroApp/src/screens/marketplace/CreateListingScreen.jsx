// CONVERTED FROM: src/pages/marketplace/CreateListing.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import ScreenShell  from "../../components/ScreenShell";
import PageHeader   from "../../components/PageHeader";
import ListingForm  from "../../components/marketplace/ListingForm";

export default function CreateListingScreen() {
  const { t } = useTranslation();
  return (
    <ScreenShell title={t("marketplace.createListing")} showBack>
      <PageHeader
        title={t("marketplace.createListing")}
        subtitle={t("marketplace.sellYourCrops")}
      />
      <ListingForm mode="create" />
    </ScreenShell>
  );
}