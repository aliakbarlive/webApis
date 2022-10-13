import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAlertDetailsAsync, selectSelectedAlert } from '../alertsSlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import ListingFeatureBulletsChanged from './ListingFeatureBulletsChanged';
import ListingBuyboxWinnerChanged from './ListingBuyboxWinnerChanged';
import ListingDescriptionChanged from './ListingDescriptionChanged';
import ListingCategoriesChanged from './ListingCategoriesChanged';
import ListingImagesChanged from './ListingImagesChanged';
import ListingTitleChanged from './ListingTitleChanged';
import ListingPriceChanged from './ListingPriceChanged';
import AlertDetailsModal from './AlertDetailsModal';
import NewReviewAlert from './NewReviewAlert';
import LowStockAlert from './LowStockAlert';
import RatingAlert from './RatingAlert';

const ShowMoreButton = ({ alertId }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const alert = useSelector(selectSelectedAlert);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const components = {
    listingFeatureBulletsChanged: ListingFeatureBulletsChanged,
    listingBuyboxWinnerChanged: ListingBuyboxWinnerChanged,
    listingDescriptionChanged: ListingDescriptionChanged,
    listingCategoriesChanged: ListingCategoriesChanged,
    listingImagesChanged: ListingImagesChanged,
    listingTitleChanged: ListingTitleChanged,
    listingPriceChanged: ListingPriceChanged,
    lowStock: LowStockAlert,
    newReview: NewReviewAlert,
    rating: RatingAlert,
  };

  const onClick = async () => {
    setLoading(true);

    if (alert.alertId !== alertId) {
      await dispatch(
        getAlertDetailsAsync(alertId, {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
        })
      );
    }

    setShowModal(true);
    setLoading(false);
  };

  return (
    <>
      <button
        type="button"
        className="mr-2 items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
        disabled={loading}
        onClick={onClick}
      >
        Show more
      </button>

      <AlertDetailsModal
        alert={alert}
        open={showModal}
        setOpen={setShowModal}
        Component={alert ? components[alert.type] : null}
      />
    </>
  );
};

export default ShowMoreButton;
