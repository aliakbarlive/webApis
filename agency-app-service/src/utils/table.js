import ReactTooltip from 'react-tooltip';

import {
  AMAZON_PRODUCT_DEFAULT_IMAGE,
  AMAZON_PRODUCT_BASE_URL,
} from './constants';

export const headerClasses =
  'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase';

export const columnClasses = 'px-4 py-2 text-sm text-gray-500';

export const productNameFormatter = (
  cell,
  { productName, asin, sellerSku, listingImages, thumbnail }
) => {
  let imageUrl = thumbnail ? thumbnail : AMAZON_PRODUCT_DEFAULT_IMAGE;

  if (listingImages && Array.isArray(listingImages) && listingImages[0].link) {
    imageUrl = listingImages[0].link;
  }

  return (
    <div className="flex">
      <div className="mr-4 flex-shrink-0 self-center">
        <img
          className="h-16 w-16 border border-transparent sm:rounded-lg shadow"
          src={imageUrl}
          alt={productName}
        />
      </div>
      <div>
        <p
          data-tip={productName}
          className="text-sm font-medium text-gray-900 mb-1.5"
        >
          {productName && productName.length > 35
            ? `${productName.substr(0, 35)}...`
            : productName}
        </p>
        <ReactTooltip
          place="top"
          className="max-w-xs text-black"
          backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
          textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
        />

        {asin && (
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-1">
              <a href={`${AMAZON_PRODUCT_BASE_URL}/${asin}`}>ASIN: {asin}</a>
            </span>
          </div>
        )}
        {sellerSku && (
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              SKU: {sellerSku}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
