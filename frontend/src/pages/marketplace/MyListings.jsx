import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import "./Marketplace.css";

import PageHeader
from "../../components/PageHeader";

import Button
from "../../components/Button";

import ConfirmDialog
from "../../components/ConfirmDialog";

import ListingGrid
from "../../components/marketplace/ListingGrid";

import ListingFilters
from "../../components/marketplace/ListingFilters";

import ListingSkeleton
from "../../components/marketplace/ListingSkeleton";

import ListingEmptyState
from "../../components/marketplace/ListingEmptyState";

import MarketplaceTabs
from "../../components/marketplace/MarketplaceTabs";

import {
  MarketplaceService,
} from "../../services/marketplaceService";

import {
  getErrorMessage,
} from "../../utils/errorHandler";

import {
  useApp,
} from "../../context/AppContext";

export default function MyListings() {

  const { t } =
    useTranslation();

  const navigate =
    useNavigate();

  const {
    pushToast,
  } = useApp();

  const [listings,
    setListings] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [sortBy,
    setSortBy] =
    useState("latest");

  const [deleteModal,
    setDeleteModal] =
    useState({
      open: false,
      listing: null,
    });

  function applySorting(
    data = []
  ) {

    const sorted =
      [...data];

    switch (
      sortBy
    ) {

      case
        "price-low":

        sorted.sort(
          (a, b) =>
            (a.expected_price || 0) -
            (b.expected_price || 0)
        );

        break;

      case
        "price-high":

        sorted.sort(
          (a, b) =>
            (b.expected_price || 0) -
            (a.expected_price || 0)
        );

        break;

      case
        "oldest":

        sorted.sort(
          (a, b) =>
            new Date(
              a.created_at
            ) -
            new Date(
              b.created_at
            )
        );

        break;

      default:

        sorted.sort(
          (a, b) =>
            new Date(
              b.created_at
            ) -
            new Date(
              a.created_at
            )
        );
    }

    return sorted;
  }

  async function fetchListings() {

    try {

      setLoading(
        true
      );

      const response =
        await MarketplaceService
          .getMyListings({
            search,
          });

      const data =
        response?.data ||
        [];

      setListings(
        applySorting(
          data
        )
      );

    } catch (
      error
    ) {

      pushToast(
        getErrorMessage(
          error
        ) ||
        t(
          "myListings.failedToLoad"
        ),
        "error"
      );

    } finally {

      setLoading(
        false
      );
    }
  }

  async function handleDelete() {

    try {

      const id =
        deleteModal
          ?.listing
          ?.id;

      await MarketplaceService
        .deleteListing(
          id
        );

      pushToast(
        t(
          "myListings.deletedSuccess"
        ),
        "success"
      );

      setDeleteModal({
        open: false,
        listing: null,
      });

      fetchListings();

    } catch (
      error
    ) {

      pushToast(
        getErrorMessage(
          error
        ) ||
        t(
          "myListings.failedToDelete"
        ),
        "error"
      );
    }
  }

  useEffect(() => {

    fetchListings();

  }, [
    search,
    sortBy,
  ]);

  return (

    <div className="
      marketplace-page
    ">

      <PageHeader
        title={
          t(
            "marketplace.myListings"
          )
        }

        subtitle={
          t(
            "myListings.manageListings"
          )
        }

        action={

          <Button
            onClick={() =>
              navigate(
                "/farmer/marketplace/create"
              )
            }
          >
            {t(
              "myListings.addListing"
            )}
          </Button>
        }
      />

      <MarketplaceTabs />

      <ListingFilters
        search={
          search
        }

        onSearchChange={
          setSearch
        }

        sortBy={
          sortBy
        }

        onSortChange={
          setSortBy
        }

        showLocationFilters={
          false
        }
      />

      {loading ? (

        <ListingSkeleton
          count={6}
        />

      ) : !listings
          ?.length ? (

        <ListingEmptyState
          title={
            t(
              "myListings.noListingsFound"
            )
          }

          subtitle={
            t(
              "myListings.noListingSubtitle"
            )
          }

          actionText={
            t(
              "marketplace.createListing"
            )
          }

          onAction={() =>
            navigate(
              "/farmer/marketplace/create"
            )
          }
        />

      ) : (

        <ListingGrid
          showDistance={false}
          listings={
            listings
          }

          isOwner={
            true
          }

          onViewDetails={(
              listing
            ) =>
              navigate(
                `/farmer/marketplace/${listing.id}`,
                {
                  state: {
                    from:
                      "my-listings",
                  },
                }
              )
            }

          onEdit={(
            listing
          ) =>
            navigate(
              `/farmer/marketplace/edit/${listing.id}`
            )
          }

          onDelete={(
            listing
          ) =>
            setDeleteModal({
              open: true,
              listing,
            })
          }
        />

      )}

      <ConfirmDialog
        open={
          deleteModal.open
        }

        title={
          t(
            "listingDetails.deleteListing"
          )
        }

        message={
          t(
            "listingDetails.deleteConfirm"
          )
        }

        confirmText={
          t(
            "common.delete"
          )
        }

        onConfirm={
          handleDelete
        }

        onCancel={() =>
          setDeleteModal({
            open: false,
            listing: null,
          })
        }
      />

    </div>
  );
}