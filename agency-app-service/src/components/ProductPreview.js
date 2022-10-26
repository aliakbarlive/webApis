import ReactTooltip from 'react-tooltip';

import {
  AMAZON_PRODUCT_BASE_URL,
  AMAZON_PRODUCT_DEFAULT_IMAGE,
} from '../utils/constants';

const ProductPreview = ({
  productName,
  asin,
  sku,
  imageUrl = AMAZON_PRODUCT_DEFAULT_IMAGE,
  displayImage = true,
  truncate = true,
  displayTooltip = true,
  identifierClassName,
  onClick,
}) => {
  const onProductClicked = () => {
    if (onClick) onClick();
  };

  return (
    <div className="flex" onClick={onProductClicked}>
      {displayImage && (
        <div className="mr-4 flex-shrink-0 self-center">
          <img
            className="h-16 w-16 border border-transparent sm:rounded-lg shadow"
            src={imageUrl ?? AMAZON_PRODUCT_DEFAULT_IMAGE}
            alt={productName}
          />
        </div>
      )}
      <div>
        {productName && (
          <>
            <p
              data-tip={productName}
              className="text-xs font-medium text-gray-900 mb-1.5"
            >
              {productName && truncate && productName.length > 35
                ? `${productName.substr(0, 35)}...`
                : productName}
            </p>
            {displayTooltip && (
              <ReactTooltip
                place="top"
                className="max-w-xs text-black"
                backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
              />
            )}
          </>
        )}

        <div className={identifierClassName}>
          {asin && (
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-1">
                <a href={`${AMAZON_PRODUCT_BASE_URL}/${asin}`}>ASIN: {asin}</a>
              </span>
            </div>
          )}
          {sku && (
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                SKU: {sku}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
