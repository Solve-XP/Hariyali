// CONVERTED FROM: src/pages/marketplace/MyListings.jsx
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenShell       from "../../components/ScreenShell";
import PageHeader        from "../../components/PageHeader";
import Button            from "../../components/Button";
import ConfirmDialog     from "../../components/ConfirmDialog";
import ListingGrid       from "../../components/marketplace/ListingGrid";
import ListingFilters    from "../../components/marketplace/ListingFilters";
import ListingSkeleton   from "../../components/marketplace/ListingSkeleton";
import ListingEmptyState from "../../components/marketplace/ListingEmptyState";
import MarketplaceTabs   from "../../components/marketplace/MarketplaceTabs";

import { MarketplaceService } from "../../services/marketplaceService";
import { getErrorMessage }    from "../../utils/errorHandler";
import { useApp }             from "../../context/AppContext";
import { spacing }            from "../../theme";

export default function MyListingsScreen() {
  const { t }         = useTranslation();
  const navigation    = useNavigation();
  const { pushToast } = useApp();

  const [listings,    setListings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [sortBy,      setSortBy]      = useState("latest");
  const [deleteModal, setDeleteModal] = useState({ open: false, listing: null });

  function applySorting(data = []) {
    const sorted = [...data];
    if (sortBy === "price-low")  sorted.sort((a, b) => (a.expected_price || 0) - (b.expected_price || 0));
    if (sortBy === "price-high") sorted.sort((a, b) => (b.expected_price || 0) - (a.expected_price || 0));
    if (sortBy === "oldest")     sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === "latest")     sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return sorted;
  }

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await MarketplaceService.getMyListings({ search });
      setListings(applySorting(response?.data || []));
    } catch (error) {
      pushToast(getErrorMessage(error) || t("myListings.failedToLoad"), "error");
    } finally {
      setLoading(false);
    }
  }, [search, sortBy]);

  useEffect(() => { fetchListings(); }, [search, sortBy]);

  const handleDelete = async () => {
    try {
      await MarketplaceService.deleteListing(deleteModal?.listing?.id);
      pushToast(t("myListings.deletedSuccess"), "success");
      setDeleteModal({ open: false, listing: null });
      fetchListings();
    } catch (error) {
      pushToast(getErrorMessage(error) || t("myListings.failedToDelete"), "error");
    }
  };

  return (
    <ScreenShell title={t("marketplace.myListings")}>
      <PageHeader
        title={t("marketplace.myListings")}
        subtitle={t("myListings.manageListings")}
        action={
          <Button onPress={() => navigation.navigate("CreateListing")}>
            {t("myListings.addListing")}
          </Button>
        }
      />

      <MarketplaceTabs />

      <ListingFilters
        search={search}   onSearchChange={setSearch}
        sortBy={sortBy}   onSortChange={setSortBy}
        showLocationFilters={false}
      />

      {loading ? (
        <ListingSkeleton count={4} />
      ) : !listings?.length ? (
        <ListingEmptyState
          title={t("myListings.noListingsFound")}
          subtitle={t("myListings.noListingSubtitle")}
          actionText={t("marketplace.createListing")}
          onAction={() => navigation.navigate("CreateListing")}
        />
      ) : (
        <ListingGrid
          showDistance={false}
          listings={listings}
          isOwner
          onViewDetails={(l) => navigation.navigate("ListingDetails", { id: l.id, from: "my-listings" })}
          onEdit={(l)    => navigation.navigate("EditListing",    { id: l.id })}
          onDelete={(l)  => setDeleteModal({ open: true, listing: l })}
        />
      )}

      <ConfirmDialog
        open={deleteModal.open}
        title={t("listingDetails.deleteListing")}
        message={t("listingDetails.deleteConfirm")}
        confirmText={t("common.delete")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, listing: null })}
      />
    </ScreenShell>
  );
}